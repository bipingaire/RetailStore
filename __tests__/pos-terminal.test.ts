describe('POS Terminal Calculations & Logic', () => {
  describe('Cart Total & Tax & Discount Calculations', () => {
    const sampleItems = [
      { productId: 'p1', name: 'Item 1', price: 10.00, quantity: 2, subtotal: 20.00 },
      { productId: 'p2', name: 'Item 2', price: 15.00, quantity: 1, subtotal: 15.00 },
    ];

    test('calculates raw subtotal correctly', () => {
      const subtotal = sampleItems.reduce((acc, item) => acc + item.subtotal, 0);
      expect(subtotal).toBe(35.00);
    });

    test('applies percentage discount correctly', () => {
      const subtotal = 35.00;
      const discountPct = 10; // 10%
      const discountAmount = (subtotal * discountPct) / 100;
      expect(discountAmount).toBe(3.50);
      expect(subtotal - discountAmount).toBe(31.50);
    });

    test('applies tax correctly after discount', () => {
      const subtotal = 35.00;
      const discountPct = 10;
      const taxPct = 8; // 8% tax
      const discountedSubtotal = subtotal - (subtotal * discountPct) / 100; // 31.50
      const taxAmount = (discountedSubtotal * taxPct) / 100; // 2.52
      const finalTotal = discountedSubtotal + taxAmount; // 34.02

      expect(discountedSubtotal).toBe(31.50);
      expect(taxAmount).toBeCloseTo(2.52, 2);
      expect(finalTotal).toBeCloseTo(34.02, 2);
    });

    test('handles 0% tax and 0% discount', () => {
      const subtotal = 50.00;
      const discountPct = 0;
      const taxPct = 0;
      const total = subtotal * (1 - discountPct / 100) * (1 + taxPct / 100);
      expect(total).toBe(50.00);
    });
  });

  describe('Cash Tendered & Change Due Calculator', () => {
    test('calculates change due when tendered amount is greater than total', () => {
      const totalAmount = 34.50;
      const tenderedAmount = 50.00;
      const changeDue = Math.max(0, tenderedAmount - totalAmount);
      expect(changeDue).toBeCloseTo(15.50, 2);
    });

    test('returns 0 change due when tendered exact amount', () => {
      const totalAmount = 20.00;
      const tenderedAmount = 20.00;
      const changeDue = Math.max(0, tenderedAmount - totalAmount);
      expect(changeDue).toBe(0.00);
    });

    test('flags insufficient cash tendered', () => {
      const totalAmount = 45.00;
      const tenderedAmount = 40.00;
      const isInsufficient = tenderedAmount < totalAmount;
      const shortage = totalAmount - tenderedAmount;

      expect(isInsufficient).toBe(true);
      expect(shortage).toBe(5.00);
    });

    test('generates smart quick cash denomination buttons', () => {
      const totalAmount = 14.25;
      const denominations = [
        totalAmount,
        Math.ceil(totalAmount / 5) * 5,  // 15
        Math.ceil(totalAmount / 10) * 10, // 20
        Math.ceil(totalAmount / 20) * 20, // 20
        50,
        100,
      ].filter((v, i, self) => v >= totalAmount && self.indexOf(v) === i);

      expect(denominations).toContain(14.25);
      expect(denominations).toContain(15);
      expect(denominations).toContain(20);
      expect(denominations).toContain(50);
      expect(denominations).toContain(100);
    });
  });

  describe('Barcode Matching Logic', () => {
    const products = [
      { id: '1', name: 'Milk 1L', barcode: '890123456789', sku: 'SKU-MILK-1' },
      { id: '2', name: 'Bread 500g', barcode: '890987654321', sku: 'SKU-BREAD-1' },
    ];

    test('finds product by exact barcode match', () => {
      const code = '890123456789';
      const match = products.find(p => p.barcode === code || p.sku === code || p.id === code);
      expect(match).toBeDefined();
      expect(match?.name).toBe('Milk 1L');
    });

    test('finds product by SKU match', () => {
      const code = 'SKU-BREAD-1';
      const match = products.find(p => p.barcode === code || p.sku === code || p.id === code);
      expect(match).toBeDefined();
      expect(match?.name).toBe('Bread 500g');
    });

    test('returns undefined for non-existent barcode', () => {
      const code = '000000000000';
      const match = products.find(p => p.barcode === code || p.sku === code || p.id === code);
      expect(match).toBeUndefined();
    });
  });

  describe('Sales API Payload Construction', () => {
    test('formats sale payload correctly for POST /sales', () => {
      const cartItems = [
        { id: '1', productId: 'prod-100', name: 'Widget A', price: 10, quantity: 2, subtotal: 20 },
        { id: '2', productId: 'custom-12345', name: 'Custom Fee', price: 5, quantity: 1, subtotal: 5 },
      ];
      const customer = { id: 'cust-50', name: 'John Cashier' };
      const subtotal = 25;
      const discount = 2.5;
      const tax = 1.8;
      const total = 24.3;
      const paymentMethod = 'CASH';

      const payload = {
        customerId: customer?.id || null,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId.startsWith('custom-') ? undefined : item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.subtotal,
        })),
      };

      expect(payload.customerId).toBe('cust-50');
      expect(payload.items).toHaveLength(2);
      expect(payload.items[0].productId).toBe('prod-100');
      expect(payload.items[1].productId).toBeUndefined(); // Custom items skip productId
      expect(payload.total).toBe(24.3);
    });
  });
});
