import { NextRequest, NextResponse } from 'next/server';

interface Store {
    id: string;
    subdomain: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50'); // Default 50 miles

    if (!lat || !lng) {
        return NextResponse.json(
            { error: 'Latitude and longitude are required' },
            { status: 400 }
        );
    }

    try {
        // TODO: Replace with actual database query
        // For now, using mock data - in production, fetch from database
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Call backend API to get stores
        const response = await fetch(`${API_URL}/api/tenants/all`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stores');
        }

        const stores: Store[] = await response.json();

        // Calculate distance for each store
        const storesWithDistance = stores
            .filter(store => store.latitude && store.longitude)
            .map(store => ({
                ...store,
                distance: calculateDistance(lat, lng, store.latitude, store.longitude)
            }))
            .filter(store => store.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        return NextResponse.json({
            stores: storesWithDistance,
            userLocation: { lat, lng },
            radius
        });
    } catch (error) {
        console.error('Error fetching nearby stores:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stores' },
            { status: 500 }
        );
    }
}
