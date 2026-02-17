
import { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function StripePaymentForm({ clientSecret, onSuccess, totalAmount }: { clientSecret: string, onSuccess: (details: any) => void, totalAmount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;

        const clientSecretParam = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecretParam) return;

        stripe.retrievePaymentIntent(clientSecretParam).then(({ paymentIntent }) => {
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is required but we handle success via redirect or callback if non-redirect?
                // Actually, for simple integration, we can set redirect: 'if_required'.
                return_url: `${window.location.origin}/shop/checkout/success`,
            },
            redirect: "if_required",
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "An unexpected error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            toast.success("Payment Successful!");
            onSuccess({
                id: paymentIntent.id,
                provider: 'stripe',
                status: 'paid'
            });
        } else {
            setMessage("Payment status: " + paymentIntent?.status);
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-xl bg-white shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Lock size={14} className="text-green-600" /> Secure Card Payment
            </h3>

            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && (
                <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <AlertTriangle size={16} /> {message}
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : `Pay $${totalAmount.toFixed(2)}`}
            </button>
        </form>
    );
}
