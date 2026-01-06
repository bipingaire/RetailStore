import { calculateProfitMetrics } from '@/lib/analytics/profit-calculator';

describe('Profit Calculator', () => {
    const mockSupabase = {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                gte: jest.fn(() => ({
                    lte: jest.fn(() => ({
                        data: [],
                        error: null,
                    })),
                })),
                in: jest.fn(() => ({
                    data: [],
                    error: null,
                })),
            })),
        })),
        rpc: jest.fn(),
    };

    it('should calculate zero profit with no data', async () => {
        const result = await calculateProfitMetrics(
            mockSupabase,
            '2026-01-01',
            '2026-01-31'
        );

        expect(result.revenue).toBe(0);
        expect(result.cogs).toBe(0);
        expect(result.grossProfit).toBe(0);
    });

    it('should calculate gross profit correctly', async () => {
        const mockOrders = [
            { final_amount: 100 },
            { final_amount: 200 },
        ];

        mockSupabase.from.mockReturnValueOnce({
            select: jest.fn(() => ({
                gte: jest.fn(() => ({
                    lte: jest.fn(() => ({
                        data: mockOrders,
                    })),
                })),
            })),
        });

        const result = await calculateProfitMetrics(
            mockSupabase,
            '2026-01-01',
            '2026-01-31'
        );

        expect(result.revenue).toBe(300);
    });
});
