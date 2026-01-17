
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia', // Use latest or matching version
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
