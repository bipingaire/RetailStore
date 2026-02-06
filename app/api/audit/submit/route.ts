import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { tenantId, category, items } = await req.json();

    // 1. Calculate Financial Impact
    let netVarianceValue = 0;
    const discrepancies = items.filter((i: any) => i.actual !== i.expected);

    // 2. Create Audit Record
    const { data: audit, error: auditError } = await supabase
      .from('inventory_audits')
      .insert({
        tenant_id: tenantId,
        category_audited: category,
        items_checked_count: items.length,
        net_variance_value: 0, // We update this after calculating
        performed_by: 'Manager' // In real app, get from session
      })
      .select()
      .single();

    if (auditError) throw auditError;

    // 3. Process Discrepancies
    for (const item of discrepancies) {
      const variance = item.actual - item.expected;
      const dollarValue = variance * item.price; // Approximate value
      netVarianceValue += dollarValue;

      // A. Log the line item
      await supabase.from('audit_line_items').insert({
        audit_id: audit.id,
        store_inventory_id: item.id,
        expected_qty: item.expected,
        actual_qty: item.actual,
        variance: variance
      });

      // B. Adjust Inventory
      if (variance < 0) {
        // SHRINKAGE (Theft/Loss): Remove from batches (FIFO)
        let qtyToRemove = Math.abs(variance);

        const { data: batches } = await supabase
          .from('inventory-batch-tracking-record')
          .select('*')
          .eq('inventory-id', item.id)
          .gt('batch-quantity-count', 0)
          .order('expiry-date-timestamp', { ascending: true });

        if (batches) {
          for (const batch of batches) {
            if (qtyToRemove <= 0) break;
            const currentQty = (batch as any)['batch-quantity-count'];
            const deduction = Math.min(currentQty, qtyToRemove);

            await supabase
              .from('inventory-batch-tracking-record')
              .update({ 'batch-quantity-count': currentQty - deduction })
              .eq('batch-id', (batch as any)['batch-id']);

            qtyToRemove -= deduction;
          }
        }
      } else {
        // FOUND STOCK: Add a new batch
        await supabase.from('inventory-batch-tracking-record').insert({
          'inventory-id': item.id,
          'batch-quantity-count': variance,
          'expiry-date-timestamp': new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Default 1y expiry for found items
          'received-date-timestamp': new Date().toISOString(),
          'status-code': 'audit_adjustment'
        });
      }
    }

    // 4. Update Final Value
    await supabase
      .from('inventory_audits')
      .update({ net_variance_value: netVarianceValue })
      .eq('id', audit.id);

    return NextResponse.json({ success: true, varianceFound: discrepancies.length });

  } catch (error: any) {
    console.error("Audit Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}