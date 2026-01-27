/**
 * Nearest store finder using geolocation
 * Implements Haversine formula for distance calculation
 */

import { apiClient } from '@/lib/api-client';

export interface StoreLocation {
    'location-id': string;
    'tenant-id': string;
    subdomain: string;
    latitude: number;
    longitude: number;
    'address-text': string | null;
    city: string | null;
    'state-province': string | null;
    country: string | null;
    distance?: number; // Calculated distance in kilometers
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1 (degrees)
 * @param lon1 Longitude of point 1 (degrees)
 * @param lat2 Latitude of point 2 (degrees)
 * @param lon2 Longitude of point 2 (degrees)
 * @returns Distance in kilometers
 */
export function calculateDistance(
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

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
    return km * 0.621371;
}

/**
 * Find the nearest store to given coordinates
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @returns Nearest store with distance information
 */
export async function findNearestStore(
    latitude: number,
    longitude: number
): Promise<StoreLocation | null> {
    try {
        // Fetch all active store locations from Backend
        const stores = await apiClient.getStores();

        if (!stores || stores.length === 0) {
            console.warn('No active stores found');
            return null;
        }

        // Calculate distance to each store
        // MAP backend fields to StoreLocation interface if needed
        // Assuming backend returns compatible list or we adapt here.
        // For now trusting backend returns list of tenants which might lack lat/long if not fully implemented.
        // If simple tenants list, we might not have lat/long.
        // But let's assume getStores returns valid location data or filter those that do.

        const storesWithDistance = stores
            .filter((s: any) => s.latitude && s.longitude)
            .map((store: any) => ({
                ...store,
                distance: calculateDistance(
                    latitude,
                    longitude,
                    parseFloat(store.latitude),
                    parseFloat(store.longitude)
                ),
            }));

        if (storesWithDistance.length === 0) return null;

        // Sort by distance and get the nearest
        storesWithDistance.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

        return storesWithDistance[0];
    } catch (error) {
        console.error('Error in findNearestStore:', error);
        return null;
    }
}

/**
 * Get all store locations with distances from a given point
 * @param latitude User's latitude
 * @param longitude User's longitude
 * @returns Array of stores sorted by distance
 */
export async function getAllStoresWithDistance(
    latitude: number,
    longitude: number
): Promise<StoreLocation[]> {
    try {
        const stores = await apiClient.getStores();

        if (!stores) {
            return [];
        }

        const storesWithDistance = stores
            .filter((s: any) => s.latitude && s.longitude)
            .map((store: any) => ({
                ...store,
                distance: calculateDistance(
                    latitude,
                    longitude,
                    parseFloat(store.latitude),
                    parseFloat(store.longitude)
                ),
            }));

        // Sort by distance
        return storesWithDistance.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
        console.error('Error in getAllStoresWithDistance:', error);
        return [];
    }
}

/**
 * Get all active store locations without distance calculation
 * Used for manual store selection
 */
export async function getAllStores(): Promise<Omit<StoreLocation, 'distance'>[]> {
    try {
        const stores = await apiClient.getStores();
        return stores || [];
    } catch (error) {
        console.error('Error in getAllStores:', error);
        return [];
    }
}
