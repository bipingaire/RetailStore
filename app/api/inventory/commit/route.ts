import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

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

      // 1. Check Global Product (By SKU first, then Name)
      let globalProductId = null;
      let existingProduct = null;

      // A. Try finding by SKU if available
      if (item.sku) {
        const { data: skuMatch } = await supabase
          .from('global-product-master-catalog')
          .select('product-id')
          .eq('upc-ean-code', item.sku)
          .maybeSingle();

        if (skuMatch) existingProduct = skuMatch;
      }

      // B. If no SKU match, try Name
      if (!existingProduct) {
        const { data: nameMatch } = await supabase
          .from('global-product-master-catalog')
          .select('product-id')
          .eq('product-name', item.name)
          .maybeSingle();

        if (nameMatch) existingProduct = nameMatch;
      }

      if (existingProduct) {
        globalProductId = existingProduct['product-id'];
        console.log(`   --> Found existing Global Product: ${globalProductId}`);
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
            'global-product-id': globalProductId,
            'is-active': true, // Explicitly set active on creation
            'current-stock-quantity': 0 // Initialize at 0, update later
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

      // 4. Update Inventory Total Stock & ensure Active
      // We manually update the parent record to reflect the new stock
      console.log("   --> Updating Inventory Totals...");

      // Fetch current stock first (safe increment)
      const { data: currentInv } = await supabase
        .from('retail-store-inventory-item')
        .select('current-stock-quantity')
        .eq('inventory-id', inventoryId)
        .single();

      const newTotal = (currentInv?.['current-stock-quantity'] || 0) + parseInt(item.qty);

      await supabase
        .from('retail-store-inventory-item')
        .update({
          'current-stock-quantity': newTotal,
          'is-active': true  // Force Active so it shows in "My Inventory"
        })
        .eq('inventory-id', inventoryId);
    }

    console.log("✅ Success!");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ CRASH:", error.message || error);
    return NextResponse.json({ error: error.message || "Unknown Error" }, { status: 500 });
  }
}