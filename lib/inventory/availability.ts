/**
 * Inventory availability service
 * Check product availability across all stores in the multi-tenant system
 * Refactored to remove Supabase dependency (Mock Implementation)
 */

import { calculateDistance } from '../geolocation/distance';

export interface StoreWithStock {
    tenantId: string;
    storeName: string;
    subdomain: string;
    stockQuantity: number;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    storeHours: any;
    features: string[];
    distance?: number;
}

/**
 * Check if product is available at a specific store
 */
export async function checkProductAvailability(
    productId: string,
    tenantId: string
): Promise<number> {
    // Mock implementation
    console.warn('checkProductAvailability: Supabase removed, returning mock 0');
    return 0;
}

/**
 * Find all stores that have a product in stock
 */
export async function findStoresWithProduct(
    productId: string
): Promise<StoreWithStock[]> {
    // Mock implementation
    console.warn('findStoresWithProduct: Supabase removed, returning empty list');
    return [];
}

/**
 * Find nearby stores with product in stock
 */
export async function findNearbyStoresWithStock(
    productId: string,
    userLatitude: number,
    userLongitude: number,
    radiusMiles: number = 25
): Promise<StoreWithStock[]> {
    // Mock implementation
    console.warn('findNearbyStoresWithStock: Supabase removed, returning empty list');
    return [];
}
