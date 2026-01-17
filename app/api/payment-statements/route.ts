import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // Get tenant ID from query parameter
        const { searchParams } = new URL(req.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
        }

        // Get tenant's Stripe secret key
        const { data: paymentConfig, error: configError } = await supabase
            .from('tenant-payment-config')
            .select('stripe-secret-key')
            .eq('tenant-id', tenantId)
            .single();

        if (configError || !paymentConfig) {
            return NextResponse.json({ error: 'Payment configuration not found' }, { status: 400 });
        }

        const secretKey = paymentConfig['stripe-secret-key'];
        if (!secretKey) {
            return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 400 });
        }

        // Initialize Stripe with tenant's secret key
        const stripe = new Stripe(secretKey, {
            apiVersion: '2024-12-18.acacia' as any
        });

        // Fetch recent payment intents (last 100)
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 100
        });

        // Format the data
        const statements = paymentIntents.data.map(pi => ({
            id: pi.id,
            amount: pi.amount / 100, // Convert from cents
            currency: pi.currency.toUpperCase(),
            status: pi.status,
            created: new Date(pi.created * 1000).toISOString(),
            description: pi.description || 'No description',
            customerEmail: pi.receipt_email || 'N/A'
        }));

        return NextResponse.json({ statements });

    } catch (error: any) {
        console.error('Error fetching Stripe statements:', error);
        return NextResponse.json({
            error: error.message || 'Failed to fetch statements'
        }, { status: 500 });
    }
}
