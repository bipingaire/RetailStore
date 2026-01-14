import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/geocoding/geocode-address';

/**
 * POST /api/geocode
 * Convert an address to coordinates
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { street, city, state, postalCode, country } = body;

        // Validate required fields
        if (!street || !city || !state) {
            return NextResponse.json(
                { error: 'Missing required fields: street, city, state' },
                { status: 400 }
            );
        }

        // Call geocoding service
        const result = await geocodeAddress(
            street,
            city,
            state,
            postalCode,
            country || 'USA'
        );

        if (!result) {
            return NextResponse.json(
                {
                    error: 'Could not geocode address',
                    message: 'Please verify the address is correct and try again'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                latitude: result.latitude,
                longitude: result.longitude,
                formattedAddress: result.formattedAddress,
                city: result.city,
                state: result.state,
                country: result.country,
                postalCode: result.postalCode,
            },
        });
    } catch (error: any) {
        console.error('Geocoding API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
}
