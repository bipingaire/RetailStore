'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Package, TrendingUp, AlertCircle, DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [inventory, orders, analytics] = await Promise.all([
          apiClient.getInventory({ low_stock: false }),
          apiClient.getOrders({}),
          apiClient.getInventoryHealth(),
        ]);

        setStats({
          totalProducts: inventory.length,
          lowStock: inventory.filter((i: any) => i.quantity_on_hand < 10).length,
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.order_status === 'pending').length,
          inventoryHealth: analytics,
        });
      } catch (error: any) {
        console.error('Error loading dashboard:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500', change: '+12%' },
    { title: 'Low Stock', value: stats.lowStock, icon: AlertCircle, color: 'bg-red-500', change: '-5%' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-500', change: '+23%' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Activity, color: 'bg-yellow-500', change: '+8%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your store performance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Inventory Health</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-900">Healthy Stock</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats.inventoryHealth?.healthy || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-900">Low Stock</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.inventoryHealth?.low || stats.lowStock}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-900">Out of Stock</span>
                <span className="text-2xl font-bold text-red-600">
                  {stats.inventoryHealth?.out_of_stock || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/inventory" className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition">
                <Package className="mx-auto mb-2 text-blue-600" size={32} />
                <span className="font-semibold text-blue-900">Inventory</span>
              </a>
              <a href="/admin/orders" className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition">
                <ShoppingCart className="mx-auto mb-2 text-green-600" size={32} />
                <span className="font-semibold text-green-900">Orders</span>
              </a>
              <a href="/admin/vendors" className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition">
                <Users className="mx-auto mb-2 text-purple-600" size={32} />
                <span className="font-semibold text-purple-900">Vendors</span>
              </a>
              <a href="/admin/invoices" className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition">
                <DollarSign className="mx-auto mb-2 text-orange-600" size={32} />
                <span className="font-semibold text-orange-900">Invoices</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}