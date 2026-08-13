describe('Sales Analytics Data Processing', () => {
  const sampleSales = [
    { id: '1', total: 100, subtotal: 90, tax: 10, discount: 0, paymentMethod: 'CASH', status: 'COMPLETED', createdAt: new Date('2026-08-10T10:15:00Z'), customerId: 'cust-1' },
    { id: '2', total: 50, subtotal: 45, tax: 5, discount: 0, paymentMethod: 'CARD', status: 'COMPLETED', createdAt: new Date('2026-08-10T14:30:00Z'), customerId: 'cust-2' },
    { id: '3', total: 200, subtotal: 180, tax: 20, discount: 10, paymentMethod: 'CASH', status: 'COMPLETED', createdAt: new Date('2026-08-11T10:45:00Z'), customerId: 'cust-1' },
  ];

  const sampleSaleItems = [
    { productId: 'p1', quantity: 2, subtotal: 40, product: { name: 'Item A', category: 'Dairy' } },
    { productId: 'p2', quantity: 8, subtotal: 50, product: { name: 'Item B', category: 'Bakery' } },
    { productId: 'p1', quantity: 3, subtotal: 60, product: { name: 'Item A', category: 'Dairy' } },
  ];

  test('calculates summary KPIs correctly', () => {
    const totalRevenue = sampleSales.reduce((s, sale) => s + sale.total, 0); // 350
    const totalOrders = sampleSales.length; // 3
    const avgOrderValue = totalRevenue / totalOrders; // 116.666
    const uniqueCustomers = new Set(sampleSales.map(s => s.customerId)).size; // 2

    expect(totalRevenue).toBe(350);
    expect(totalOrders).toBe(3);
    expect(avgOrderValue).toBeCloseTo(116.67, 2);
    expect(uniqueCustomers).toBe(2);
  });

  test('aggregates top products by quantity sold correctly', () => {
    const productMap = new Map<string, { name: string; unitsSold: number; revenue: number }>();
    for (const item of sampleSaleItems) {
      const existing = productMap.get(item.productId) || { name: item.product.name, unitsSold: 0, revenue: 0 };
      existing.unitsSold += item.quantity;
      existing.revenue += item.subtotal;
      productMap.set(item.productId, existing);
    }

    const sortedByUnits = Array.from(productMap.values()).sort((a, b) => b.unitsSold - a.unitsSold);

    expect(sortedByUnits[0].name).toBe('Item B');
    expect(sortedByUnits[0].unitsSold).toBe(8);
    expect(sortedByUnits[1].name).toBe('Item A');
    expect(sortedByUnits[1].unitsSold).toBe(5);
  });


  test('aggregates top products by revenue correctly', () => {
    const productMap = new Map<string, { name: string; unitsSold: number; revenue: number }>();
    for (const item of sampleSaleItems) {
      const existing = productMap.get(item.productId) || { name: item.product.name, unitsSold: 0, revenue: 0 };
      existing.unitsSold += item.quantity;
      existing.revenue += item.subtotal;
      productMap.set(item.productId, existing);
    }

    const sortedByRevenue = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue);

    expect(sortedByRevenue[0].name).toBe('Item A');
    expect(sortedByRevenue[0].revenue).toBe(100);
    expect(sortedByRevenue[1].name).toBe('Item B');
    expect(sortedByRevenue[1].revenue).toBe(50);
  });

  test('calculates hourly sales heatmap correctly', () => {
    const hourly: number[] = new Array(24).fill(0);
    for (const sale of sampleSales) {
      const h = sale.createdAt.getUTCHours();
      hourly[h] += sale.total;
    }

    expect(hourly[10]).toBe(300); // 100 + 200 at 10:00 UTC
    expect(hourly[14]).toBe(50);  // 50 at 14:00 UTC
    expect(hourly[0]).toBe(0);
  });

  test('groups payment methods correctly', () => {
    const paymentMap = new Map<string, { method: string; count: number; revenue: number }>();
    for (const sale of sampleSales) {
      const existing = paymentMap.get(sale.paymentMethod) || { method: sale.paymentMethod, count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += sale.total;
      paymentMap.set(sale.paymentMethod, existing);
    }

    const cash = paymentMap.get('CASH');
    const card = paymentMap.get('CARD');

    expect(cash?.count).toBe(2);
    expect(cash?.revenue).toBe(300);
    expect(card?.count).toBe(1);
    expect(card?.revenue).toBe(50);
  });
});
