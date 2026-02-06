'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, CheckCircle, Clock, MapPin, Phone, DollarSign, Loader2, ShoppingBag } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
  id: string;
  customer_phone: string;
  fulfillment_method: 'pickup' | 'delivery';
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    qty: number;
    store_inventory: {
      global_products: { name: string; image_url: string; }
    }
  }[];
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('customer-order-header')
      .select(`
        id:order-id,
        customer_phone:customer-phone,
        fulfillment_method:fulfillment-type,
        payment_method:payment-method,
        total_amount:final-amount,
        status:order-status-code,
        created_at,
        items:customer-order-line-item (
          qty:quantity-sold,
          product:retail-store-inventory-item (
            global_products:global-product-master-catalog!global-product-id ( name:product-name, image_url:image-url )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      // Map new schema back to UI expected structure to minimize UI rewrite
      const mappedOrders = data.map((o: any) => ({
        id: o.id,
        customer_phone: o.customer_phone,
        fulfillment_method: o.fulfillment_method,
        payment_method: o.payment_method,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
        order_items: o.items.map((i: any) => ({
          qty: i.qty,
          store_inventory: {
            global_products: i.product?.global_products || { name: 'Unknown', image_url: '' }
          }
        }))
      }));
      setOrders(mappedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('customer-order-header').update({ 'order-status-code': newStatus }).eq('order-id', id);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="text-blue-600" />
              Order Fulfillment
            </h1>
            <p className="text-sm text-gray-500">Manage incoming customer orders.</p>
          </div>
          <div className="bg-white border border-green-200 px-3 py-1 rounded-full shadow-sm text-xs font-bold text-green-700 flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live
          </div>
        </div>

        {/* ORDER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

              {/* Header */}
              <div className={`px-5 py-4 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r ${order.status === 'pending' ? 'from-yellow-50 to-white' : order.status === 'ready' ? 'from-blue-50 to-white' : 'from-gray-50 to-white'}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${order.status === 'pending' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' :
                      order.status === 'ready' ? 'bg-blue-100 border-blue-200 text-blue-800' :
                        'bg-gray-100 border-gray-200 text-gray-600'
                      }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 4)}</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Phone size={12} className="text-gray-400" /> {order.customer_phone || 'Guest Checkout'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900">${order.total_amount}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-end gap-1">
                    {order.fulfillment_method === 'delivery' ? <MapPin size={10} /> : <Package size={10} />} {order.fulfillment_method}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 space-y-3 flex-1 overflow-y-auto max-h-64">
                {order.order_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 shrink-0 overflow-hidden">
                      <img src={item.store_inventory.global_products.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm leading-tight">
                      <span className="font-bold text-gray-900 mr-1">{item.qty}x</span>
                      <span className="text-gray-600">{item.store_inventory.global_products.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(order.id, 'ready')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Package size={16} /> Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateStatus(order.id, 'completed')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <DollarSign size={16} /> Mark Paid & Complete
                  </button>
                )}
                {order.status === 'completed' && (
                  <div className="text-center text-xs font-bold text-gray-400 uppercase py-2 flex items-center justify-center gap-2">
                    <CheckCircle size={14} /> Order Fulfilled
                  </div>
                )}
              </div>

            </div>
          ))}
          {orders.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Clock size={32} />
              </div>
              <h3 className="text-gray-900 font-bold mb-1">No Active Orders</h3>
              <p className="text-gray-500 text-sm">Waiting for new orders to arrive.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}