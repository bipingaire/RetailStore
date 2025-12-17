'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, CheckCircle, Clock, MapPin, Phone, DollarSign } from 'lucide-react';

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

  // 1. Live Fetching
  const fetchOrders = async () => {
    // In real app: use Supabase Realtime Subscription for instant updates
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          qty,
          store_inventory ( global_products ( name, image_url ) )
        )
      `)
      .order('created_at', { ascending: false }); // Newest first

    if (data) setOrders(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  // 2. Status Actions
  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders(); // Refresh UI
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'ready': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'completed': return 'bg-green-100 border-green-300 text-green-800 opacity-60';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="text-blue-600" />
          Active Orders
        </h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow text-sm font-bold text-green-600">
          ● Live Updates On
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden ${order.status === 'pending' ? 'border-l-yellow-400' : 'border-l-blue-500'}`}>
            
            {/* Card Header */}
            <div className="p-4 border-b flex justify-between items-start bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">#{order.id.slice(0,4)}</span>
                </div>
                <div className="font-bold text-lg flex items-center gap-2">
                  <Phone size={14} className="text-gray-400"/> {order.customer_phone || 'Guest'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black">${order.total_amount}</div>
                <div className="text-xs text-gray-500 uppercase flex items-center justify-end gap-1">
                  {order.fulfillment_method === 'delivery' ? <MapPin size={10}/> : <Package size={10}/>}
                  {order.fulfillment_method}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {order.order_items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded shrink-0 overflow-hidden">
                    <img src={item.store_inventory.global_products.image_url} className="w-full h-full object-cover"/>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold mr-2">{item.qty}x</span>
                    <span className="text-gray-700">{item.store_inventory.global_products.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Footer */}
            <div className="p-3 bg-gray-50 border-t flex gap-2">
              {order.status === 'pending' && (
                <button 
                  onClick={() => updateStatus(order.id, 'ready')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Package size={18} /> Mark Ready
                </button>
              )}
              
              {order.status === 'ready' && (
                <button 
                  onClick={() => updateStatus(order.id, 'completed')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <DollarSign size={18} /> Payment Received
                </button>
              )}

              {order.status === 'completed' && (
                 <div className="w-full text-center text-gray-400 text-sm font-bold py-2 flex items-center justify-center gap-2">
                   <CheckCircle size={16}/> Order Closed
                 </div>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && !loading && (
          <div className="col-span-full text-center py-20 text-gray-400">
            <div className="bg-white inline-block p-6 rounded-full mb-4 shadow-sm">
               <Clock size={40} />
            </div>
            <h3 className="text-xl font-bold">No Active Orders</h3>
            <p>Waiting for customers...</p>
          </div>
        )}
      </div>
    </div>
  );
}