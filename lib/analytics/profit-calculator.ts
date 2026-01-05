// Profit calculation utilities
export interface ProfitMetrics {
    revenue: number;
    cogs: number;
    grossProfit: number;
    grossMargin: number;
    expenses: number;
    netProfit: number;
    netMargin: number;
}

export interface ProductProfit {
    productName: string;
    unitsSold: number;
    revenue: number;
    cogs: number;
    grossProfit: number;
    margin: number;
}

export async function calculateProfitMetrics(
    supabase: any,
    startDate: string,
    endDate: string
): Promise<ProfitMetrics> {

    // Get total revenue from orders
    const { data: orders } = await supabase
        .from('orders')
        .select('final_amount')
        .gte('order_date_time', startDate)
        .lte('order_date_time', endDate);

    const revenue = orders?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;

    // Calculate COGS from order line items
    const { data: lineItems } = await supabase
        .from('order_line_item_detail')
        .select(`
      quantity_ordered,
      order_id,
      inventory_id,
      store_inventory (
        cost_price_amount
      )
    `)
        .in('order_id', orders?.map(o => o.order_id) || []);

    const cogs = lineItems?.reduce((sum, item: any) => {
        const cost = item.store_inventory?.cost_price_amount || 0;
        return sum + (cost * item.quantity_ordered);
    }, 0) || 0;

    // Get manual expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate);

    const totalExpenses = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;

    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netProfit = grossProfit - totalExpenses;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
        revenue,
        cogs,
        grossProfit,
        grossMargin,
        expenses: totalExpenses,
        netProfit,
        netMargin
    };
}

export async function getProductProfitability(
    supabase: any,
    startDate: string,
    endDate: string,
    limit = 20
): Promise<ProductProfit[]> {

    const { data } = await supabase.rpc('get_product_profitability', {
        p_start_date: startDate,
        p_end_date: endDate,
        p_limit: limit
    });

    return data || [];
}
