import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/admin/products/enrich
 * Create local product enrichment for a store
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            inventoryId,
            tenantId,
            overrideImageUrl,
            overrideDescription,
            customData
        } = body;

        // Get user from auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update inventory item with local enrichment
        const { data, error } = await supabase
            .from('retail-store-inventory-item')
            .update({
                'local-enrichment-json': customData,
                'has-local-override': true,
                'override-image-url': overrideImageUrl,
                'override-description': overrideDescription,
                'updated-at': new Date().toISOString()
            })
            .eq('inventory-id', inventoryId)
            .eq('tenant-id', tenantId)
            .select()
            .single();

        if (error) throw error;

        // Log enrichment history
        const inventoryItem = await supabase
            .from('retail-store-inventory-item')
            .select('global-product-id')
            .eq('inventory-id', inventoryId)
            .single();

        if ((inventoryItem.data as any)?.['global-product-id']) {
            await supabase.from('product-enrichment-history').insert({
                'product-id': (inventoryItem.data as any)['global-product-id'],
                'enriched-by-user-id': user.id,
                'enrichment-type': 'store-admin-override',
                'tenant-id': tenantId,
                'changes-json': {
                    overrideImageUrl,
                    overrideDescription,
                    customData
                },
                'enrichment-source': 'manual'
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Product enriched successfully',
            data
        });

    } catch (error: any) {
        console.error('Error enriching product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to enrich product' },
            { status: 500 }
        );
    }
}
