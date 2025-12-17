import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
          .from('inventory_batches')
          .select('*')
          .eq('store_inventory_id', item.id)
          .gt('batch_quantity', 0)
          .order('expiry_date', { ascending: true });

        if (batches) {
          for (const batch of batches) {
            if (qtyToRemove <= 0) break;
            const deduction = Math.min(batch.batch_quantity, qtyToRemove);
            
            await supabase
              .from('inventory_batches')
              .update({ batch_quantity: batch.batch_quantity - deduction })
              .eq('id', batch.id);
              
            qtyToRemove -= deduction;
          }
        }
      } else {
        // FOUND STOCK: Add a new batch
        await supabase.from('inventory_batches').insert({
          store_inventory_id: item.id,
          batch_quantity: variance,
          expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default 1y expiry for found items
          arrival_date: new Date(),
          status: 'audit_adjustment'
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