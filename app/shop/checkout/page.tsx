'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, ShoppingBag, CheckCircle, AlertCircle, Wallet, Banknote } from 'lucide-react';
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

type PaymentMethod = 'stripe' | 'wallet' | 'cash';

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
                    tenantId,
                    paymentMethod: 'stripe'
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
    const [walletBalance, setWalletBalance] = useState<number>(0);

    // Selected payment method
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('stripe');
    const [processingPayment, setProcessingPayment] = useState(false);

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
            setTenantId(currentTenantId);

            const { data: paymentConfig } = await supabase
                .from('tenant-payment-config')
                .select('stripe-publishable-key, payment-enabled')
                .eq('tenant-id', currentTenantId)
                .maybeSingle();

            if (paymentConfig && paymentConfig['payment-enabled']) {
                const publishableKey = paymentConfig['stripe-publishable-key'];
                setStripePromise(loadStripe(publishableKey));
                setPaymentEnabled(true);
            }

            // 5. Fetch customer wallet balance
            const { data: customerData } = await supabase
                .from('retail-store-customer')
                .select('wallet-balance')
                .eq('user-id', user.id)
                .single();

            setWalletBalance(customerData?.['wallet-balance'] || 0);

        } catch (err: any) {
            console.error('Checkout initialization error:', err);
            toast.error('Failed to load checkout');
        } finally {
            setLoading(false);
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.13; // 13% tax
    const deliveryCharges = 5.00;
    const total = subtotal + tax + deliveryCharges;

    const handlePaymentSuccess = () => {
        // Save order details for success page
        const orderData = {
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            tax,
            deliveryCharges,
            total,
            orderDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            orderId: `ORD-${Date.now()}`
        };

        sessionStorage.setItem('last_order', JSON.stringify(orderData));
        localStorage.removeItem('retail_cart');
        router.push('/shop/checkout/success');
    };

    async function handleWalletPayment() {
        setProcessingPayment(true);

        try {
            if (walletBalance < total) {
                toast.error(`Insufficient wallet balance. You have $${walletBalance.toFixed(2)}`);
                setProcessingPayment(false);
                return;
            }

            const response = await fetch('/api/checkout/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart,
                    total,
                    tenantId,
                    paymentMethod: 'wallet',
                    userId: user.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Payment failed');
            }

            toast.success('Payment successful! Wallet balance deducted.');
            handlePaymentSuccess();
        } catch (err: any) {
            console.error('Wallet payment error:', err);
            toast.error(err.message || 'Payment failed');
        } finally {
            setProcessingPayment(false);
        }
    }

    async function handleCashPayment() {
        setProcessingPayment(true);

        try {
            const response = await fetch('/api/checkout/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart,
                    total,
                    tenantId,
                    paymentMethod: 'cash',
                    userId: user.id
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Order failed');
            }

            toast.success('Order placed! Pay cash on delivery.');
            handlePaymentSuccess();
        } catch (err: any) {
            console.error('Cash order error:', err);
            toast.error(err.message || 'Order failed');
        } finally {
            setProcessingPayment(false);
        }
    }

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

                        {/* Product Table */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 text-gray-600 font-semibold">Product</th>
                                        <th className="text-right py-2 text-gray-600 font-semibold">Qty</th>
                                        <th className="text-right py-2 text-gray-600 font-semibold">Unit Price</th>
                                        <th className="text-right py-2 text-gray-600 font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.id} className="border-b border-gray-100">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {item.image ? (
                                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                                        ) : (
                                                            <ShoppingBag className="text-gray-400" size={18} />
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-right text-gray-700">{item.quantity}</td>
                                            <td className="py-3 text-right text-gray-700">${item.price.toFixed(2)}</td>
                                            <td className="py-3 text-right font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (13%)</span>
                                <span>${(total * 0.13).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery Charges</span>
                                <span>$5.00</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>${(total + (total * 0.13) + 5).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-6">
                        {/* Payment Method Selector */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>

                            <div className="space-y-3">
                                {/* Stripe Card Option */}
                                {paymentEnabled && (
                                    <button
                                        onClick={() => setSelectedPaymentMethod('stripe')}
                                        className={`w-full border-2 rounded-lg p-4 text-left transition ${selectedPaymentMethod === 'stripe'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'stripe' ? 'border-blue-600' : 'border-gray-300'
                                                }`}>
                                                {selectedPaymentMethod === 'stripe' && (
                                                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                                )}
                                            </div>
                                            <CreditCard className="text-gray-700" size={24} />
                                            <div>
                                                <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                                                <div className="text-xs text-gray-500">Secure payment via Stripe</div>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {/* Wallet Option */}
                                <button
                                    onClick={() => setSelectedPaymentMethod('wallet')}
                                    className={`w-full border-2 rounded-lg p-4 text-left transition ${selectedPaymentMethod === 'wallet'
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'wallet' ? 'border-purple-600' : 'border-gray-300'
                                            }`}>
                                            {selectedPaymentMethod === 'wallet' && (
                                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                            )}
                                        </div>
                                        <Wallet className="text-gray-700" size={24} />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">Wallet Balance</div>
                                            <div className="text-xs text-gray-500">
                                                Available: ${walletBalance.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Cash on Delivery Option */}
                                <button
                                    onClick={() => setSelectedPaymentMethod('cash')}
                                    className={`w-full border-2 rounded-lg p-4 text-left transition ${selectedPaymentMethod === 'cash'
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'cash' ? 'border-green-600' : 'border-gray-300'
                                            }`}>
                                            {selectedPaymentMethod === 'cash' && (
                                                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                            )}
                                        </div>
                                        <Banknote className="text-gray-700" size={24} />
                                        <div>
                                            <div className="font-semibold text-gray-900">Cash on Delivery</div>
                                            <div className="text-xs text-gray-500">Pay when you receive</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Payment Form Based on Selected Method */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {selectedPaymentMethod === 'stripe' && stripePromise && tenantId && paymentEnabled ? (
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm cart={cart} total={total} tenantId={tenantId} onSuccess={handlePaymentSuccess} />
                                </Elements>
                            ) : selectedPaymentMethod === 'stripe' && !paymentEnabled ? (
                                <div className="text-center py-8 text-gray-500">
                                    <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                    <p>Card payments not available</p>
                                </div>
                            ) : selectedPaymentMethod === 'wallet' ? (
                                <div className="space-y-4">
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-purple-900">Current Balance</span>
                                            <span className="text-lg font-bold text-purple-900">${walletBalance.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-purple-900">Order Total</span>
                                            <span className="text-lg font-bold text-purple-900">-${total.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-purple-300 mt-2 pt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-purple-900">Remaining</span>
                                                <span className={`text-lg font-bold ${walletBalance >= total ? 'text-green-600' : 'text-red-600'}`}>
                                                    ${(walletBalance - total).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleWalletPayment}
                                        disabled={processingPayment || walletBalance < total}
                                        className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Wallet size={20} />
                                                Pay from Wallet
                                            </>
                                        )}
                                    </button>

                                    {walletBalance < total && (
                                        <p className="text-sm text-red-600 text-center">
                                            Insufficient balance. Please add ${(total - walletBalance).toFixed(2)} to your wallet.
                                        </p>
                                    )}
                                </div>
                            ) : selectedPaymentMethod === 'cash' ? (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-green-900 mb-2">Cash on Delivery</h3>
                                        <ul className="text-sm text-green-800 space-y-1">
                                            <li>✓ Pay when you receive your order</li>
                                            <li>✓ No online payment required</li>
                                            <li>✓ Exact change appreciated</li>
                                        </ul>
                                    </div>

                                    <button
                                        onClick={handleCashPayment}
                                        disabled={processingPayment}
                                        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <Banknote size={20} />
                                                Place Order (COD)
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
