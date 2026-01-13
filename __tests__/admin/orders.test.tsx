
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderManager from '@/app/admin/orders/page';

// Mock Supabase
const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockMaybeSingle = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
    createClientComponentClient: () => ({
        auth: {
            getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } })
        },
        from: mockFrom,
    }),
}));

describe('OrderManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockFrom.mockReturnValue({
            select: mockSelect,
        });

        // Default chain for orders
        mockSelect.mockReturnValue({
            eq: mockEq,
            maybeSingle: mockMaybeSingle, // for tenant check
        });

        mockEq.mockReturnValue({
            order: mockOrder,
            maybeSingle: mockMaybeSingle
        });
    });

    it('renders orders table with data', async () => {
        // 1. Mock Tenant Resolution
        mockFrom.mockImplementation((table) => {
            const qb: any = { select: jest.fn() };
            if (table === 'tenant-user-role') {
                qb.select.mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        maybeSingle: jest.fn().mockResolvedValue({ 'tenant-id': 'tenant-1' })
                    })
                });
            }
            if (table === 'customer-order-header') {
                qb.select.mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        order: jest.fn().mockResolvedValue({
                            data: [
                                {
                                    'order-id': 'order-1',
                                    'customer-phone': '555-0100',
                                    'order-status-code': 'pending',
                                    'final-amount': 50.00,
                                    'fulfillment-type': 'delivery',
                                    'customer': { 'full-name': 'John Doe', 'email': 'john@example.com' },
                                    'invoice': { 'invoice-number': 'INV-001', 'payment-status': 'paid' },
                                    'items': [{ 'quantity-ordered': 2, 'product-name': 'Test Item' }]
                                }
                            ],
                            error: null
                        })
                    })
                });
            }
            return qb;
        });

        render(<OrderManager />);

        // Check data presence
        await waitFor(() => {
            expect(screen.getByText('555-0100')).toBeInTheDocument();
        });

        expect(screen.getByText('pending')).toBeInTheDocument();
        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
});
