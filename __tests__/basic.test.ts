// Simple passing test to verify Jest is working
describe('Basic Test Suite', () => {
    it('should pass a simple test', () => {
        expect(1 + 1).toBe(2);
    });

    it('should handle string operations', () => {
        expect('hello' + ' world').toBe('hello world');
    });

    it('should handle boolean logic', () => {
        expect(true).toBe(true);
        expect(false).toBe(false);
    });

    it('should handle arrays', () => {
        const arr = [1, 2, 3];
        expect(arr).toHaveLength(3);
        expect(arr).toContain(2);
    });

    it('should handle objects', () => {
        const obj = { name: 'Test', value: 123 };
        expect(obj.name).toBe('Test');
        expect(obj).toHaveProperty('value');
    });
});
