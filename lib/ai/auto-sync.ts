/**
 * AI auto-sync - deprecated
 * TODO: Implement via backend API
 */

export const autoSync = {
    sync: async () => ({ success: false, error: 'Not implemented' }),
};

export async function autoSyncProduct(tenantId: string, userId: string, product: any) {
    return {
        action: 'queued',
        message: 'Mock auto-sync response',
        productId: 'mock-global-id',
        pendingId: 'mock-pending-id'
    };
}

export async function approvePendingProduct(id: string) {
    return { success: true };
}

export async function rejectPendingProduct(id: string) {
    return { success: true };
}
