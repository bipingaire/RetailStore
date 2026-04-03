'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Edit2, Save, X, Package, Trash2, LogOut, ShoppingBag, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import ShopFooter from '../components/shop-footer';

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    // Synchronously check auth FIRST before rendering anything
    const storedUser = localStorage.getItem('retail_user');
    const token = localStorage.getItem('retail_token');
    if (!storedUser || !token) {
      router.replace('/shop/login?redirect=/shop/account');
      return; // Don't setAuthChecked — keep page blank during redirect
    }
    setAuthChecked(true);
    loadUserData(storedUser);
  }, []);

  async function loadUserData(rawStoredUser?: string) {
    try {
      const raw = rawStoredUser ?? localStorage.getItem('retail_user');
      if (!raw) return;

      const parsedUser = JSON.parse(raw);
      setUser(parsedUser);

      setFormData({
        fullName: parsedUser.name || parsedUser.user_metadata?.full_name || '',
        phone: parsedUser.phone || '',
      });

      const ordersData = await apiClient.get(`/sales?customerId=${parsedUser.id}`);
      setOrders(ordersData || []);

    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    if (!user?.id) return;

    try {
      const updatedUser = await apiClient.put(`/customers/${user.id}`, {
        name: formData.fullName,
        phone: formData.phone,
      });

      const newUserData = { ...user, ...updatedUser };
      localStorage.setItem('retail_user', JSON.stringify(newUserData));
      setUser(newUserData);

      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Update failed", error);
      alert('Failed to update profile. Please try again.');
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    alert('Please contact support to delete your account.');
  }

  async function handleLogout() {
    localStorage.removeItem('retail_token');
    localStorage.removeItem('retail_user');
    document.cookie = 'retail_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/shop');
  }

  // Return null (blank page) until auth is confirmed — prevents flash of account UI
  if (!authChecked) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-400 font-medium">Loading Account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 group">
            <div className="bg-green-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Indu<span className="text-green-600">Mart</span></span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="/shop" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition">Return to Store</Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-12">
         <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-10">My Account</h1>
         
         <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
               <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm sticky top-28">
                  <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-xl shadow-inner">
                          {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 leading-tight truncate">{user?.user_metadata?.full_name || user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                  </div>
                  <nav className="p-3 space-y-1">
                     <button 
                        onClick={() => setActiveTab('orders')} 
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'orders' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                     >
                        <div className="flex items-center gap-3"><Package size={18} className={activeTab === 'orders' ? 'text-green-600' : ''}/> Order History</div>
                        <ChevronRight size={16} className={`transition-opacity ${activeTab === 'orders' ? 'opacity-100' : 'opacity-0'}`}/>
                     </button>
                     <button 
                        onClick={() => setActiveTab('profile')} 
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                     >
                        <div className="flex items-center gap-3"><User size={18} className={activeTab === 'profile' ? 'text-green-600' : ''}/> Profile Details</div>
                        <ChevronRight size={16} className={`transition-opacity ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0'}`}/>
                     </button>
                     
                     <div className="my-2 mx-3 border-t border-gray-100"></div>
                     
                     <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                     >
                        <div className="flex items-center gap-3"><LogOut size={18}/> Sign Out</div>
                     </button>
                  </nav>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
               
               {/* ---------------- ORDERS TAB ---------------- */}
               {activeTab === 'orders' && (
                 <div className="space-y-6">
                   <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                   
                   {orders.length === 0 ? (
                     <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                       <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <ShoppingBag className="text-gray-300" size={32} />
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2">No orders placed yet</h3>
                       <p className="text-gray-500 mb-6">Looks like you haven't made any purchases with us.</p>
                       <Link 
                         href="/shop"
                         className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
                       >
                         Start Shopping
                       </Link>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {orders.map((order) => (
                         <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                           {/* Order Header */}
                           <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <div className="text-sm font-bold text-gray-900 mb-1">
                                  Order #{order.saleNumber?.slice(0, 8) || order.id?.slice(0, 8)}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                  <Calendar size={14} />
                                  {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-black text-green-700">
                                  ${parseFloat(order.total || '0').toFixed(2)}
                                </div>
                              </div>
                           </div>
                           
                           {/* Order Body Details */}
                           <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {order.status === 'COMPLETED' ? <CheckCircle2 size={20}/> : <Package size={20}/>}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900">
                                    {order.status === 'COMPLETED' ? 'Delivered' : order.status}
                                  </div>
                                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">
                                    Payment: <span className="text-gray-900 font-bold">{(order.paymentMethod || 'CASH').replace(/_/g, ' ')}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 hover:underline"
                              >
                                {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                              </button>
                           </div>

                           {/* Expanded Order Items */}
                           {expandedOrderId === order.id && order.items && order.items.length > 0 && (
                             <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100">
                               <h4 className="text-sm font-bold text-gray-900 mb-4">Items Included</h4>
                               <ul className="space-y-4">
                                 {order.items.map((item: any, idx: number) => (
                                   <li key={idx} className="flex justify-between items-center text-sm">
                                     <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                           {item.product?.imageUrl ? (
                                             <img src={item.product.imageUrl} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                                           ) : (
                                             <Package size={20} className="text-gray-400" />
                                           )}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 line-clamp-1">{item.product?.name || `Product (ID: ${item.productId.slice(0,6)})`}</p>
                                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}</p>
                                        </div>
                                     </div>
                                     <div className="font-bold text-gray-900 whitespace-nowrap pl-4">
                                        ${parseFloat(item.subtotal || (item.quantity * item.unitPrice).toString()).toFixed(2)}
                                     </div>
                                   </li>
                                 ))}
                               </ul>
                               
                               <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                                 <div className="flex justify-between items-center text-sm">
                                   <span className="text-gray-500 font-medium">Subtotal</span>
                                   <span className="font-semibold text-gray-900">${parseFloat(order.subtotal || '0').toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                   <span className="text-gray-500 font-medium">Tax</span>
                                   <span className="font-semibold text-gray-900">${parseFloat(order.tax || '0').toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-base font-black text-gray-900 pt-2 border-t border-dashed border-gray-200 mt-2">
                                   <span>Total</span>
                                   <span>${parseFloat(order.total || '0').toFixed(2)}</span>
                                 </div>
                               </div>
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* ---------------- PROFILE TAB ---------------- */}
               {activeTab === 'profile' && (
                 <div className="space-y-6">
                   <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h2>
                   
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                     {!editing ? (
                       <div className="max-w-md">
                         <div className="space-y-6">
                           <div>
                             <p className="text-sm font-semibold text-gray-500 mb-1">Full Name</p>
                             <p className="text-lg font-bold text-gray-900">{user?.user_metadata?.full_name || user?.name || 'Not provided'}</p>
                           </div>
                           <div>
                             <p className="text-sm font-semibold text-gray-500 mb-1">Email Address</p>
                             <p className="text-lg font-bold text-gray-900">{user?.email}</p>
                           </div>
                           <div>
                             <p className="text-sm font-semibold text-gray-500 mb-1">Phone Number</p>
                             <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {formData.phone || <span className="text-gray-400 font-medium text-base italic">Not provided</span>}
                             </p>
                           </div>
                         </div>
                         
                         <button
                           onClick={() => setEditing(true)}
                           className="mt-8 flex items-center justify-center w-full sm:w-auto bg-white border-2 border-gray-200 text-gray-900 px-8 py-2.5 rounded-xl font-bold hover:border-gray-900 transition-colors gap-2"
                         >
                           <Edit2 size={16} /> Edit Profile
                         </button>
                       </div>
                     ) : (
                       <div className="max-w-md space-y-5 animate-in fade-in zoom-in duration-200">
                         <div>
                           <label className="text-sm font-bold text-gray-700 mb-1.5 block">Full Name</label>
                           <input
                             type="text"
                             value={formData.fullName}
                             onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                             className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
                             placeholder="Enter your full name"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-bold text-gray-700 mb-1.5 block">Email Address</label>
                           <input
                             type="email"
                             value={user?.email || ''}
                             disabled
                             className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 font-medium cursor-not-allowed"
                           />
                           <p className="text-xs text-gray-500 mt-1.5">Email address cannot be changed.</p>
                         </div>
                         <div>
                           <label className="text-sm font-bold text-gray-700 mb-1.5 block">Phone Number</label>
                           <input
                             type="tel"
                             value={formData.phone}
                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                             className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
                             placeholder="e.g. +1 234 567 8900"
                           />
                         </div>
                         
                         <div className="flex gap-3 pt-4">
                           <button
                             onClick={() => setEditing(false)}
                             className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                           >
                             Cancel
                           </button>
                           <button
                             onClick={handleUpdateProfile}
                             className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                           >
                             <Save size={18} /> Save Changes
                           </button>
                         </div>
                       </div>
                     )}

                     {/* Danger Zone */}
                     <div className="mt-12 pt-8 border-t border-gray-100">
                       <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
                       <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all of your data.</p>
                       <button
                         onClick={handleDeleteAccount}
                         className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm border border-red-100"
                       >
                         <Trash2 size={16} /> Delete Account
                       </button>
                     </div>
                   </div>
                 </div>
               )}
            </div>
         </div>
      </main>
      
      {/* Footer */}
      <div className="mt-auto">
        <ShopFooter />
      </div>
    </div>
  );
}
