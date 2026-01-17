
'use client';

import React, { useEffect, useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/shop/checkout/success`,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs" as const,
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Pay ${amount.toFixed(2)}</h2>
                <p className="text-gray-500 text-sm">Enter your card details securely below.</p>
            </div>

            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
                </span>
            </button>

            {/* Show any error or success messages */}
            {message && <div id="payment-message" className="mt-4 text-center text-red-500 font-medium">{message}</div>}
        </form>
    );
}
