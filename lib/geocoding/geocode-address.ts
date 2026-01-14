/**
 * Geocoding service to convert addresses to coordinates
 * Uses Nominatim (OpenStreetMap) - free, no API key required
 */

export interface GeocodingResult {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * Free service, no API key required
 * Rate limit: 1 request per second
 */
export async function geocodeAddress(
    street: string,
    city: string,
    state: string,
    postalCode?: string,
    country: string = 'USA'
): Promise<GeocodingResult | null> {
    try {
        // Build address string
        const addressParts = [street, city, state, postalCode, country].filter(Boolean);
        const addressString = addressParts.join(', ');

        // Call Nominatim API
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('q', addressString);
        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '1');
        url.searchParams.set('addressdetails', '1');

        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'RetailOS-StoreLocator/1.0', // Required by Nominatim
            },
        });

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.error('No geocoding results found for:', addressString);
            return null;
        }

        const result = data[0];

        return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            formattedAddress: result.display_name,
            city: result.address?.city || result.address?.town || result.address?.village,
            state: result.address?.state,
            country: result.address?.country,
            postalCode: result.address?.postcode,
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Alternative: Google Maps Geocoding (requires API key)
 * Uncomment and use if you have Google Maps API key
 */
/*
export async function geocodeAddressGoogle(
  address: string
): Promise<GeocodingResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('address', address);
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    const location = result.geometry.location;
    const addressComponents = result.address_components;

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: result.formatted_address,
      city: addressComponents.find((c: any) => c.types.includes('locality'))?.long_name,
      state: addressComponents.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name,
      country: addressComponents.find((c: any) => c.types.includes('country'))?.long_name,
      postalCode: addressComponents.find((c: any) => c.types.includes('postal_code'))?.long_name,
    };
  } catch (error) {
    console.error('Google geocoding error:', error);
    return null;
  }
}
*/

/**
 * Validate coordinates are within valid ranges
 */
export function validateCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
