/**
 * Distance calculation utilities
 * Haversine formula for calculating distances between geographic coordinates
 */

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface LocationWithDistance {
    latitude: number;
    longitude: number;
    distance: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate
 * @param point2 Second coordinate
 * @returns Distance in miles
 */
export function calculateDistance(
    point1: Coordinates,
    point2: Coordinates
): number {
    const R = 3959; // Earth's radius in miles

    const lat1 = toRadians(point1.latitude);
    const lat2 = toRadians(point2.latitude);
    const deltaLat = toRadians(point2.latitude - point1.latitude);
    const deltaLon = toRadians(point2.longitude - point1.longitude);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Sort locations by distance from a reference point
 */
export function sortByDistance<T extends Coordinates>(
    locations: T[],
    referencePoint: Coordinates
): (T & { distance: number })[] {
    return locations
        .map(location => ({
            ...location,
            distance: calculateDistance(referencePoint, location)
        }))
        .sort((a, b) => a.distance - b.distance);
}

/**
 * Filter locations within a specific radius
 */
export function filterByRadius<T extends Coordinates>(
    locations: T[],
    referencePoint: Coordinates,
    radiusMiles: number
): T[] {
    return locations.filter(location => {
        const distance = calculateDistance(referencePoint, location);
        return distance <= radiusMiles;
    });
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
    if (miles < 0.1) {
        return 'Less than 0.1 mi';
    }
    return `${miles.toFixed(1)} mi`;
}
