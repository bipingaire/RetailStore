'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ShoppingBag, CreditCard, Truck, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type CartItem = {
    inventory_id: string;
    quantity: number;
    product_name: string;
    price: number;
    image_url?: string;
};

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const router = useRouter();

    // Form states
    const [shipping, setShipping] = useState({
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
    });

    const [payment, setPayment] = useState({
        method: 'card',
        cardNumber: '',
        expiry: '',
        cvc: '',
    });

    useEffect(() => {
        loadCart();
    }, []);

    async function loadCart() {
        try {
            const savedCart = localStorage.getItem('retail_cart');
            if (!savedCart) {
                router.push('/shop');
                return;
            }

            const cartData: Record<string, number> = JSON.parse(savedCart);
            const products = await apiClient.request('/api/shop/products', {});

            const items: CartItem[] = Object.entries(cartData).map(([id, qty]) => {
                const product = (products as any[]).find(p => p.inventory_id === id);
                return {
                    inventory_id: id,
                    product_name: product?.product_name || 'Unknown',
                    price: product?.price || 0,
                    quantity: qty,
                    image_url: product?.image_url,
                };
            });

            if (items.length === 0) {
                router.push('/shop');
                return;
            }

            setCart(items);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    async function handleCheckout() {
        setSubmitting(true);
        try {
            if (!apiClient.isAuthenticated()) {
                toast.error('Please login to complete checkout');
                router.push('/shop/login');
                return;
            }

            const orderData = {
                items: cart.map(item => ({
                    inventory_id: item.inventory_id,
                    quantity: item.quantity
                })),
                delivery_address: shipping,
                payment_method: payment.method
            };

            await apiClient.request('/api/shop/checkout', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            localStorage.removeItem('retail_cart');
            toast.success('Order placed successfully!');
            router.push('/shop/orders');
        } catch (error: any) {
            console.error('Checkout failed:', error);
            toast.error(error.message || 'Checkout failed');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                        <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Shipping */}
                        <div className={`bg-white rounded-xl p-6 border ${step === 1 ? 'border-green-500 ring-1 ring-green-100' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <MapPin className="text-gray-600" size={24} />
                                </div>
                                <h2 className="text-xl font-bold">Shipping Address</h2>
                            </div>

                            {step === 1 && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                                            value={shipping.address}
                                            onChange={e => setShipping({ ...shipping, address: e.target.value })}
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                                            value={shipping.city}
                                            onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Zip Code</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                                            value={shipping.zip}
                                            onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                                            placeholder="10001"
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment */}
                        <div className={`bg-white rounded-xl p-6 border ${step === 2 ? 'border-green-500 ring-1 ring-green-100' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <CreditCard className="text-gray-600" size={24} />
                                </div>
                                <h2 className="text-xl font-bold">Payment Method</h2>
                            </div>

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPayment({ ...payment, method: 'card' })}
                                            className={`flex-1 p-4 border rounded-lg text-center font-bold ${payment.method === 'card' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}
                                        >
                                            Credit Card
                                        </button>
                                        <button
                                            onClick={() => setPayment({ ...payment, method: 'cod' })}
                                            className={`flex-1 p-4 border rounded-lg text-center font-bold ${payment.method === 'cod' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200'}`}
                                        >
                                            Cash on Delivery
                                        </button>
                                    </div>

                                    {payment.method === 'card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Expiry</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                                                        placeholder="MM/YY"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">CVC</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Review */}
                        <div className={`bg-white rounded-xl p-6 border ${step === 3 ? 'border-green-500 ring-1 ring-green-100' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Truck className="text-gray-600" size={24} />
                                </div>
                                <h2 className="text-xl font-bold">Review Order</h2>
                            </div>

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping to:</span>
                                            <span className="font-medium text-right">{shipping.address}, {shipping.city}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="font-medium capitalize">{payment.method === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={submitting}
                                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Place Order
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 sticky top-6 border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.inventory_id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            {item.image_url ? (
                                                <img src={item.image_url} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <ShoppingBag size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold line-clamp-2">{item.product_name}</h4>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-500">Qty: {item.quantity}</span>
                                                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-xl font-black mt-2">
                                    <span>Total</span>
                                    <span className="text-green-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
