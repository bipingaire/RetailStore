import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { autoSyncProduct } from '@/lib/ai/auto-sync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST /api/admin/products/add-new
 * Add a new product to store inventory with auto-sync to master catalog
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            tenantId,
            productName,
            upc,
            brand,
            manufacturer,
            category,
            description,
            imageUrl,
            sellingPrice,
            costPrice,
            initialStock
        } = body;

        // Get user from auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Auto-sync to master catalog using AI
        const syncResult = await autoSyncProduct(
            tenantId,
            user.id,
            {
                name: productName,
                upc,
                brand,
                manufacturer,
                category,
                description,
                imageUrl
            }
        );

        let globalProductId = syncResult.productId;

        // If queued for review, create inventory item without global link
        if (syncResult.action === 'queued') {
            const { data: inventoryItem, error: inventoryError } = await supabase
                .from('retail-store-inventory-item')
                .insert({
                    'tenant-id': tenantId,
                    'global-product-id': null, // Will be linked after superadmin approval
                    'custom-product-name': productName,
                    'current-stock-quantity': initialStock || 0,
                    'selling-price-amount': sellingPrice,
                    'cost-price-amount': costPrice,
                    'is-active': true
                })
                .select()
                .single();

            if (inventoryError) throw inventoryError;

            return NextResponse.json({
                success: true,
                action: 'queued',
                message: 'Product added to inventory and queued for superadmin review',
                inventoryId: inventoryItem['inventory-id'],
                pendingId: syncResult.pendingId
            });
        }

        // Product was either linked or added to master catalog
        const { data: inventoryItem, error: inventoryError } = await supabase
            .from('retail-store-inventory-item')
            .insert({
                'tenant-id': tenantId,
                'global-product-id': globalProductId,
                'current-stock-quantity': initialStock || 0,
                'selling-price-amount': sellingPrice,
                'cost-price-amount': costPrice,
                'is-active': true
            })
            .select()
            .single();

        if (inventoryError) throw inventoryError;

        return NextResponse.json({
            success: true,
            action: syncResult.action,
            message: syncResult.message,
            inventoryId: inventoryItem['inventory-id'],
            globalProductId
        });

    } catch (error: any) {
        console.error('Error adding product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add product' },
            { status: 500 }
        );
    }
}
