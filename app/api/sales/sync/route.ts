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
    for (const sale of sales) {
      let inventoryId = null;

      // A. CHECK MAPPING TABLE (Has this weird name been seen before?)
      const { data: existingMap } = await supabase
        .from('pos_mappings')
        .select('store_inventory_id, last_sold_price')
        .eq('tenant_id', tenantId)
        .eq('pos_name', sale.name)
        .maybeSingle();

      if (existingMap?.store_inventory_id) {
        inventoryId = existingMap.store_inventory_id;

        // Update Price History
        if (existingMap.last_sold_price !== sale.sold_price) {
          await supabase.from('pos_mappings').update({
            previous_sold_price: existingMap.last_sold_price,
            last_sold_price: sale.sold_price
          }).eq('pos_name', sale.name).eq('tenant_id', tenantId);
        }
      }
      else {
        // B. NEW ITEM DISCOVERED - Fuzzy Match or Create Stub
        // Try to find a clean inventory item with similar name
        const { data: match } = await supabase
          .from('store_inventory')
          .select('id, global_products!inner(name)')
          .ilike('global_products.name', `%${sale.name}%`)
          .eq('tenant_id', tenantId)
          .limit(1)
          .maybeSingle();

        if (match) {
          inventoryId = match.id;
        } else {
          // C. CREATE STUB INVENTORY (The "Ghost" Item)
          // We create a temp global product so it shows up in inventory list
          const { data: newGlobal } = await supabase
            .from('global_products')
            .insert({ name: sale.name + " (POS Import)", source_type: 'pos_stub' })
            .select()
            .single();

          const { data: newInv } = await supabase
            .from('store_inventory')
            .insert({
              tenant_id: tenantId,
              global_product_id: newGlobal.id,
              price: sale.sold_price
            })
            .select()
            .single();

          inventoryId = newInv.id;
        }

        // Create the Mapping Record for future
        await supabase.from('pos_mappings').insert({
          tenant_id: tenantId,
          pos_name: sale.name,
          pos_code: sale.sku || null,
          store_inventory_id: inventoryId,
          last_sold_price: sale.sold_price,
          is_verified: !!match // If we fuzzy matched, it's auto-verified? No, let's mark false to be safe.
        });
      }

      // D. DEDUCT STOCK (Allow Negative)
      // First, try to eat existing positive batches
      const { data: batches } = await supabase
        .from('inventory_batches')
        .select('*')
        .eq('store_inventory_id', inventoryId)
        .gt('batch_quantity', 0)
        .order('expiry_date', { ascending: true });

      let qtyRemainingToDeduct = sale.qty;

      if (batches) {
        for (const batch of batches) {
          if (qtyRemainingToDeduct <= 0) break;
          const deduction = Math.min(batch.batch_quantity, qtyRemainingToDeduct);

          await supabase
            .from('inventory_batches')
            .update({ batch_quantity: batch.batch_quantity - deduction })
            .eq('id', batch.id);

          qtyRemainingToDeduct -= deduction;
        }
      }

      // E. NEGATIVE BALANCE HANDLER
      // If we still need to deduct (qtyRemainingToDeduct > 0), create a negative batch
      if (qtyRemainingToDeduct > 0) {
        await supabase.from('inventory_batches').insert({
          store_inventory_id: inventoryId,
          batch_quantity: -qtyRemainingToDeduct, // Negative value
          arrival_date: new Date(),
          status: 'sold_oversell'
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