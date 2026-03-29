'use client';
import { useEffect, useState } from 'react';
import {
  Package, CheckCircle, Clock, MapPin, Phone,
  Loader2, ShoppingBag, CreditCard, Banknote,
  ChevronDown, RefreshCw, XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'ready', 'delivered', 'completed'];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 border-yellow-200 text-yellow-800',
  confirmed: 'bg-blue-100 border-blue-200 text-blue-800',
  processing: 'bg-indigo-100 border-indigo-200 text-indigo-800',
  ready: 'bg-purple-100 border-purple-200 text-purple-800',
  delivered: 'bg-cyan-100 border-cyan-200 text-cyan-800',
  completed: 'bg-green-100 border-green-200 text-green-800',
  cancelled: 'bg-red-100 border-red-200 text-red-800',
};

const NEXT_ACTION: Record<string, { label: string; next: string; color: string }> = {
  pending: { label: '✓ Mark Fulfilled', next: 'completed', color: 'bg-green-600 hover:bg-green-700' },
  confirmed: { label: '✓ Mark Fulfilled', next: 'completed', color: 'bg-green-600 hover:bg-green-700' },
  processing: { label: '✓ Mark Fulfilled', next: 'completed', color: 'bg-green-600 hover:bg-green-700' },
  ready: { label: '✓ Mark Fulfilled', next: 'completed', color: 'bg-green-600 hover:bg-green-700' },
  delivered: { label: '✓ Mark Fulfilled', next: 'completed', color: 'bg-green-600 hover:bg-green-700' },
};

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const sales = await apiClient.get('/sales');
      if (Array.isArray(sales)) {
        const mapped = sales.map((sale: any) => ({
          id: sale.id,
          id: sale.id,
          customerName: sale.customer?.name || sale.guestName || 'Guest Customer',
          customerEmail: sale.customer?.email || sale.guestEmail || '',
          customerPhone: sale.customer?.phone || sale.guestPhone || '—',
          total: Number(sale.total),
          createdAt: sale.createdAt,
          status: (sale.status || 'PENDING').toLowerCase(),
          paymentMethod: (sale.paymentMethod || 'cash').toLowerCase(),
          paymentStatus: (sale.paymentStatus || 'pending').toLowerCase(),
          items: (sale.items || []).map((item: any) => ({
            qty: item.quantity,
            name: item.product?.name || item.productName || 'Unknown Product',
            price: Number(item.unitPrice || 0),
          })),
        }));
        setOrders(mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      await apiClient.patch(`/sales/${id}/status`, { status: newStatus.toUpperCase() });
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update order status');
      fetchOrders(true); // Revert to real data
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePaymentStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus: newStatus } : o));
    try {
      await apiClient.patch(`/sales/${id}/payment-status`, { paymentStatus: newStatus.toUpperCase() });
      toast.success(`Payment marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update payment status');
      fetchOrders(true); // Revert to real data
    } finally {
      setUpdatingId(null);
    }
  };


  const cancelOrder = async (id: string) => {
    if (!confirm('Cancel this order?')) return;
    await updateStatus(id, 'cancelled');
  };

  const visibleOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="text-blue-600" /> Order Fulfillment
            </h1>
            <p className="text-sm text-gray-500">{orders.length} total orders · auto-refreshes every 30s</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOrders(true)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Refresh now"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <div className="bg-white border border-green-200 px-3 py-1 rounded-full shadow-sm text-xs font-bold text-green-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
            </div>
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'processing', 'ready', 'delivered', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterStatus === s
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
            >
              {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== 'all' && counts[s] ? ` (${counts[s]})` : ''}
              {s === 'all' ? ` (${orders.length})` : ''}
            </button>
          ))}
        </div>

        {/* ORDER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleOrders.map((order) => {
            const action = NEXT_ACTION[order.status];
            const isUpdating = updatingId === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">

                {/* Card Header */}
                <div className={`px-5 py-3 flex justify-between items-start bg-gradient-to-r ${
                  order.status === 'completed' ? 'from-green-50' :
                  order.status === 'pending' ? 'from-yellow-50' :
                  order.status === 'cancelled' ? 'from-red-50' : 'from-blue-50'
                } to-white border-b border-gray-100`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                        {order.status}
                      </span>
                      <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 6)}</span>
                    </div>
                    <div className="font-bold text-gray-900 line-clamp-1" title={order.customerName}>{order.customerName}</div>
                    {order.customerEmail && (
                      <div className="text-xs text-gray-500 line-clamp-1" title={order.customerEmail}>
                        {order.customerEmail}
                      </div>
                    )}
                    {order.customerPhone !== '—' && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {order.customerPhone}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900">${order.total.toFixed(2)}</div>
                    <div className="flex flex-col items-end gap-1 mt-1">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 justify-end">
                        {order.paymentMethod === 'cash' ? <Banknote size={10} /> : <CreditCard size={10} />}
                        {order.paymentMethod}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {order.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                      </span>
                    </div>
                  </div>
                </div>


                {/* Items */}
                <div className="p-4 space-y-1.5 flex-1 overflow-y-auto max-h-48">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-100 rounded text-[10px] font-bold flex items-center justify-center text-gray-600">{item.qty}</span>
                        <span className="text-gray-700 line-clamp-1">{item.name}</span>
                      </div>
                      <span className="text-gray-500 font-mono text-xs shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-2">
                  {order.paymentMethod === 'cash' && order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updatePaymentStatus(order.id, 'PAID')}
                      disabled={isUpdating}
                      className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors border border-emerald-200"
                    >
                      {isUpdating && <Loader2 size={12} className="animate-spin" />}
                      {!isUpdating && <Banknote size={12} />}
                      Payment Done
                    </button>
                  )}

                  {order.status !== 'completed' && order.status !== 'cancelled' && action ? (
                    <button
                      onClick={() => updateStatus(order.id, action.next)}
                      disabled={isUpdating}
                      className={`w-full ${action.color} disabled:bg-gray-300 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors`}
                    >
                      {isUpdating
                        ? <><Loader2 size={14} className="animate-spin" /> Updating...</>
                        : <><CheckCircle size={14} /> {action.label}</>}
                    </button>
                  ) : order.status === 'completed' ? (
                    <div className="text-center text-xs font-bold text-green-600 flex items-center justify-center gap-1.5 py-2">
                      <CheckCircle size={14} /> Order Fulfilled
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-red-500 py-2">Cancelled</div>
                  )}

                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="w-full text-xs text-gray-400 hover:text-red-600 flex items-center justify-center gap-1 transition-colors py-1"
                    >
                      <XCircle size={12} /> Cancel Order
                    </button>
                  )}
                </div>


              </div>
            );
          })}

          {visibleOrders.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Clock className="mx-auto text-gray-300 mb-4" size={40} />
              <h3 className="text-gray-500 font-semibold">No {filterStatus === 'all' ? '' : filterStatus} orders</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
