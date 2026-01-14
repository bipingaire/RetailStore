import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET /api/stores/list
 * Get all active store locations
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        const { data: stores, error } = await supabase
            .from('store-location-mapping')
            .select(`
        location-id,
        tenant-id,
        subdomain,
        latitude,
        longitude,
        address-text,
        city,
        state-province,
        country,
        postal-code
      `)
            .eq('is-active', true)
            .order('city', { ascending: true });

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch store locations' },
                { status: 500 }
            );
        }

        if (!stores || stores.length === 0) {
            return NextResponse.json(
                { error: 'No active stores available' },
                { status: 404 }
            );
        }

        // Transform to friendlier format
        const storeList = stores.map((store: any) => ({
            locationId: store['location-id'],
            tenantId: store['tenant-id'],
            subdomain: store.subdomain,
            latitude: parseFloat(String(store.latitude)),
            longitude: parseFloat(String(store.longitude)),
            address: store['address-text'],
            city: store.city,
            state: store['state-province'],
            country: store.country,
            postalCode: store['postal-code'],
            displayName: `${store.city}, ${store['state-province']}`,
            fullAddress: [
                store['address-text'],
                store.city,
                store['state-province'],
                store['postal-code'],
            ]
                .filter(Boolean)
                .join(', '),
        }));

        return NextResponse.json({
            success: true,
            stores: storeList,
            count: storeList.length,
        });
    } catch (error) {
        console.error('Error fetching store list:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
