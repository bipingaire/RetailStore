/**
 * Geocoding service
 * Handles address to coordinate conversion and vice-versa
 */

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY_SERVER || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface GeocodeResult {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    placeId: string;
}

/**
 * Convert an address to coordinates
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not configured');
        return null;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status !== 'OK' || !data.results?.[0]) {
            console.error('Geocoding failed:', data.status);
            return null;
        }

        const result = data.results[0];
        const { lat, lng } = result.geometry.location;

        return {
            latitude: lat,
            longitude: lng,
            formattedAddress: result.formatted_address,
            placeId: result.place_id
        };
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}

/**
 * Convert coordinates to an address (Reverse Geocoding)
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!GOOGLE_MAPS_API_KEY) return null;

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status !== 'OK' || !data.results?.[0]) {
            return null;
        }

        return data.results[0].formatted_address;
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return null;
    }
}
