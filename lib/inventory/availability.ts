/**
 * Inventory availability service
 * Check product availability across all stores in the multi-tenant system
 */

import { createClient } from '@supabase/supabase-js';
import { calculateDistance } from '../geolocation/distance';

// Initialize lazily inside functions
// const supabase = ...

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
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('retail-store-inventory-item')
        .select('current-stock-quantity')
        .eq('global-product-id', productId)
        .eq('tenant-id', tenantId)
        .eq('is-active', true)
        .single();

    if (error || !data) return 0;
    return data['current-stock-quantity'] || 0;
}

/**
 * Find all stores that have a product in stock
 */
export async function findStoresWithProduct(
    productId: string
): Promise<StoreWithStock[]> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: inventoryItems, error } = await supabase
        .from('retail-store-inventory-item')
        .select(`
      current-stock-quantity,
      tenant-id,
      retail-store-tenant (
        tenant-id,
        store-name,
        subdomain,
        latitude,
        longitude,
        store-address,
        store-city,
        store-state,
        store-zip-code,
        phone-number,
        email-address,
        store-hours,
        features,
        is-active
      )
    `)
        .eq('global-product-id', productId)
        .eq('is-active', true)
        .gt('current-stock-quantity', 0);

    if (error || !inventoryItems) {
        console.error('Error fetching stores with product:', error);
        return [];
    }

    return inventoryItems
        .filter(item => item['retail-store-tenant'])
        .map(item => {
            const store = item['retail-store-tenant'];
            return {
                tenantId: store['tenant-id'],
                storeName: store['store-name'],
                subdomain: store['subdomain'],
                stockQuantity: item['current-stock-quantity'],
                latitude: store['latitude'],
                longitude: store['longitude'],
                address: store['store-address'] || '',
                city: store['store-city'] || '',
                state: store['store-state'] || '',
                zipCode: store['store-zip-code'] || '',
                phone: store['phone-number'] || '',
                email: store['email-address'] || '',
                storeHours: store['store-hours'] || {},
                features: store['features'] || []
            };
        })
        .filter(store => store.latitude && store.longitude);
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
    const allStores = await findStoresWithProduct(productId);

    // Calculate distances and filter by radius
    const storesWithDistance = allStores
        .map(store => ({
            ...store,
            distance: calculateDistance(
                { latitude: userLatitude, longitude: userLongitude },
                { latitude: store.latitude, longitude: store.longitude }
            )
        }))
        .filter(store => store.distance <= radiusMiles)
        .sort((a, b) => a.distance - b.distance);

    return storesWithDistance;
}
