'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag,
  Calendar,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

type Order = {
  'order-id': string;
  'order-date-time': string;
  'final-amount': number;
  'order-status-code': OrderStatus;
  'payment-status': string;
  'fulfillment-type': string;
  'customer-name': string;
  items: {
    'product-name': string;
    'quantity-ordered': number;
    'total-amount': number;
    inventory: {
      product: {
        'image-url'?: string;
      };
    };
  }[];
  invoice: {
    'invoice-number': string;
  }[];
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  // Supabase removed - refactor needed

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data: { user } } = // await // supabase.auth.getUser();

    console.log('🔍 Current logged-in user:', user?.id);
    console.log('🔍 User email:', user?.email);

    if (!user) {
      router.push('/shop/login');
      return;
    }

    const { data, error } = await supabase
      .from('customer-order-header')
      .select(`
        *,
        items:order-line-item-detail (
          product-name,
          quantity-ordered,
          total-amount,
          inventory:retail-store-inventory-item (
            product:global-product-master-catalog (
              image-url
            )
          )
        ),
        invoice:customer-invoices!order-id (
          invoice-number
        )
      `)
      .eq('customer-id', user.id)
      .order('order-date-time', { ascending: false });

    console.log('📦 Query response:', { data, error });
    console.log('📊 Number of orders found:', data?.length || 0);

    if (error) {
      console.error('❌ Error loading orders:', error);
      toast.error(`Failed to load orders: ${error.message}`);
    } else {
      console.log('✅ Orders loaded successfully:', data);
      setOrders(data || []);
    }

    setLoading(false);
  }

  async function cancelOrder(orderId: string) {
    setCancelling(orderId);

    const { error } = await supabase
      .from('customer-order-header')
      .update({ 'order-status-code': 'cancelled' })
      .eq('order-id', orderId);

    if (error) {
      toast.error('Failed to cancel order');
      console.error(error);
    } else {
      toast.success('Order cancelled successfully');
      loadOrders(); // Refresh the list
    }

    setCancelling(null);
  }

  const canCancelOrder = (status: OrderStatus) => {
    return status === 'pending' || status === 'confirmed';
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-600" size={18} />;
      case 'confirmed': return <CheckCircle2 className="text-blue-600" size={18} />;
      case 'processing': return <Package className="text-indigo-600" size={18} />;
      case 'packed': return <ShoppingBag className="text-purple-600" size={18} />;
      case 'shipped': return <Truck className="text-orange-600" size={18} />;
      case 'delivered': return <CheckCircle2 className="text-green-600" size={18} />;
      case 'cancelled': return <XCircle className="text-red-600" size={18} />;
      default: return <Package className="text-gray-600" size={18} />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'packed': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'shipped': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o['order-status-code'] === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View and manage your purchase history</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors ${filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status === 'all' ? 'All Orders' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "You haven't placed any orders yet"
                : `No ${filter} orders found`}
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order['order-id'];
              const isCancellable = canCancelOrder(order['order-status-code']);

              return (
                <div
                  key={order['order-id']}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order['order-id'])}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-gray-500 font-mono">
                            #{order['order-id'].slice(0, 8)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(order['order-status-code'])}`}>
                            {getStatusIcon(order['order-status-code'])}
                            {order['order-status-code'].toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            {new Date(order['order-date-time']).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Package size={16} />
                            {order.items?.length || 0} item(s)
                          </div>
                          <div className="flex items-center gap-2 font-semibold text-gray-900">
                            <DollarSign size={16} />
                            ${order['final-amount']?.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCancellable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to cancel this order?')) {
                                cancelOrder(order['order-id']);
                              }
                            }}
                            disabled={cancelling === order['order-id']}
                            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {cancelling === order['order-id'] ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <XCircle size={16} />
                                Cancel Order
                              </>
                            )}
                          </button>
                        )}

                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50/50">
                      <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.inventory?.product?.['image-url'] ? (
                                <img
                                  src={item.inventory.product['image-url']}
                                  alt={item['product-name']}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{item['product-name']}</div>
                              <div className="text-sm text-gray-500">Quantity: {item['quantity-ordered']}</div>
                            </div>
                            <div className="font-bold text-gray-900">
                              ${item['total-amount']?.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Info */}
                      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Payment Status:</span>
                          <span className="font-semibold text-gray-900 ml-2 capitalize">
                            {order['payment-status']}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fulfillment:</span>
                          <span className="font-semibold text-gray-900 ml-2 capitalize">
                            {order['fulfillment-type']}
                          </span>
                        </div>
                        {order.invoice?.[0]?.['invoice-number'] && (
                          <div>
                            <span className="text-gray-500">Invoice:</span>
                            <span className="font-mono text-gray-900 ml-2">
                              {order.invoice[0]['invoice-number']}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isCancellable && order['order-status-code'] !== 'cancelled' && order['order-status-code'] !== 'delivered' && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                          <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800">
                            This order is being processed and cannot be cancelled. Please contact support if you need assistance.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
