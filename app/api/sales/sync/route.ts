import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    // 2. Process Each Sale
    for (const sale of sales) {
      let inventoryId = null;

      // A. CHECK MAPPING TABLE
      const { data: existingMap } = await supabase
        .from('pos-item-mapping')
        .select('matched-inventory-id, last-sold-price')
        .eq('tenant-id', tenantId)
        .eq('pos-item-name', sale.name)
        .maybeSingle();

      const map = existingMap as any;
      if (map?.['matched-inventory-id']) {
        inventoryId = map['matched-inventory-id'];

        // Update Price History
        if (map['last-sold-price'] !== sale.sold_price) {
          await supabase.from('pos-item-mapping').update({
            'previous-sold-price': map['last-sold-price'], // Assuming previous-sold-price exists, implied pattern
            'last-sold-price': sale.sold_price
          }).eq('pos-item-name', sale.name).eq('tenant-id', tenantId);
        }
      }
      else {
        // B. NEW ITEM DISCOVERED - Fuzzy Match or Create Stub
        // Try to find a clean inventory item with similar name
        const { data: match } = await supabase
          .from('retail-store-inventory-item')
          .select('inventory-id, global_products:global-product-master-catalog!inner(product-name)')
          .ilike('global-product-master-catalog.product-name', `%${sale.name}%`)
          .eq('tenant-id', tenantId)
          .limit(1)
          .maybeSingle();

        if (match) {
          inventoryId = (match as any)['inventory-id'];
        } else {
          // C. CREATE STUB INVENTORY (The "Ghost" Item)
          // We create a temp global product so it shows up in inventory list
          const { data: newGlobal } = await supabase
            .from('global-product-master-catalog')
            .insert({ 'product-name': sale.name + " (POS Import)", 'description-text': 'POS Stub' }) // source-type uncertain, using desc
            .select()
            .single();

          const { data: newInv } = await supabase
            .from('retail-store-inventory-item')
            .insert({
              'tenant-id': tenantId,
              'global-product-id': (newGlobal as any)['global-product-id'], // Assuming PK is global-product-id
              'selling-price-amount': sale.sold_price
            })
            .select()
            .single();

          inventoryId = (newInv as any)['inventory-id'];
        }

        // Create the Mapping Record for future
        await supabase.from('pos-item-mapping').insert({
          'tenant-id': tenantId,
          'pos-item-name': sale.name,
          'pos-item-code': sale.sku || null,
          'matched-inventory-id': inventoryId,
          'last-sold-price': sale.sold_price,
          'is-verified': !!match // If we fuzzy matched, it's auto-verified? No, let's mark false to be safe.
        });
      }

      // D. DEDUCT STOCK (Allow Negative)
      // First, try to eat existing positive batches
      const { data: batches } = await supabase
        .from('inventory-batch-tracking-record')
        .select('*')
        .eq('inventory-id', inventoryId)
        .gt('batch-quantity-count', 0)
        .order('expiry-date-timestamp', { ascending: true }); // Assuming expiry is used for FIFO

      let qtyRemainingToDeduct = sale.qty;

      if (batches) {
        for (const batch of batches) {
          if (qtyRemainingToDeduct <= 0) break;
          const currentQty = batch['batch-quantity-count'];
          const deduction = Math.min(currentQty, qtyRemainingToDeduct);

          await supabase
            .from('inventory-batch-tracking-record')
            .update({ 'batch-quantity-count': currentQty - deduction })
            .eq('batch-id', batch['batch-id']); // Assuming PK is batch-id

          qtyRemainingToDeduct -= deduction;
        }
      }

      // E. NEGATIVE BALANCE HANDLER
      // If we still need to deduct (qtyRemainingToDeduct > 0), create a negative batch
      if (qtyRemainingToDeduct > 0) {
        await supabase.from('inventory-batch-tracking-record').insert({
          'inventory-id': inventoryId,
          'batch-quantity-count': -qtyRemainingToDeduct, // Negative value
          'expiry-date-timestamp': new Date().toISOString(), // Required field probably?
          // status?
        });
      }

      results.push({ name: sale.name, status: 'processed', qty: sale.qty });
    }

    return NextResponse.json({ success: true, processed: results });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}