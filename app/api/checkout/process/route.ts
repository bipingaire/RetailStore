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
        const { paymentMethod, paymentMethodId, cart, total, tenantId, userId } = body;

        console.log('Processing payment:', { method: paymentMethod, tenant: tenantId });

        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
        }

        // Handle different payment methods
        if (paymentMethod === 'stripe') {
            // STRIPE CARD PAYMENT
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

            const stripe = new Stripe(secretKey, {
                apiVersion: '2024-12-18.acacia'
            });

            console.log('Creating payment intent for amount:', total);

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

            console.log('Stripe payment successful:', paymentIntent.id);

            // Create order in database
            const orderId = `ORD-${Date.now()}`;

            const { error: orderError } = await supabase
                .from('customer-order-header')
                .insert({
                    'order-id': orderId,
                    'customer-id': userId,
                    'order-date': new Date().toISOString(),
                    'order-status': 'paid',
                    'payment-method': 'stripe',
                    'payment-reference': paymentIntent.id,
                    'total-amount': total
                });

            if (orderError) {
                console.error('Order creation error:', orderError);
            } else {
                // Insert line items
                const lineItems = cart.map((item: any) => ({
                    'order-id': orderId,
                    'inventory-id': item.id,
                    'quantity-ordered': item.quantity,
                    'unit-price': item.price,
                    'line-total': item.price * item.quantity
                }));

                const { error: lineItemsError } = await supabase
                    .from('order-line-item-detail')
                    .insert(lineItems);

                if (lineItemsError) {
                    console.error('Line items error:', lineItemsError);
                }

                console.log('Order created successfully:', orderId);
            }

            return NextResponse.json({
                success: true,
                paymentIntentId: paymentIntent.id,
                orderId,
                method: 'stripe'
            });

        } else if (paymentMethod === 'wallet') {
            // WALLET PAYMENT
            if (!userId) {
                return NextResponse.json({ error: 'User ID required' }, { status: 400 });
            }

            const { data: customer, error: customerError } = await supabase
                .from('retail-store-customer')
                .select('wallet-balance, customer-id')
                .eq('user-id', userId)
                .single();

            if (customerError || !customer) {
                return NextResponse.json({ error: 'Customer not found' }, { status: 400 });
            }

            const walletBalance = customer['wallet-balance'] || 0;

            if (walletBalance < total) {
                return NextResponse.json({
                    error: `Insufficient wallet balance. You have $${walletBalance.toFixed(2)}`
                }, { status: 400 });
            }

            // Deduct from wallet
            const newBalance = walletBalance - total;
            const { error: updateError } = await supabase
                .from('retail-store-customer')
                .update({ 'wallet-balance': newBalance })
                .eq('customer-id', customer['customer-id']);

            if (updateError) {
                console.error('Wallet update error:', updateError);
                return NextResponse.json({ error: 'Failed to process wallet payment' }, { status: 500 });
            }

            console.log('Wallet payment successful. New balance:', newBalance);

            // Create order in database
            const orderId = `ORD-${Date.now()}`;

            const { error: orderError } = await supabase
                .from('customer-order-header')
                .insert({
                    'order-id': orderId,
                    'customer-id': userId,
                    'order-date': new Date().toISOString(),
                    'order-status': 'paid',
                    'payment-method': 'wallet',
                    'payment-reference': `WALLET-${Date.now()}`,
                    'total-amount': total
                });

            if (orderError) {
                console.error('Order creation error:', orderError);
            } else {
                // Insert line items
                const lineItems = cart.map((item: any) => ({
                    'order-id': orderId,
                    'inventory-id': item.id,
                    'quantity-ordered': item.quantity,
                    'unit-price': item.price,
                    'line-total': item.price * item.quantity
                }));

                const { error: lineItemsError } = await supabase
                    .from('order-line-item-detail')
                    .insert(lineItems);

                if (lineItemsError) {
                    console.error('Line items error:', lineItemsError);
                }

                console.log('Order created successfully:', orderId);
            }

            return NextResponse.json({
                success: true,
                orderId,
                method: 'wallet',
                newBalance
            });

        } else if (paymentMethod === 'cash') {
            // CASH ON DELIVERY
            if (!userId) {
                return NextResponse.json({ error: 'User ID required' }, { status: 400 });
            }

            console.log('Cash on delivery order placed');

            // Create order in database with 'pending_payment' status
            const orderId = `ORD-${Date.now()}`;

            const { error: orderError } = await supabase
                .from('customer-order-header')
                .insert({
                    'order-id': orderId,
                    'customer-id': userId,
                    'order-date': new Date().toISOString(),
                    'order-status': 'pending_payment',
                    'payment-method': 'cash',
                    'payment-reference': `COD-${Date.now()}`,
                    'total-amount': total
                });

            if (orderError) {
                console.error('Order creation error:', orderError);
                return NextResponse.json({
                    error: 'Failed to create order'
                }, { status: 500 });
            }

            // Insert line items
            const lineItems = cart.map((item: any) => ({
                'order-id': orderId,
                'inventory-id': item.id,
                'quantity-ordered': item.quantity,
                'unit-price': item.price,
                'line-total': item.price * item.quantity
            }));

            const { error: lineItemsError } = await supabase
                .from('order-line-item-detail')
                .insert(lineItems);

            if (lineItemsError) {
                console.error('Line items error:', lineItemsError);
            }

            console.log('COD order created successfully:', orderId);

            return NextResponse.json({
                success: true,
                orderId,
                method: 'cash',
                message: 'Order placed successfully. Pay on delivery.'
            });

        } else {
            return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Payment processing error:', error);
        return NextResponse.json({
            error: error.message || 'Payment processing failed'
        }, { status: 500 });
    }
}
