import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await req.json();
        const { paymentMethodId, cart, total, tenantId } = body;

        console.log('Processing payment for tenant:', tenantId);

        // 1. Get user from session
        // Note: In production, properly extract session from cookie

        // 2. Get tenant from hostname (in real scenario, extract from request)
        // For now, we'll need the tenant ID from the request

        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
        }

        // 3. Get tenant's Stripe secret key
        const { data: paymentConfig, error: configError } = await supabase
            .from('tenant-payment-config')
            .select('stripe-secret-key')
            .eq('tenant-id', tenantId)
            .single();

        if (configError || !paymentConfig) {
            console.error('Payment config error:', configError);
            return NextResponse.json({ error: 'Payment configuration not found' }, { status: 400 });
        }

        const secretKey = paymentConfig['stripe-secret-key'];
        if (!secretKey) {
            return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 400 });
        }

        // 4. Initialize Stripe with tenant's secret key
        const stripe = new Stripe(secretKey, {
            apiVersion: '2024-12-18.acacia'
        });

        console.log('Creating payment intent for amount:', total);

        // 5. Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convert to cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
        }

        console.log('Payment successful:', paymentIntent.id);

        // 6. Create order in database
        // TODO: Implement order creation logic
        // You can add order creation logic to save cart items to customer-order-header and order-line-item-detail

        return NextResponse.json({
            success: true,
            paymentIntentId: paymentIntent.id
        });

    } catch (error: any) {
        console.error('Payment processing error:', error);
        return NextResponse.json({
            error: error.message || 'Payment processing failed'
        }, { status: 500 });
    }
}
