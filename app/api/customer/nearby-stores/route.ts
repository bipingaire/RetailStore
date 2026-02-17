import { NextRequest, NextResponse } from 'next/server';
import { findNearbyStoresWithStock } from '@/lib/inventory/availability';

/**
 * POST /api/customer/nearby-stores
 * Find nearby stores with a product in stock
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            productId,
            userLatitude,
            userLongitude,
            radiusMiles = 25
        } = body;

        // Validation
        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        if (!userLatitude || !userLongitude) {
            return NextResponse.json(
                { error: 'User location is required' },
                { status: 400 }
            );
        }

        // Find nearby stores
        const stores = await findNearbyStoresWithStock(
            productId,
            parseFloat(userLatitude),
            parseFloat(userLongitude),
            parseFloat(radiusMiles)
        );

        return NextResponse.json({
            success: true,
            stores,
            totalFound: stores.length,
            searchRadius: radiusMiles,
            userLocation: {
                latitude: userLatitude,
                longitude: userLongitude
            }
        });

    } catch (error: any) {
        console.error('Error finding nearby stores:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to find nearby stores' },
            { status: 500 }
        );
    }
}
