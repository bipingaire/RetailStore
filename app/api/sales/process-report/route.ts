import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
export async function POST(req: Request) {
    // Initialize Supabase Client inside handler (Runtime only)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    try {
        const { items, tenantId } = await req.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
        }
        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
        }

        console.log(`Processing ${items.length} items for tenant ${tenantId}`);

        const results = [];

        for (const item of items) {
            // Map frontend fields (Z-Report) to logic fields
            const sale = {
                name: item.productName || 'Unknown Item',
                sku: item.skuCode || null,
                qty: Number(item.quantitySold) || 0,
                sold_price: (Number(item.totalAmount) / (Number(item.quantitySold) || 1)) || 0
            };

            if (sale.qty <= 0) continue;

            let inventoryId = null;

            // =================================================================
            // 1. IDENTIFY INVENTORY ITEM (Mapping -> Fuzzy -> Stub)
            // =================================================================

            // A. Check POS Mapping
            const { data: existingMap } = await supabase
                .from('pos-item-mapping')
                .select('matched-inventory-id, last-sold-price')
                .eq('tenant-id', tenantId)
                .eq('pos-item-name', sale.name)
                .maybeSingle();

            if (existingMap?.["matched-inventory-id"]) {
                inventoryId = existingMap["matched-inventory-id"];

                // Update price history if changed
                if (Number(existingMap["last-sold-price"]) !== sale.sold_price) {
                    await supabase.from('pos-item-mapping')
                        .update({ 'last-sold-price': sale.sold_price })
                        .eq('pos-item-name', sale.name)
                        .eq('tenant-id', tenantId);
                }
            }
            else {
                // B. Fuzzy Match in Inventory
                const { data: match } = await supabase
                    .from('retail-store-inventory-item')
                    .select('inventory-id, global:global-product-master-catalog!inner(product-name)')
                    .ilike('global.product-name', `%${sale.name}%`)
                    .eq('tenant-id', tenantId)
                    .limit(1)
                    .maybeSingle();

                if (match) {
                    inventoryId = match['inventory-id'];
                } else {
                    // C. Create Stub (Ghost Item)
                    console.log(`Creating stub for: ${sale.name}`);

                    const { data: newGlobal, error: gErr } = await supabase
                        .from('global-product-master-catalog')
                        .insert({
                            'product-name': sale.name + " (Z-Report)",
                            'enrichment-source': 'z_report_stub',
                            'is-active': true
                        })
                        .select('product-id')
                        .single();

                    if (gErr) throw gErr;

                    const { data: newInv, error: iErr } = await supabase
                        .from('retail-store-inventory-item')
                        .insert({
                            'tenant-id': tenantId,
                            'global-product-id': newGlobal['product-id'],
                            'selling-price-amount': sale.sold_price,
                            'current-stock-quantity': 0,
                            'is-active': true
                        })
                        .select('inventory-id')
                        .single();

                    if (iErr) throw iErr;
                    inventoryId = newInv['inventory-id'];
                }

                // Create Mapping
                await supabase.from('pos-item-mapping').insert({
                    'tenant-id': tenantId,
                    'pos-item-name': sale.name,
                    'pos-item-code': sale.sku,
                    'matched-inventory-id': inventoryId,
                    'last-sold-price': sale.sold_price,
                    'is-verified': !!match
                });
            }

            // =================================================================
            // 2. DEDUCT STOCK
            // =================================================================

            // A. Try to eat from Batches (FIFO)
            const { data: batches } = await supabase
                .from('inventory-batch-tracking-record')
                .select('batch-id, batch-quantity-count')
                .eq('inventory-id', inventoryId)
                .gt('batch-quantity-count', 0)
                .order('expiry-date-timestamp', { ascending: true });

            let qtyRemaining = sale.qty;

            if (batches) {
                for (const batch of batches) {
                    if (qtyRemaining <= 0) break;
                    const currentQty = batch['batch-quantity-count'];
                    const deduction = Math.min(currentQty, qtyRemaining);

                    await supabase
                        .from('inventory-batch-tracking-record')
                        .update({ 'batch-quantity-count': currentQty - deduction })
                        .eq('batch-id', batch['batch-id']);

                    qtyRemaining -= deduction;
                }
            }

            // B. Update Parent Total (Always)
            const { data: parent } = await supabase
                .from('retail-store-inventory-item')
                .select('current-stock-quantity')
                .eq('inventory-id', inventoryId)
                .single();

            if (parent) {
                const currentTotal = parent['current-stock-quantity'] || 0;
                await supabase
                    .from('retail-store-inventory-item')
                    .update({
                        'current-stock-quantity': currentTotal - sale.qty
                    })
                    .eq('inventory-id', inventoryId);
            }

            results.push({ name: sale.name, deducted: sale.qty });
        }

        return NextResponse.json({ success: true, processed: results });

    } catch (err: any) {
        console.error("Z-Report Process Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
