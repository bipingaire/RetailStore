// Simple arithmetic and logic tests
describe('Math Operations', () => {
    test('addition works correctly', () => {
        expect(1 + 1).toBe(2);
        expect(5 + 3).toBe(8);
    });

    test('subtraction works correctly', () => {
        expect(10 - 5).toBe(5);
        expect(0 - 1).toBe(-1);
    });

    test('multiplication works correctly', () => {
        expect(2 * 3).toBe(6);
        expect(5 * 0).toBe(0);
    });

    test('division works correctly', () => {
        expect(10 / 2).toBe(5);
        expect(9 / 3).toBe(3);
    });
});

describe('String Operations', () => {
    test('concatenation works', () => {
        expect('Hello' + ' ' + 'World').toBe('Hello World');
    });

    test('uppercase works', () => {
        expect('hello'.toUpperCase()).toBe('HELLO');
    });

    test('lowercase works', () => {
        expect('WORLD'.toLowerCase()).toBe('world');
    });

    test('includes works', () => {
        expect('Hello World'.includes('World')).toBe(true);
        expect('Hello World'.includes('xyz')).toBe(false);
    });
});

describe('Array Operations', () => {
    test('array length', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(arr.length).toBe(5);
    });

    test('array push', () => {
        const arr = [1, 2];
        arr.push(3);
        expect(arr).toEqual([1, 2, 3]);
    });

    test('array filter', () => {
        const arr = [1, 2, 3, 4, 5];
        const evens = arr.filter(n => n % 2 === 0);
        expect(evens).toEqual([2, 4]);
    });

    test('array map', () => {
        const arr = [1, 2, 3];
        const doubled = arr.map(n => n * 2);
        expect(doubled).toEqual([2, 4, 6]);
    });
});

describe('Object Operations', () => {
    test('object properties', () => {
        const obj = { name: 'Test', value: 123 };
        expect(obj.name).toBe('Test');
        expect(obj.value).toBe(123);
    });

    test('object keys', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(Object.keys(obj)).toEqual(['a', 'b', 'c']);
    });
});

// Retail Store Business Logic Tests
describe('Retail Store Logic', () => {
    test('calculate cart subtotal', () => {
        const items = [
            { price: 10.00, quantity: 2 },
            { price: 5.50, quantity: 3 },
        ];
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        expect(subtotal).toBe(36.50);
    });

    test('calculate tax', () => {
        const subtotal = 100;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        expect(tax).toBe(8);
    });

    test('calculate order total', () => {
        const subtotal = 100;
        const tax = 8;
        const deliveryFee = 5.99;
        const total = subtotal + tax + deliveryFee;
        expect(total).toBeCloseTo(113.99, 2);
    });

    test('check if item is in stock', () => {
        const quantity = 10;
        const isInStock = quantity > 0;
        expect(isInStock).toBe(true);
    });

    test('check if  item is out of stock', () => {
        const quantity = 0;
        const isInStock = quantity > 0;
        expect(isInStock).toBe(false);
    });

    test('validate email format', () => {
        const validEmail = 'test@example.com';
        const invalidEmail = 'not-an-email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        expect(emailRegex.test(validEmail)).toBe(true);
        expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    test('format price', () => {
        const price = 19.99;
        const formatted = `$${price.toFixed(2)}`;
        expect(formatted).toBe('$19.99');
    });
});

describe('Cart Management', () => {
    test('add item to cart', () => {
        const cart: { [key: string]: number } = {};
        const productId = 'abc123';

        cart[productId] = 1;

        expect(cart[productId]).toBe(1);
    });

    test('increment quantity', () => {
        const cart: { [key: string]: number } = { 'abc123': 2 };
        const productId = 'abc123';

        cart[productId] = cart[productId] + 1;

        expect(cart[productId]).toBe(3);
    });

    test('remove item from cart', () => {
        const cart: { [key: string]: number } = { 'abc123': 2, 'xyz789': 1 };

        delete cart['abc123'];

        expect(cart['abc123']).toBeUndefined();
        expect(cart['xyz789']).toBe(1);
    });
});
