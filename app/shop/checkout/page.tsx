'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CheckCircle, Package, MapPin, CreditCard, ArrowRight,
    Loader2, ShoppingBag, Calendar, Truck
} from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { apiClient } from '@/lib/api-client';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Supabase removed - refactor needed
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<any[]>([]);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
    const [user, setUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>(
        (searchParams?.get('fulfillment') as 'delivery' | 'pickup') || 'delivery'
    );
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'bank_transfer' | 'wallet'>('card');

    // Pickup only allows cash payment
    const handleFulfillmentChange = (type: 'delivery' | 'pickup') => {
        setFulfillmentType(type);
        if (type === 'pickup') setPaymentMethod('cash');
    };

    // Address state
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    // Stripe State
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Load Stripe Key — endpoint returns { value: 'pk_...' }
    useEffect(() => {
        apiClient.get('/settings/stripe_publishable_key').then((res: any) => {
            const key = typeof res === 'string' ? res : res?.value;
            if (key && typeof key === 'string') setStripePromise(loadStripe(key));
        }).catch(err => console.error("Failed to load Stripe key", err));
    }, []);

    useEffect(() => {
        checkUser();
        const savedCart = localStorage.getItem('retail_cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            loadCartItems(cartData);
        }
    }, []);

    async function checkUser() {
        const storedUser = localStorage.getItem('retail_user');
        const token = localStorage.getItem('retail_token');

        if (!storedUser || !token) {
            router.push(`/shop/login?redirect=/shop/checkout`);
            return;
        }

        const userSession = JSON.parse(storedUser);
        setUser(userSession);

        if (userSession.email) setCustomerEmail(userSession.email);
        if (userSession.name) setCustomerName(userSession.name);
        if (userSession.phone) setCustomerPhone(userSession.phone);

        setCheckingAuth(false);
    }

    async function loadCartItems(cartData: Record<string, number>) {
        const ids = Object.keys(cartData);
        if (ids.length === 0) return;

        try {
            // Fetch all products (temporary workaround as no batch endpoint exists)
            const allProducts: any[] = await apiClient.get('/products');

            // Filter locally
            const items = allProducts
                .filter(p => ids.includes(p.id))
                .map(p => ({
                    id: p.id,
                    price: parseFloat(p.price) || 0,  // Prisma Decimal → JS number
                    quantity: cartData[p.id] || 0,
                    global_products: {
                        name: p.name || 'Unknown Item',
                        image_url: p.image || null
                    }
                }));

            setCart(items);
        } catch (error) {
            console.error("Failed to load cart items", error);
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = fulfillmentType === 'delivery' ? 5.99 : 0;
    const total = subtotal + tax + deliveryFee;

    // Fetch Payment Intent when entering Payment Step
    useEffect(() => {
        if (step === 2 && paymentMethod === 'card' && total > 0) {
            apiClient.post('/sales/payment-intent', { amount: total, currency: 'usd' })
                .then(res => setClientSecret(res.clientSecret))
                .catch(err => console.error("Failed to init payment", err));
        }
    }, [step, paymentMethod, total]);

    const validateStep1 = () => {
        if (!customerName || !customerEmail || !customerPhone) {
            alert('Please fill in all customer details');
            return false;
        }
        if (fulfillmentType === 'delivery' && (!addressLine1 || !city || !zipCode)) {
            alert('Please fill in delivery address');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async (externalPaymentDetails?: any) => {
        if (step === 1) {
            if (!validateStep1()) return;
            setStep(2);
            return;
        }

        if (step === 2) {
            if (paymentMethod === 'card' && !externalPaymentDetails) {
                return;
            }

            setLoading(true);

            try {
                // Map Payment Method to Backend Enum
                // 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER'
                let backendPaymentMethod = 'CASH';
                if (paymentMethod === 'card') backendPaymentMethod = 'CARD';
                else if (paymentMethod === 'bank_transfer') backendPaymentMethod = 'BANK_TRANSFER';
                else if (paymentMethod === 'wallet') backendPaymentMethod = 'MOBILE_MONEY';

                const salePayload = {
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        unitPrice: item.price,
                        subtotal: item.price * item.quantity
                    })),
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    amountPaid: total, // Assuming full payment or pay-on-delivery
                    paymentMethod: backendPaymentMethod,
                    customerId: user?.id,
                    notes: fulfillmentType === 'delivery'
                        ? `Delivery to: ${addressLine1}, ${addressLine2}, ${city}, ${state} ${zipCode}. Instructions: ${deliveryInstructions}`
                        : 'Pickup Order'
                };

                const orderData = await apiClient.post('/sales', salePayload);

                // Clear cart
                localStorage.removeItem('retail_cart');

                // Redirect to success page
                router.push(`/shop/checkout/success?orderId=${orderData.id}`);

            } catch (error: any) {
                console.error('Order error:', error);
                alert(`Failed to place order: ${error.message || error}`);
            } finally {
                setLoading(false);
            }
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some products to get started</p>
                    <Link href="/shop" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                                {step > 1 ? <CheckCircle size={20} /> : '1'}
                            </div>
                            <span className="font-bold text-sm">Details</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                                {step > 2 ? <CheckCircle size={20} /> : '2'}
                            </div>
                            <span className="font-bold text-sm">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Form */}
                    <div className="lg:col-span-2">

                        {/* Step 1: Customer & Delivery Details */}
                        {step === 1 && (
                            <div className="space-y-6">

                                {/* Customer Information */}
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="text-green-600" />
                                        Customer Information
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                value={customerEmail}
                                                onChange={(e) => setCustomerEmail(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Fulfillment Type */}
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Fulfillment Method</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleFulfillmentChange('delivery')}
                                            className={`p-4 rounded-lg border-2 transition ${fulfillmentType === 'delivery'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Truck className={`mx-auto mb-2 ${fulfillmentType === 'delivery' ? 'text-green-600' : 'text-gray-400'}`} />
                                            <div className="font-bold text-sm">Delivery</div>
                                            <div className="text-xs text-gray-500">$5.99 — Card, Bank, Wallet, Cash</div>
                                        </button>

                                        <button
                                            onClick={() => handleFulfillmentChange('pickup')}
                                            className={`p-4 rounded-lg border-2 transition ${fulfillmentType === 'pickup'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Package className={`mx-auto mb-2 ${fulfillmentType === 'pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                                            <div className="font-bold text-sm">Pickup</div>
                                            <div className="text-xs text-gray-500">Free — Cash only</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                {fulfillmentType === 'delivery' && (
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="text-green-600" />
                                            Delivery Address
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                                                <input
                                                    type="text"
                                                    value={addressLine1}
                                                    onChange={(e) => setAddressLine1(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="123 Main St"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Apt, Suite (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={addressLine2}
                                                    onChange={(e) => setAddressLine2(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Apt 4B"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                                    <input
                                                        type="text"
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="New York"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                                    <input
                                                        type="text"
                                                        value={state}
                                                        onChange={(e) => setState(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="NY"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code *</label>
                                                <input
                                                    type="text"
                                                    value={zipCode}
                                                    onChange={(e) => setZipCode(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="10001"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Instructions</label>
                                                <textarea
                                                    value={deliveryInstructions}
                                                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    rows={3}
                                                    placeholder="Leave at front door, ring bell, etc."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="text-emerald-600" />
                                    Select Payment Method
                                </h2>

                                <div className="space-y-4">

                                    {/* Pickup info banner */}
                                    {fulfillmentType === 'pickup' && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                                            <Package size={18} className="text-amber-600 flex-shrink-0" />
                                            <span><strong>Pickup orders</strong> are cash only. Please bring exact change when collecting your order.</span>
                                        </div>
                                    )}

                                    {/* Stripe / Card — delivery only */}
                                    {fulfillmentType === 'delivery' && <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'card'
                                            ? 'border-emerald-600 bg-emerald-50 shadow-md transform scale-[1.01]'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Credit / Debit Card</div>
                                                <div className="text-xs text-gray-500">Secure payment via Stripe</div>
                                            </div>
                                        </div>
                                        {paymentMethod === 'card' && (
                                            <div className="mt-4 pl-14">
                                                {clientSecret && stripePromise ? (
                                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                                        <StripePaymentForm
                                                            clientSecret={clientSecret}
                                                            totalAmount={total}
                                                            onSuccess={(details) => handlePlaceOrder(details)}
                                                        />
                                                    </Elements>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm p-4 border rounded-lg bg-gray-50">
                                                        <Loader2 className="animate-spin" size={16} /> Secure payment details loading...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </button>}

                                    {/* Bank Transfer — delivery only */}
                                    {fulfillmentType === 'delivery' && <button
                                        onClick={() => setPaymentMethod('bank_transfer')}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'bank_transfer'
                                            ? 'border-emerald-600 bg-emerald-50 shadow-md transform scale-[1.01]'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <div className="font-bold text-xs">BANK</div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Bank Transfer</div>
                                                <div className="text-xs text-gray-500">Direct deposit to our account</div>
                                            </div>
                                        </div>
                                        {paymentMethod === 'bank_transfer' && (
                                            <div className="mt-4 pl-14 p-4 bg-white rounded-lg border text-sm text-gray-700 space-y-1">
                                                <p className="font-bold text-gray-900">Bank Details:</p>
                                                <p>Bank: <span className="font-mono">InduBank Corp</span></p>
                                                <p>Account: <span className="font-mono font-bold">1234-5678-9012</span></p>
                                                <p>Routing: <span className="font-mono">987654321</span></p>
                                                <p className="text-xs text-emerald-600 mt-2 font-medium">Please upload valid proof after order.</p>
                                            </div>
                                        )}
                                    </button>}

                                    {/* Wallet — delivery only */}
                                    {fulfillmentType === 'delivery' && <button
                                        onClick={() => setPaymentMethod('wallet')}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'wallet'
                                            ? 'border-emerald-600 bg-emerald-50 shadow-md transform scale-[1.01]'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <div className="font-bold text-xs">PAY</div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Digital Wallet</div>
                                                <div className="text-xs text-gray-500">PayPal, Google Pay, Apple Pay</div>
                                            </div>
                                        </div>
                                        {paymentMethod === 'wallet' && (
                                            <div className="mt-4 pl-14 grid grid-cols-3 gap-2">
                                                <button className="py-2 px-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700">PayPal</button>
                                                <button className="py-2 px-1 bg-black text-white text-xs font-bold rounded hover:bg-gray-800">Apple Pay</button>
                                                <button className="py-2 px-1 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50">GPay</button>
                                            </div>
                                        )}
                                    </button>}

                                    {/* Cash */}
                                    <button
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === 'cash'
                                            ? 'border-emerald-600 bg-emerald-50 shadow-md transform scale-[1.01]'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Cash on {fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}</div>
                                                <div className="text-xs text-gray-500">Pay when you receive your order</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.global_products.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%239ca3af'%3ENo img%3C/text%3E%3C/svg%3E"}
                                            alt={item.global_products.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{item.global_products.name}</div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                                                <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (8%)</span>
                                    <span className="font-bold">${tax.toFixed(2)}</span>
                                </div>
                                {fulfillmentType === 'delivery' && (
                                    <div className="flex justify-between text-sm">
                                        <span>Delivery Fee</span>
                                        <span className="font-bold">${deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 flex justify-between text-lg font-black">
                                    <span>Total</span>
                                    <span className="text-green-700">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {step === 2 && (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                                    >
                                        Back
                                    </button>
                                )}

                                {!(step === 2 && paymentMethod === 'card') && (
                                    <button
                                        onClick={() => handlePlaceOrder()}
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {step === 1 ? 'Continue to Payment' : 'Place Order'}
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                )}
                                {step === 2 && paymentMethod === 'card' && (
                                    <div className="text-center text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        Please complete payment in the secure form to place your order.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </div >
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600" size={40} /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

