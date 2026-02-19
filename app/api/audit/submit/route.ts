import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { tenantId, category, items } = await req.json();

    // 1. Calculate Financial Impact
    let netVarianceValue = 0;
    const discrepancies = items.filter((i: any) => i.actual !== i.expected);

    // 2. Create Audit Record
    const { data: audit, error: auditError } = await supabase
      .from('shelf-audit-record')
      .insert({
        'tenant-id': tenantId,
        'total-items-checked': items.length,
        'total-discrepancies': discrepancies.length,
        'performed-by-user-id': null // Ideally get from session, but for now allow null
      })
      .select('audit-id')
      .single();

    if (auditError) throw auditError;

    // 3. Process Discrepancies
    for (const item of discrepancies) {
      const variance = item.actual - item.expected;
      const dollarValue = variance * item.price; // Approximate value
      netVarianceValue += dollarValue;

      // A. Log the line item
      await supabase.from('shelf-audit-item').insert({
        'audit-id': audit['audit-id'],
        'inventory-id': item.id,
        'expected-quantity': item.expected,
        'actual-quantity': item.actual,
        'reason-code': variance < 0 ? 'SHRINKAGE' : 'FOUND_STOCK'
      });

      // B. Adjust Inventory
      if (variance < 0) {
        // SHRINKAGE (Theft/Loss): Remove from batches (FIFO)
        let qtyToRemove = Math.abs(variance);

        const { data: batches } = await supabase
          .from('inventory-batch-tracking-record')
          .select('batch-id, batch-quantity-count')
          .eq('inventory-id', item.id)
          .gt('batch-quantity-count', 0)
          .order('expiry-date-timestamp', { ascending: true });

        if (batches) {
          for (const batch of batches) {
            if (qtyToRemove <= 0) break;
            const currentQty = batch['batch-quantity-count'];
            const deduction = Math.min(currentQty, qtyToRemove);

            await supabase
              .from('inventory-batch-tracking-record')
              .update({ 'batch-quantity-count': currentQty - deduction })
              .eq('batch-id', batch['batch-id']);

            qtyToRemove -= deduction;
          }
        }

        // Also update parent total
        const { data: parent } = await supabase.from('retail-store-inventory-item').select('current-stock-quantity').eq('inventory-id', item.id).single();
        if (parent) {
          await supabase.from('retail-store-inventory-item')
            .update({ 'current-stock-quantity': (parent['current-stock-quantity'] || 0) - Math.abs(variance) })
            .eq('inventory-id', item.id);
        }

      } else {
        // FOUND STOCK: Add a new batch
        await supabase.from('inventory-batch-tracking-record').insert({
          'inventory-id': item.id,
          'batch-quantity-count': variance,
          // 'expiry-date-timestamp': new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Optional
          'purchase-price-amount': 0 // Found items have 0 cost basis usually? Or use avg cost.
        });

        // Also update parent total
        const { data: parent } = await supabase.from('retail-store-inventory-item').select('current-stock-quantity').eq('inventory-id', item.id).single();
        if (parent) {
          await supabase.from('retail-store-inventory-item')
            .update({ 'current-stock-quantity': (parent['current-stock-quantity'] || 0) + variance })
            .eq('inventory-id', item.id);
        }
      }
    }



    return NextResponse.json({ success: true, varianceFound: discrepancies.length });

  } catch (error: any) {
    console.error("Audit Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}