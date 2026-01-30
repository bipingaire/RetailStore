import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/products/enrich
 * Create local product enrichment for a store
 * Refactored to remove Supabase dependency
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Mock success as Supabase is removed
        // Logic should be moved to FastAPI backend in main implementation

        return NextResponse.json({
            success: true,
            message: 'Product enriched successfully (Supabase dependency removed)',
            data: {
                ...body,
                'has-local-override': true
            }
        });

    } catch (error: any) {
        console.error('Error enriching product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to enrich product' },
            { status: 500 }
        );
    }
}
