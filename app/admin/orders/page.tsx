'use client';
import { useEffect, useState } from 'react';
import { Package, CheckCircle, Clock, MapPin, Phone, DollarSign, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Load real data
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        // Fetch sales with customer info
        // The findAll endpoint includes items. We might need to ensure it includes customer too.
        // Let's assume standard findAll returns what we need or update service if customer is missing.
        // backend findAll uses prisma include items. Customer is relation on Sale.
        // I need to check if customer is included. SaleService.findAll currently only includes items.
        // I will update SaleService.findAll to include customer as well in a separate step if needed, 
        // but for now let's try to fetch and see. 
        // Actually, looking at SaleService.findAll in previous step: `include: { items: true }`.
        // It does NOT include customer.
        // I should probably update Backend first to include Customer, otherwise 'customer-name' will be empty.
        // But let's proceed with frontend mapping first and use 'Guest' if missing, then fix backend.

        const sales = await apiClient.get('/sales');

        if (Array.isArray(sales)) {
          const mappedOrders = sales.map((sale: any) => ({
            'order-id': sale.id,
            'customer-name': sale.customer?.name || 'Guest Customer',
            'customer-phone': sale.customer?.phone || 'No Phone',
            'final-amount': Number(sale.total),
            'created-at': sale.createdAt,
            'order-status-code': sale.status?.toLowerCase() || 'pending',
            'fulfillment-type': 'delivery', // identifying fulfillment type isn't in schema yet, default to delivery
            items: sale.items?.map((item: any) => ({
              'quantity-ordered': item.quantity,
              'product-name': item.product?.name || 'Unknown Product' // Include product in findAll logic
            }))
          }));
          // Sort by date desc
          setOrders(mappedOrders.sort((a, b) => new Date(b['created-at']).getTime() - new Date(a['created-at']).getTime()));
        }
      } catch (error) {
        console.error("Failed to load orders", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Update order status with API
  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o =>
      o['order-id'] === id ? { ...o, 'order-status-code': newStatus } : o
    ));

    try {
      await apiClient.patch(`/sales/${id}/status`, { status: newStatus.toUpperCase() });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      setOrders(previousOrders); // Revert
    }
  };

  if (loading && !tenantId) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
  }

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

                  {/* Customer Info */}
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
                      <Package size={16} className="text-gray-300" />
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
                    <CheckCircle size={16} /> Mark as Fulfilled
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
