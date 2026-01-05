'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Edit2, Save, X, Package, Trash2, LogOut, ShoppingBag, Calendar } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/shop/login?redirect=/shop/account');
      return;
    }

    setUser(user);
    setFormData({
      fullName: user.user_metadata?.full_name || '',
      phone: user.user_metadata?.phone || '',
    });

    // Load purchase history
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', user.id)
      .order('order_date_time', { ascending: false });

    setOrders(orderData || []);
    setLoading(false);
  }

  async function handleUpdateProfile() {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: formData.fullName,
        phone: formData.phone,
      }
    });

    if (!error) {
      setEditing(false);
      loadUserData();
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    // Note: Supabase doesn't provide a direct delete user API from client
    // You would need to implement this via an admin API or edge function
    alert('Please contact support to delete your account.');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/shop');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">My Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl hover:bg-red-500/30 transition-all duration-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
                  <User className="text-white" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-purple-200">{user?.email}</p>
              </div>

              {!editing ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-white">
                      <Mail size={18} className="text-purple-300" />
                      <span>{user?.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex items-center gap-3 text-white">
                        <Phone size={18} className="text-purple-300" />
                        <span>{formData.phone}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-white font-semibold mb-2 block">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-white/20 border-2 border-white/30 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="text-white font-semibold mb-2 block">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/20 border-2 border-white/30 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-white/20 border border-white/30 text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save
                    </button>
                  </div>
                </>
              )}

              {/* Danger Zone */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-red-200 font-semibold mb-3">Danger Zone</h3>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-500/20 border border-red-400/50 text-red-200 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="text-purple-300" size={28} />
                <h2 className="text-2xl font-bold text-white">Purchase History</h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="mx-auto text-purple-300/50 mb-4" size={64} />
                  <p className="text-purple-200 text-lg">No orders yet</p>
                  <button
                    onClick={() => router.push('/shop')}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-white font-bold text-lg mb-1">
                            Order #{order.order_id.slice(0, 8)}
                          </div>
                          <div className="flex items-center gap-2 text-purple-200 text-sm">
                            <Calendar size={14} />
                            {new Date(order.order_date_time).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-white">
                            ${order.final_amount?.toFixed(2)}
                          </div>
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${order.order_status === 'delivered' ? 'bg-green-500/20 text-green-300' :
                              order.order_status === 'shipped' ? 'bg-blue-500/20 text-blue-300' :
                                order.order_status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                            }`}>
                            {order.order_status}
                          </div>
                        </div>
                      </div>

                      <div className="text-purple-200 text-sm">
                        Payment: <span className="text-white font-semibold">{order.payment_status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
