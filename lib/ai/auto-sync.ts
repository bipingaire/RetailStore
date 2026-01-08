/**
 * Auto-sync service for adding store products to master catalog
 */

import { createClient } from '@supabase/supabase-js';
import { matchProductToMasterCatalog, ProductData } from './product-matcher';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AutoSyncResult {
    action: 'linked' | 'added' | 'queued' | 'error';
    productId?: string;
    pendingId?: string;
    message: string;
    confidenceScore?: number;
}

/**
 * Auto-sync a product: match to master catalog or queue for review
 */
export async function autoSyncProduct(
    tenantId: string,
    userId: string,
    productData: ProductData
): Promise<AutoSyncResult> {
    try {
        // Fetch master catalog products for matching
        const { data: masterProducts, error: fetchError } = await supabase
            .from('global-product-master-catalog')
            .select('*')
            .eq('is-active', true);

        if (fetchError) {
            throw new Error(`Failed to fetch master catalog: ${fetchError.message}`);
        }

        // Use AI to match product
        const matchResult = await matchProductToMasterCatalog(
            productData,
            masterProducts || []
        );

        // High confidence: Auto-link to existing product
        if (matchResult.matchFound && matchResult.confidenceScore >= 0.85) {
            return {
                action: 'linked',
                productId: matchResult.matchedProductId,
                message: `Auto-linked to existing product: ${matchResult.reasoning}`,
                confidenceScore: matchResult.confidenceScore
            };
        }

        // Very low confidence: Auto-add as new product
        if (matchResult.confidenceScore < 0.50 && !matchResult.matchFound) {
            const { data: newProduct, error: insertError } = await supabase
                .from('global-product-master-catalog')
                .insert({
                    'upc-ean-code': productData.upc,
                    'product-name': productData.name,
                    'brand-name': productData.brand,
                    'manufacturer-name': productData.manufacturer,
                    'category-name': productData.category,
                    'description-text': productData.description,
                    'image-url': productData.imageUrl,
                    'enrichment-source': 'auto-sync',
                    'is-active': true
                })
                .select()
                .single();

            if (insertError) {
                throw new Error(`Failed to add product: ${insertError.message}`);
            }

            // Log the auto-addition
            await supabase.from('product-enrichment-history').insert({
                'product-id': newProduct['product-id'],
                'enriched-by-user-id': userId,
                'enrichment-type': 'ai-generated',
                'tenant-id': tenantId,
                'changes-json': { action: 'auto-added', productData },
                'enrichment-source': 'auto-sync'
            });

            return {
                action: 'added',
                productId: newProduct['product-id'],
                message: 'Auto-added as new product to master catalog',
                confidenceScore: matchResult.confidenceScore
            };
        }

        // Medium confidence: Queue for manual review
        const { data: pending, error: pendingError } = await supabase
            .from('pending-product-additions')
            .insert({
                'tenant-id': tenantId,
                'added-by-user-id': userId,
                'product-name': productData.name,
                'upc-ean-code': productData.upc,
                'brand-name': productData.brand,
                'manufacturer-name': productData.manufacturer,
                'category-name': productData.category,
                'description-text': productData.description,
                'image-url': productData.imageUrl,
                'suggested-match-product-id': matchResult.matchedProductId,
                'ai-confidence-score': matchResult.confidenceScore,
                'ai-analysis-json': {
                    reasoning: matchResult.reasoning,
                    suggestedAction: matchResult.suggestedAction,
                    masterProducts: masterProducts?.slice(0, 5)
                },
                'status': 'pending'
            })
            .select()
            .single();

        if (pendingError) {
            throw new Error(`Failed to queue product: ${pendingError.message}`);
        }

        return {
            action: 'queued',
            pendingId: pending['pending-id'],
            message: `Queued for superadmin review: ${matchResult.reasoning}`,
            confidenceScore: matchResult.confidenceScore
        };

    } catch (error: any) {
        console.error('Auto-sync error:', error);
        return {
            action: 'error',
            message: error.message || 'Failed to auto-sync product'
        };
    }
}

/**
 * Approve a pending product addition (superadmin action)
 */
export async function approvePendingProduct(
    pendingId: string,
    reviewerId: string,
    action: 'add_new' | 'link_existing',
    existingProductId?: string
): Promise<{ success: boolean; productId?: string; message: string }> {
    try {
        // Get pending product details
        const { data: pending, error: fetchError } = await supabase
            .from('pending-product-additions')
            .select('*')
            .eq('pending-id', pendingId)
            .single();

        if (fetchError || !pending) {
            throw new Error('Pending product not found');
        }

        let productId: string;

        if (action === 'add_new') {
            // Add as new product to master catalog
            const { data: newProduct, error: insertError } = await supabase
                .from('global-product-master-catalog')
                .insert({
                    'upc-ean-code': pending['upc-ean-code'],
                    'product-name': pending['product-name'],
                    'brand-name': pending['brand-name'],
                    'manufacturer-name': pending['manufacturer-name'],
                    'category-name': pending['category-name'],
                    'description-text': pending['description-text'],
                    'image-url': pending['image-url'],
                    'enrichment-source': 'pending-approval',
                    'enriched-by-superadmin': true,
                    'last-enriched-by': reviewerId,
                    'is-active': true
                })
                .select()
                .single();

            if (insertError) {
                throw new Error(`Failed to add product: ${insertError.message}`);
            }

            productId = newProduct['product-id'];

        } else if (action === 'link_existing' && existingProductId) {
            productId = existingProductId;
        } else {
            throw new Error('Invalid action or missing product ID');
        }

        // Update pending status
        await supabase
            .from('pending-product-additions')
            .update({
                'status': action === 'add_new' ? 'approved' : 'merged',
                'reviewed-by': reviewerId,
                'reviewed-at': new Date().toISOString()
            })
            .eq('pending-id', pendingId);

        return {
            success: true,
            productId,
            message: action === 'add_new'
                ? 'Product added to master catalog'
                : 'Product linked to existing catalog entry'
        };

    } catch (error: any) {
        console.error('Error approving pending product:', error);
        return {
            success: false,
            message: error.message || 'Failed to approve product'
        };
    }
}

/**
 * Reject a pending product addition
 */
export async function rejectPendingProduct(
    pendingId: string,
    reviewerId: string,
    reason?: string
): Promise<{ success: boolean; message: string }> {
    try {
        await supabase
            .from('pending-product-additions')
            .update({
                'status': 'rejected',
                'reviewed-by': reviewerId,
                'reviewed-at': new Date().toISOString(),
                'ai-analysis-json': { rejection_reason: reason }
            })
            .eq('pending-id', pendingId);

        return {
            success: true,
            message: 'Product addition rejected'
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Failed to reject product'
        };
    }
}
