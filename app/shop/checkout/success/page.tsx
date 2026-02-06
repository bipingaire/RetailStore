'use client';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            loadOrder(orderId);
        }
    }, [orderId]);

    async function loadOrder(id: string) {
        const { data, error } = await supabase
            .from('customer-order-header')
            .select(`
        *,
        order-line-item-detail (*),
        delivery-address-information (*)
      `)
            .eq('order-id', id)
            .single();

        if (data) {
            setOrder(data);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
                    <Link href="/shop" className="text-green-600 hover:underline">
                        Return to shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">

                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600">Thank you for your purchase</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Order #{order['order-id'].substring(0, 8)}
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

                    {/* Order Info */}
                    <div className="p-6 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Order Date</div>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                    <Calendar size={16} />
                                    {new Date(order['created-at']).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total</div>
                                <div className="text-lg font-black text-green-700">
                                    ${order['final-amount'].toFixed(2)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Status</div>
                                <div className="inline-flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    {order['order-status-code']}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="p-6 border-b">
                        <h3 className="font-bold text-gray-900 mb-3">Customer Information</h3>
                        <div className="space-y-1 text-sm">
                            <div><span className="text-gray-500">Name:</span> <span className="font-bold">{order['customer-name']}</span></div>
                            <div><span className="text-gray-500">Email:</span> <span className="font-bold">{order['customer-email']}</span></div>
                            <div><span className="text-gray-500">Phone:</span> <span className="font-bold">{order['customer-phone']}</span></div>
                        </div>
                    </div>

                    {/* Delivery/Pickup Info */}
                    <div className="p-6 border-b">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            {order['fulfillment-type'] === 'delivery' ? <MapPin size={18} /> : <Package size={18} />}
                            {order['fulfillment-type'] === 'delivery' ? 'Delivery Address' : 'Pickup'}
                        </h3>

                        {order['fulfillment-type'] === 'delivery' && order['delivery-address-information']?.[0] ? (
                            <div className="text-sm">
                                <div className="font-bold">{order['delivery-address-information'][0]['address-line-1']}</div>
                                {order['delivery-address-information'][0]['address-line-2'] && (
                                    <div>{order['delivery-address-information'][0]['address-line-2']}</div>
                                )}
                                <div>
                                    {order['delivery-address-information'][0]['city-name']}, {order['delivery-address-information'][0]['state-code']} {order['delivery-address-information'][0]['zip-code']}
                                </div>
                                {order['delivery-address-information'][0]['delivery-instructions'] && (
                                    <div className="mt-2 text-gray-600 italic">
                                        Note: {order['delivery-address-information'][0]['delivery-instructions']}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">
                                Pick up from store location
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order['order-line-item-detail']?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{item['product-name']}</div>
                                        <div className="text-xs text-gray-500">Qty: {item['quantity-ordered']}</div>
                                    </div>
                                    <div className="font-bold text-sm">${item['total-amount'].toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span className="font-bold">${order['total-amount-value'].toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax</span>
                                <span className="font-bold">${order['tax-amount'].toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black border-t pt-2">
                                <span>Total</span>
                                <span className="text-green-700">${order['final-amount'].toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">Payment Method</h3>
                    <div className="text-sm">
                        <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                            {order['payment-method'] === 'card' ? '💳 Credit Card' : '💵 Cash'}
                        </span>
                        <span className="ml-3 text-gray-500">
                            Status: <span className={`font-bold ${order['payment-status'] === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                {order['payment-status']}
                            </span>
                        </span>
                    </div>
                </div>

                {/* What's Next */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            <span>You'll receive an email confirmation at <strong>{order['customer-email']}</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            <span>We'll notify you when your order is ready</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-green-600 mt-0.5" />
                            <span>
                                {order['fulfillment-type'] === 'delivery'
                                    ? 'Estimated delivery: 2-3 business days'
                                    : 'Ready for pickup in 1-2 hours'}
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Link
                        href="/shop"
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold text-center hover:bg-gray-200 transition"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        href="/shop/orders"
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold text-center hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        View All Orders
                        <ArrowRight size={20} />
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
