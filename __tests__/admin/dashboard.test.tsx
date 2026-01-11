
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Fix for toBeInTheDocument
import AdminDashboard from '@/app/admin/page';

// Mock Supabase
const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockEq = jest.fn();
const mockLt = jest.fn();
const mockLimit = jest.fn();
const mockSingle = jest.fn();
const mockMaybeSingle = jest.fn();
const mockOrder = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
    createClientComponentClient: () => ({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'user-123' } },
                error: null,
            }),
        },
        from: mockFrom,
    }),
}));

describe('AdminDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default Chain Setup
        mockFrom.mockReturnValue({
            select: mockSelect,
        });

        // Default Select chain returning "this" to allow chaining modifiers
        mockSelect.mockReturnValue({
            eq: mockEq,
            order: mockOrder,
            limit: mockLimit,
            single: mockSingle,
            maybeSingle: mockMaybeSingle,
            lt: mockLt,
        });

        // Default Modifiers
        mockEq.mockReturnValue({
            single: mockSingle,
            limit: mockLimit,
            maybeSingle: mockMaybeSingle,
            lt: mockLt,
            select: mockSelect
        });
        mockLt.mockReturnValue({
            // Resolves count queries
        });
        mockOrder.mockReturnValue({
            limit: mockLimit
        });
        mockLimit.mockReturnValue({
            // Resolves list queries
        });
    });

    it('renders dashboard with store name and stats', async () => {
        // 1. Setup Data Response Mocks

        // Tenant Role
        mockEq.mockImplementationOnce(() => ({
            limit: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({ data: { 'tenant-id': 'tenant-123' } })
            })
        }));

        // Store Name
        mockSingle.mockResolvedValueOnce({ data: { 'store-name': 'Test Store' } });

        // 1. Low stock count
        mockLt.mockResolvedValueOnce({ count: 5 });

        // 2. Pending Orders & 3. Active Campaigns (Mocking sequence based on component calls)
        // The component logic calls:
        // 1. role -> tenant
        // 2. store -> name
        // 3. inventory -> low stock
        // 4. orders -> pending
        // 5. campaigns -> active
        // 6. orders -> list

        mockFrom.mockImplementation((table) => {
            const queryBuilder: any = {
                select: jest.fn(),
            };

            if (table === 'tenant-user-role') {
                queryBuilder.select.mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            maybeSingle: jest.fn().mockResolvedValue({ data: { 'tenant-id': 'tenant-123' } })
                        })
                    })
                });
            } else if (table === 'retail-store-tenant') {
                queryBuilder.select.mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({ data: { 'store-name': 'Test Store' } })
                    })
                });
            } else if (table === 'retail-store-inventory-item') {
                queryBuilder.select.mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        lt: jest.fn().mockResolvedValue({ count: 5 })
                    })
                });
            } else if (table === 'customer-order-header') {
                // This table is used twice: once for count, once for list
                queryBuilder.select.mockImplementation((fields: any, options: any) => {
                    if (options?.count) {
                        return {
                            eq: jest.fn().mockResolvedValue({ count: 12 })
                        };
                    } else {
                        return {
                            order: jest.fn().mockReturnValue({
                                limit: jest.fn().mockResolvedValue({
                                    data: [
                                        {
                                            'order-id': 'order-1',
                                            'customer-phone': '555-0100',
                                            'order-date-time': new Date().toISOString(),
                                            'status': 'completed',
                                            'final-amount': 100.00
                                        }
                                    ]
                                })
                            })
                        };
                    }
                });
            } else if (table === 'marketing-campaign-master') {
                queryBuilder.select.mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ count: 3 })
                });
            }

            return queryBuilder;
        });

        render(<AdminDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Test Store Dashboard')).toBeInTheDocument();
        });

        expect(screen.getByText('12')).toBeInTheDocument(); // Pending orders
        expect(screen.getByText('5')).toBeInTheDocument(); // Low stock
        expect(screen.getByText('3')).toBeInTheDocument(); // Active campaigns
        expect(screen.getByText('Test Store Dashboard')).toBeInTheDocument();
        expect(screen.getByText('#order-1...')).toBeInTheDocument();
    });
});
