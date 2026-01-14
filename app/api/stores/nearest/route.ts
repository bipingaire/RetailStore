import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * GET /api/stores/nearest
 * Find the nearest store to given coordinates
 * Query params: lat, lng
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json(
            { error: 'Missing latitude or longitude parameters' },
            { status: 400 }
        );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
            { error: 'Invalid latitude or longitude values' },
            { status: 400 }
        );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
        return NextResponse.json(
            { error: 'Latitude must be between -90 and 90' },
            { status: 400 }
        );
    }

    if (longitude < -180 || longitude > 180) {
        return NextResponse.json(
            { error: 'Longitude must be between -180 and 180' },
            { status: 400 }
        );
    }

    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Fetch all active store locations
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
        country
      `)
            .eq('is-active', true);

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

        // Calculate distance to each store using Haversine formula
        const storesWithDistance = stores.map((store: any) => {
            const storeLat = parseFloat(String(store.latitude));
            const storeLng = parseFloat(String(store.longitude));
            const distance = calculateHaversineDistance(
                latitude,
                longitude,
                storeLat,
                storeLng
            );

            return {
                locationId: store['location-id'],
                tenantId: store['tenant-id'],
                subdomain: store.subdomain,
                latitude: storeLat,
                longitude: storeLng,
                address: store['address-text'],
                city: store.city,
                state: store['state-province'],
                country: store.country,
                distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
                distanceMiles: Math.round(distance * 0.621371 * 100) / 100, // Convert km to miles
            };
        });

        // Sort by distance and get the nearest
        storesWithDistance.sort((a, b) => a.distance - b.distance);
        const nearest = storesWithDistance[0];

        return NextResponse.json({
            success: true,
            nearest,
            alternatives: storesWithDistance.slice(1, 4), // Return 3 alternative stores
        });
    } catch (error) {
        console.error('Error finding nearest store:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
