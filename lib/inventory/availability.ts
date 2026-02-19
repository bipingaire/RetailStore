/**
 * Inventory availability - deprecated  
 * TODO: Implement via backend API
 */

export const checkAvailability = async () => {
    return { available: false, error: 'Not implemented' };
};

export async function findNearbyStoresWithStock(pId: string, lat: number, lng: number, rad: number) {
    return [];
}
