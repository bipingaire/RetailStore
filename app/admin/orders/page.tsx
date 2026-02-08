'use client';
import { useEffect, useState } from 'react';
import { Package, CheckCircle, Clock, MapPin, Phone, DollarSign, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderManager() {
  // Supabase removed - refactor needed
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // 1. Resolve Tenant
  useEffect(() => {
    async function resolveTenant() {
      const { data: { user } } = // await // supabase.auth.getUser();
      console.log('debug: verify user', user); // Debug Log
      if (!user) return;

      let resolvedTenantId: string | null = null;

      // 1. Try Role
      const { data: roleData } = await supabase
        .from('tenant-user-role')
        .select('tenant-id')
        .eq('user-id', user.id)
        .maybeSingle();

      console.log('debug: role data', roleData); // Debug Log

      if (roleData) {
        resolvedTenantId = roleData['tenant-id'];
      } else {
        // ... subdomain logic ...
      }

      console.log('debug: resolved tenant id', resolvedTenantId); // Debug Log
      setTenantId(resolvedTenantId);

      // If no tenant is found, stop loading
      if (!resolvedTenantId) {
        setLoading(false);
        console.warn('Orders: No active tenant found. Stopping loader.');
      }
    }
    resolveTenant();
  }, []);

  // 2. Fetch Orders
  const fetchOrders = async () => {
    console.log('debug: fetching orders for tenant', tenantId); // Debug Log
    if (!tenantId) return;

    try {
      const { data, error } = await supabase
        .from('customer-order-header')
        // ... select ...
        .select(`
          *,
          invoice:customer-invoices!order-id (
             "invoice-number",
             "payment-status",
             status
          ),
          items:order-line-item-detail (
            quantity-ordered,
            product-name
          )
        `)
        .eq('tenant-id', tenantId)
        .order('order-date-time', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [tenantId]);

  // 3. Update Status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('customer-order-header')
        .update({ 'order-status-code': newStatus })
        .eq('order-id', id);

      if (error) throw error;
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading && !tenantId) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

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
          <div className="bg-white border border-green-200 px-3 py-1 rounded-full shadow-sm text-xs font-bold text-green-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live
          </div>
        </div>

        {/* ORDER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order['order-id']} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">

              {/* Header */}
              <div className={`px-5 py-4 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r ${order['order-status-code'] === 'pending' ? 'from-yellow-50 to-white' :
                order['order-status-code'] === 'confirmed' ? 'from-blue-50 to-white' :
                  'from-gray-50 to-white'
                }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${order['order-status-code'] === 'pending' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' :
                      order['order-status-code'] === 'completed' ? 'bg-green-100 border-green-200 text-green-800' :
                        'bg-gray-100 border-gray-200 text-gray-600'
                      }`}>
                      {order['order-status-code']}
                    </span>
                    <span className="font-mono text-xs text-gray-400">#{order['order-id'].slice(0, 4)}</span>
                  </div>

                  {/* Customer Info from embedded columns */}
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {order['customer-name'] || 'Guest Customer'}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={10} /> {order['customer-phone'] || 'No Phone'}
                    </div>
                  </div>

                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900">${order['final-amount']}</div>

                  {/* Invoice/Payment Info */}
                  {order.invoice && (
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-1 inline-block ${order.invoice['payment-status'] === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {order.invoice['payment-status'] === 'paid' ? 'PAID' : 'UNPAID'}
                    </div>
                  )}

                  <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-end gap-1 mt-1">
                    {order['fulfillment-type'] === 'delivery' ? <MapPin size={10} /> : <Package size={10} />} {order['fulfillment-type']}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-5 space-y-3 flex-1 overflow-y-auto max-h-64">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.inventory?.product?.['image-url'] ? (
                        <img src={item.inventory.product['image-url']} className="w-full h-full object-cover" alt="prod" />
                      ) : <Package size={16} className="text-gray-300" />}
                    </div>
                    <div className="text-sm leading-tight">
                      <span className="font-bold text-gray-900 mr-1">{item['quantity-ordered']}x</span>
                      <span className="text-gray-600">{item['product-name']}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                {order['order-status-code'] === 'pending' && (
                  <button
                    onClick={() => updateStatus(order['order-id'], 'confirmed')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <CheckCircle size={16} /> Confirm Order
                  </button>
                )}
                {order['order-status-code'] === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(order['order-id'], 'delivered')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Package size={16} /> Mark Delivered
                  </button>
                )}
                {order['order-status-code'] === 'delivered' && (
                  <button
                    onClick={() => updateStatus(order['order-id'], 'completed')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <DollarSign size={16} /> Complete
                  </button>
                )}
                {order['order-status-code'] === 'completed' && (
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
              <h3 className="text-gray-900 font-bold mb-1">No Orders Found</h3>
              <p className="text-gray-500 text-sm">Checked for tenant: {tenantId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
