/**
 * Geolocation utilities for store finder
 */

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

/**
 * Get user's location using browser Geolocation API
 */
export async function getBrowserLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                code: 0,
                message: 'Geolocation is not supported by your browser'
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject({
                    code: error.code,
                    message: error.message
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

/**
 * Get approximate location from IP address using free API
 */
export async function getIPLocation(): Promise<Coordinates> {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('Failed to get IP location');
        }

        const data = await response.json();
        return {
            latitude: data.latitude,
            longitude: data.longitude
        };
    } catch (error) {
        console.error('IP location error:', error);
        // Return default fallback location (e.g., center of US)
        return {
            latitude: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '39.8283'),
            longitude: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '-98.5795')
        };
    }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates
): number {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.latitude)) *
        Math.cos(toRad(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Get user's location with fallback strategy
 * 1. Try browser geolocation
 * 2. Fall back to IP-based location
 */
export async function getUserLocation(): Promise<Coordinates> {
    try {
        return await getBrowserLocation();
    } catch (error) {
        console.warn('Browser geolocation failed, falling back to IP location');
        return await getIPLocation();
    }
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
    if (miles < 0.1) {
        return 'Less than 0.1 mi';
    }
    if (miles < 1) {
        return `${miles.toFixed(1)} mi`;
    }
    return `${Math.round(miles)} mi`;
}
