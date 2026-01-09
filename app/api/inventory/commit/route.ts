import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  console.log("--------------------------------");
  console.log("📝 Commit API Hit");

  try {
    const body = await req.json();
    console.log("📦 Payload received:", body);

    const { items, tenantId } = body;

    if (!tenantId) {
      console.error("❌ Missing Tenant ID");
      return NextResponse.json({ error: "Tenant ID is missing" }, { status: 400 });
    }

    // Loop through items
    for (const item of items) {
      console.log(`🔄 Processing: ${item.name}`);

      // 1. Check Global Product
      let globalProductId = null;
      const { data: existingProduct, error: fetchError } = await supabase
        .from('global-product-master-catalog')
        .select('product-id')
        .eq('product-name', item.name)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ Global DB Fetch Error:", fetchError);
        throw fetchError;
      }

      if (existingProduct) {
        globalProductId = existingProduct['product-id'];
      } else {
        console.log("   --> Creating new Global Product");
        const { data: newProduct, error: createError } = await supabase
          .from('global-product-master-catalog')
          .insert({
            'product-name': item.name,
            'upc-ean-code': item.sku || null,
            'enrichment-source': 'invoice'
          })
          .select()
          .single();

        if (createError) {
          console.error("❌ Global Product Create Error:", createError);
          throw createError;
        }
        globalProductId = newProduct['product-id'];
      }

      // 2. Add Batch
      // First, get or create the store_inventory link
      let inventoryId = null;
      const { data: existingInventory } = await supabase
        .from('retail-store-inventory-item')
        .select('inventory-id')
        .eq('tenant-id', tenantId)
        .eq('global-product-id', globalProductId)
        .maybeSingle();

      if (existingInventory) {
        inventoryId = existingInventory['inventory-id'];
      } else {
        console.log("   --> Linking to Store Inventory");
        const { data: newInv, error: invError } = await supabase
          .from('retail-store-inventory-item')
          .insert({
            'tenant-id': tenantId,
            'global-product-id': globalProductId
          })
          .select()
          .single();

        if (invError) {
          console.error("❌ Store Inventory Error:", invError);
          throw invError;
        }
        inventoryId = newInv['inventory-id'];
      }

      // 3. Insert Batch
      console.log("   --> Inserting Batch...");
      const { error: batchError } = await supabase
        .from('inventory-batch-tracking-record')
        .insert({
          'inventory-id': inventoryId,
          'batch-quantity-count': parseInt(item.qty),
          'expiry-date-timestamp': item.expiry || null,
          'purchase-price-amount': item.unit_cost || 0
        });

      if (batchError) {
        console.error("❌ Batch Insert Error:", batchError);
        throw batchError;
      }
    }

    console.log("✅ Success!");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ CRASH:", error.message || error);
    return NextResponse.json({ error: error.message || "Unknown Error" }, { status: 500 });
  }
}