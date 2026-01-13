
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryDashboard from '@/app/admin/inventory/page';

// Mock Supabase Client
const mockSelect = jest.fn();
const mockFrom = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

// Mock child components
jest.mock('@/app/admin/inventory/promotion-modal', () => {
    return function DummyPromotionModal({ onClose }: { onClose: () => void }) {
        return (
            <div data-testid="promotion-modal">
                Promotion Modal
                <button onClick={onClose}>Close</button>
            </div>
        );
    };
});

describe('InventoryDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockFrom.mockReturnValue({
            select: mockSelect,
        });
    });

    it('renders inventory table with products', async () => {
        // Mock Data Response
        const mockData = [
            {
                'inventory-id': 'inv-1',
                'selling-price-amount': 20,
                'current-stock-quantity': 10,
                'global-product-master-catalog': {
                    'product-name': 'Test Product A',
                    'upc-ean-code': 'SKU-A',
                    'image-url': null
                },
                'inventory-batch-tracking-record': [
                    {
                        'batch-id': 'batch-1',
                        'batch-quantity-count': 10,
                        'expiry-date-timestamp': new Date(Date.now() + 86400000 * 10).toISOString() // 10 days from now
                    }
                ]
            }
        ];

        mockSelect.mockResolvedValue({ data: mockData, error: null });

        render(<InventoryDashboard />);

        // Check loading state
        expect(screen.getByText(/loading inventory data/i)).toBeInTheDocument();

        // Check data loaded
        await waitFor(() => {
            expect(screen.getByText('Test Product A')).toBeInTheDocument();
        });

        expect(screen.getByText('SKU-A')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();

        // Check Status text is present
        expect(screen.getByText(/10 Days/i)).toBeInTheDocument();
    });

    it('handles empty inventory', async () => {
        mockSelect.mockResolvedValue({ data: [], error: null });

        render(<InventoryDashboard />);

        await waitFor(() => {
            expect(screen.getByText(/no inventory found/i)).toBeInTheDocument();
        });
    });
});
