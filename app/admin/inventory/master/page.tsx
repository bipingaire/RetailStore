'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Package, Search, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function MasterInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiClient.getProducts({ limit: 100 });
        setProducts(data as any[]);
      } catch (error) {
        toast.error('Failed to load global catalog');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Global Catalog</h1>
            <p className="text-gray-500 mt-1">Browse and import products from master catalog</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search global database..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50">
              <Filter size={18} />
              Filters
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Brand</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">UPC/EAN</th>
                <th className="px-6 py-4 text-right font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.product_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {p.image_url ? (
                          <img src={p.image_url} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package size={20} className="text-gray-400" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{p.product_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.brand_name}</td>
                  <td className="px-6 py-4 text-gray-600">{p.category_name}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{p.upc_ean_code}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-1 ml-auto">
                      <Plus size={16} />
                      Import
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
