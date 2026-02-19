import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { imageUrl, tenantId } = await req.json();

    // 1. AI Parsing (Extract Raw POS Data)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Extract sold items from this POS Sales Report Image.
          Return JSON: { "sales": [ { "name": "Raw POS Name", "sku": "POS Code", "qty": 5, "sold_price": 2.50 } ] }.
          Ignore totals/tax lines.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Parse this sales report." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const cleanJson = completion.choices[0].message.content?.replace(/```json/g, '').replace(/```/g, '').trim();
    const { sales } = JSON.parse(cleanJson || '{ "sales": [] }');
    const results = [];

    // 2. Process Each Sale
    for (const sale of sales) {
      let inventoryId = null;

      // A. CHECK MAPPING TABLE (Has this weird name been seen before?)
      const { data: existingMap } = await supabase
        .from('pos-item-mapping')
        .select('matched-inventory-id, last-sold-price')
        .eq('tenant-id', tenantId)
        .eq('pos-item-name', sale.name)
        .maybeSingle();

      if (existingMap?.["matched-inventory-id"]) {
        inventoryId = existingMap["matched-inventory-id"];

        // Update Price History
        if (existingMap["last-sold-price"] !== sale.sold_price) {
          await supabase.from('pos-item-mapping').update({
            'last-sold-price': sale.sold_price
          }).eq('pos-item-name', sale.name).eq('tenant-id', tenantId);
        }
      }
      else {
        // B. NEW ITEM DISCOVERED - Fuzzy Match or Create Stub
        // Try to find a clean inventory item with similar name (fuzzy match via ILIKE)
        const { data: match } = await supabase
          .from('retail-store-inventory-item')
          .select('inventory-id, global:global-product-master-catalog!inner(product-name)')
          .ilike('global.product-name', `%${sale.name}%`)
          .eq('tenant-id', tenantId)
          .limit(1)
          .maybeSingle();

        if (match) {
          inventoryId = match['inventory-id'];
          // Auto-verify? Let's verify it if we found a match to save time, but mark as unverified mapping
        } else {
          // C. CREATE STUB INVENTORY (The "Ghost" Item)
          // We create a temp global product so it shows up in inventory list
          const { data: newGlobal } = await supabase
            .from('global-product-master-catalog')
            .insert({
              'product-name': sale.name + " (POS Import)",
              'enrichment-source': 'pos_stub',
              'is-active': true
            })
            .select('product-id')
            .single();

          const { data: newInv } = await supabase
            .from('retail-store-inventory-item')
            .insert({
              'tenant-id': tenantId,
              'global-product-id': newGlobal['product-id'],
              'selling-price-amount': sale.sold_price,
              'current-stock-quantity': 0, // Will become negative correctly below
              'is-active': true
            })
            .select('inventory-id')
            .single();

          inventoryId = newInv['inventory-id'];
        }

        // Create the Mapping Record for future
        await supabase.from('pos-item-mapping').insert({
          'tenant-id': tenantId,
          'pos-item-name': sale.name,
          'pos-item-code': sale.sku || null,
          'matched-inventory-id': inventoryId,
          'last-sold-price': sale.sold_price,
          'is-verified': !!match // If we fuzzy matched, it's a guess, so verified=false usually safer, but if accurate let's leave false
        });
      }

      // D. DEDUCT STOCK (Allow Negative)
      // First, try to eat existing positive batches
      const { data: batches } = await supabase
        .from('inventory-batch-tracking-record')
        .select('batch-id, batch-quantity-count')
        .eq('inventory-id', inventoryId)
        .gt('batch-quantity-count', 0)
        .order('expiry-date-timestamp', { ascending: true });

      let qtyRemainingToDeduct = sale.qty;

      if (batches) {
        for (const batch of batches) {
          if (qtyRemainingToDeduct <= 0) break;
          const currentQty = batch['batch-quantity-count'];
          const deduction = Math.min(currentQty, qtyRemainingToDeduct);

          await supabase
            .from('inventory-batch-tracking-record')
            .update({ 'batch-quantity-count': currentQty - deduction })
            .eq('batch-id', batch['batch-id']);

          qtyRemainingToDeduct -= deduction;
        }
      }

      // E. NEGATIVE BALANCE HANDLER / PARENT UPDATE
      // Update the parent record total. Even if we didn't have batches, we subtract from total.
      // (Simplified logic: We just blindly subtract the sold amount from the parent total)
      const { data: parent } = await supabase.from('retail-store-inventory-item').select('current-stock-quantity').eq('inventory-id', inventoryId).single();

      if (parent) {
        await supabase
          .from('retail-store-inventory-item')
          .update({
            'current-stock-quantity': (parent['current-stock-quantity'] || 0) - sale.qty
          })
          .eq('inventory-id', inventoryId);
      }

      // We don't necessarily create negative batches for oversell in this model, just tracking the parent total is enough for now.

      results.push({ name: sale.name, status: 'processed', qty: sale.qty, qty_deducted: sale.qty });
    }

    return NextResponse.json({ success: true, processed: results });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}