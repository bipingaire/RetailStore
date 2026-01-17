'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

function CheckoutForm({ cart, total, tenantId, onSuccess }: { cart: CartItem[], total: number, tenantId: string, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error('Card element not found');

            // Create payment method
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
                setLoading(false);
                return;
            }

            // Create order in database and process payment
            const response = await fetch('/api/checkout/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    cart,
                    total,
                    tenantId // Pass tenant ID for multi-tenant isolation
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Payment processing failed');
            }

            toast.success('Payment successful!');
            onSuccess();
        } catch (err: any) {
            console.error('Payment error:', err);
            toast.error(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Card Details</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#374151',
                                    '::placeholder': { color: '#9CA3AF' },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard size={20} />
                        Pay ${total.toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentEnabled, setPaymentEnabled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [tenantId, setTenantId] = useState<string>('');

    useEffect(() => {
        initializeCheckout();
    }, []);

    async function initializeCheckout() {
        setLoading(true);

        try {
            // 1. Check authentication
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Please login to checkout');
                router.push('/shop/login');
                return;
            }
            setUser(user);

            // 2. Get cart from localStorage
            const savedCart = localStorage.getItem('retail_cart');
            if (!savedCart || JSON.parse(savedCart).length === 0) {
                toast.error('Your cart is empty');
                router.push('/shop');
                return;
            }

            const cartData = JSON.parse(savedCart);

            // 3. Fetch product details for cart items
            const productIds = Object.keys(cartData);
            const { data: products } = await supabase
                .from('retail-store-inventory-item')
                .select(`
          id: inventory-id,
          price: selling-price-amount,
          global_products: global-product-master-catalog!global-product-id (
            name: product-name,
            image_url: image-url
          )
        `)
                .in('inventory-id', productIds);

            const cartItems: CartItem[] = (products || []).map((p: any) => ({
                id: p.id,
                name: p.global_products.name,
                price: p.price,
                quantity: cartData[p.id],
                image: p.global_products.image_url
            }));

            setCart(cartItems);

            // 4. Get tenant Stripe keys
            const hostname = window.location.hostname;
            const subdomain = hostname.split('.')[0];
            const lookupSubdomain = hostname.includes('localhost') ? 'highpoint' : subdomain;

            const { data: tenantData } = await supabase
                .from('subdomain-tenant-mapping')
                .select('tenant-id')
                .eq('subdomain', lookupSubdomain)
                .single();

            if (!tenantData) {
                toast.error('Store configuration error');
                return;
            }

            const currentTenantId = tenantData['tenant-id'];
            setTenantId(currentTenantId); // Store tenant ID for payment processing

            const { data: paymentConfig } = await supabase
                .from('tenant-payment-config')
                .select('stripe-publishable-key, payment-enabled')
                .eq('tenant-id', currentTenantId)
                .maybeSingle();

            if (!paymentConfig || !paymentConfig['payment-enabled']) {
                toast.error('Payments not configured for this store');
                setPaymentEnabled(false);
                setLoading(false);
                return;
            }

            // 5. Initialize Stripe with tenant's publishable key
            const publishableKey = paymentConfig['stripe-publishable-key'];
            setStripePromise(loadStripe(publishableKey));
            setPaymentEnabled(true);

        } catch (err: any) {
            console.error('Checkout initialization error:', err);
            toast.error('Failed to load checkout');
        } finally {
            setLoading(false);
        }
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePaymentSuccess = () => {
        localStorage.removeItem('retail_cart');
        router.push('/shop/checkout/success');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!paymentEnabled) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md">
                    <AlertCircle className="text-red-500 h-12 w-12 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Payments Unavailable</h2>
                    <p className="text-gray-600 text-center">This store hasn't configured payment processing yet. Please contact the store owner.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShoppingBag size={20} />
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        ) : (
                                            <ShoppingBag className="text-gray-400" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-2xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard size={20} />
                            Payment Details
                        </h2>

                        {stripePromise && tenantId && (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm cart={cart} total={total} tenantId={tenantId} onSuccess={handlePaymentSuccess} />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
