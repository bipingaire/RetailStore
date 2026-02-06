'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Gift, Clock, ChevronRight, LogOut, QrCode, Star, ShoppingBag } from 'lucide-react';


// Mock User for MVP (In real app, use supabase.auth.user())
const MOCK_USER = {
  id: 'user-123',
  name: 'Alex Shopper',
  phone: '555-0101',
  points: 1250,
  tier: 'Gold Member'
};

type OrderHistory = {
  id: string;
  total_amount: number;
  created_at: string;
  status: string;
  item_count: number;
};

export default function ProfilePage() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      // Fetch orders for this phone number
      // Fetch orders for this phone number
      const { data } = await supabase
        .from('customer-order-header')
        .select('id:order-id, total_amount:final-amount, created_at, status:order-status-code, items:customer-order-line-item(count)')
        .eq('customer-phone', MOCK_USER.phone)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data.map((o: any) => ({
          id: o.id,
          total_amount: o.total_amount,
          created_at: o.created_at,
          status: o.status,
          item_count: o.items[0]?.count || 0
        })));
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const qrValue = `CUST:${MOCK_USER.phone}`; // Simple format for POS scanner

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">

      {/* 1. IDENTITY CARD */}
      <div className="bg-white p-6 pb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-2xl"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {MOCK_USER.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{MOCK_USER.name}</h1>
            <p className="text-sm text-gray-500">{MOCK_USER.phone}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">{MOCK_USER.tier}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOYALTY WALLET */}
      <div className="px-4 -mt-8 relative z-20">
        <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl shadow-blue-900/20 overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <QrCode size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs text-gray-400 uppercase font-bold mb-1">Available Points</div>
                <div className="text-4xl font-black tracking-tight">{MOCK_USER.points.toLocaleString()}</div>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Gift size={24} className="text-yellow-400" />
              </div>
            </div>

            {/* The Scan Code */}
            <div className="bg-white p-3 rounded-xl flex items-center gap-4">
              {/* QR Generation via API for simplicity */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}`}
                alt="Member QR"
                className="w-16 h-16"
              />
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-bold uppercase">Scan at Register</div>
                <div className="text-gray-900 text-xs mt-1">Show this code to cashier to earn points or redeem rewards.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENU ACTIONS */}
      <div className="px-4 mt-6">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Account</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <span className="font-medium text-gray-700">My Orders</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Gift size={20} />
              </div>
              <span className="font-medium text-gray-700">Rewards Catalog</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <LogOut size={20} />
              </div>
              <span className="font-medium text-gray-700">Sign Out</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. RECENT HISTORY */}
      <div className="px-4 mt-8">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Order History</h3>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs">Loading history...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
            No orders yet. Start shopping!
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Order #{order.id.slice(0, 4)}</div>
                    <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">${order.total_amount.toFixed(2)}</div>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}