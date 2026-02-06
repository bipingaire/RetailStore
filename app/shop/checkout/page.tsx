'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CheckCircle, Package, MapPin, CreditCard, ArrowRight,
    Loader2, ShoppingBag, Calendar, Truck
} from 'lucide-react';
import Link from 'next/link';


function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<any[]>([]);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

    // Address state
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    useEffect(() => {
        const savedCart = localStorage.getItem('retail_cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            loadCartItems(cartData);
        }
    }, []);

    async function loadCartItems(cartData: Record<string, number>) {
        const ids = Object.keys(cartData);
        if (ids.length === 0) return;

        const { data } = await supabase
            .from('retail-store-inventory-item')
            .select('id:"inventory-id", price:"selling-price-amount", global_products:"global-product-master-catalog"!"global-product-id"(name:"product-name", image_url:"image-url")')
            .in('inventory-id', ids);

        if (data) {
            const items = data.map((item: any) => ({
                ...item,
                quantity: cartData[item.id] || 0,
            }));
            setCart(items);
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = fulfillmentType === 'delivery' ? 5.99 : 0;
    const total = subtotal + tax + deliveryFee;

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

    const handlePlaceOrder = async () => {
        if (step === 1) {
            if (!validateStep1()) return;
            setStep(2);
            return;
        }

        if (step === 2) {
            setLoading(true);

            try {
                // Create order in database
                const { data: orderData, error: orderError } = await supabase
                    .from('customer-order-header')
                    .insert({
                        'customer-name': customerName,
                        'customer-email': customerEmail,
                        'customer-phone': customerPhone,
                        'total-amount-value': subtotal,
                        'tax-amount': tax,
                        'final-amount': total,
                        'fulfillment-type': fulfillmentType,
                        'payment-method': paymentMethod,
                        'payment-status': paymentMethod === 'cash' ? 'pending' : 'paid',
                        'order-status-code': 'confirmed',
                    })
                    .select()
                    .single();

                if (orderError) throw orderError;

                // Create order line items
                for (const item of cart) {
                    await supabase
                        .from('order-line-item-detail')
                        .insert({
                            'order-id': orderData['order-id'],
                            'inventory-id': item.id,
                            'product-name': item.global_products.name,
                            'quantity-ordered': item.quantity,
                            'unit-price-amount': item.price,
                            'total-amount': item.price * item.quantity,
                        });
                }

                // Create delivery address if delivery
                if (fulfillmentType === 'delivery') {
                    await supabase
                        .from('delivery-address-information')
                        .insert({
                            'order-id': orderData['order-id'],
                            'address-line-1': addressLine1,
                            'address-line-2': addressLine2,
                            'city-name': city,
                            'state-code': state,
                            'zip-code': zipCode,
                            'delivery-instructions': deliveryInstructions,
                        });
                }

                // Clear cart
                localStorage.removeItem('retail_cart');

                // Redirect to success page
                router.push(`/shop/checkout/success?orderId=${orderData['order-id']}`);

            } catch (error) {
                console.error('Order error:', error);
                alert('Failed to place order. Please try again.');
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
                                            onClick={() => setFulfillmentType('delivery')}
                                            className={`p-4 rounded-lg border-2 transition ${fulfillmentType === 'delivery'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Truck className={`mx-auto mb-2 ${fulfillmentType === 'delivery' ? 'text-green-600' : 'text-gray-400'}`} />
                                            <div className="font-bold text-sm">Delivery</div>
                                            <div className="text-xs text-gray-500">$5.99</div>
                                        </button>

                                        <button
                                            onClick={() => setFulfillmentType('pickup')}
                                            className={`p-4 rounded-lg border-2 transition ${fulfillmentType === 'pickup'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Package className={`mx-auto mb-2 ${fulfillmentType === 'pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                                            <div className="font-bold text-sm">Pickup</div>
                                            <div className="text-xs text-gray-500">Free</div>
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
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="text-green-600" />
                                    Payment Method
                                </h2>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`w-full p-4 rounded-lg border-2 text-left transition ${paymentMethod === 'card'
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className={paymentMethod === 'card' ? 'text-green-600' : 'text-gray-400'} />
                                            <div>
                                                <div className="font-bold">Credit/Debit Card</div>
                                                <div className="text-xs text-gray-500">Pay securely with card</div>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`w-full p-4 rounded-lg border-2 text-left transition ${paymentMethod === 'cash'
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Package className={paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-400'} />
                                            <div>
                                                <div className="font-bold">Cash on {fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}</div>
                                                <div className="text-xs text-gray-500">Pay when you receive</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-sm text-blue-800">
                                        <strong>Note:</strong> Stripe payment integration will be added in production.
                                        For now, card payments are marked as "paid" for testing.
                                    </div>
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
                                            src={item.global_products.image_url || 'https://via.placeholder.com/60'}
                                            alt={item.global_products.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{item.global_products.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                            <div className="text-sm font-bold text-green-700">${(item.price * item.quantity).toFixed(2)}</div>
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

                                <button
                                    onClick={handlePlaceOrder}
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
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
