'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Search, Globe, Edit, Trash2, CheckCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'local' | 'global';

export default function MasterInventoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('local');
  const [localInventory, setLocalInventory] = useState<any[]>([]);
  const [globalCatalog, setGlobalCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [viewMode]);

  async function loadData() {
    setLoading(true);
    try {
      if (viewMode === 'local') {
        const data = await apiClient.getInventory();
        setLocalInventory(data || []);
      } else {
        const data = await apiClient.getProducts({ limit: 20 });
        setGlobalCatalog(data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Master Inventory Ledger</h1>
            </div>
            <p className="text-gray-500 text-sm">Manage your store products and browse global catalog.</p>
          </div>

          <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setViewMode('local')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${viewMode === 'local'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              My Inventory
            </button>
            <div className="w-px bg-gray-200 my-2"></div>
            <button
              onClick={() => setViewMode('global')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${viewMode === 'global'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100' // Visual fix: typically active state has background
                  : 'text-gray-500 hover:text-gray-900'
                }`}
              // Adjusted based on screenshot: Global Catalog button has specific style
              style={viewMode === 'global' ? {} : {}}
            >
              <Globe size={16} />
              Global Catalog
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={viewMode === 'local' ? "Search name or SKU..." : "Search global catalog..."}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wide">Product</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wide">Category</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wide">Manufacturer</th>
                {viewMode === 'local' && (
                  <>
                    <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wide">Price</th>
                    <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wide">Stock</th>
                  </>
                )}
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wide text-right">
                  {viewMode === 'local' ? 'Actions' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              )}

              {!loading && viewMode === 'local' && localInventory.map((item: any) => (
                <tr key={item.inventory_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} className="w-full h-full object-cover rounded-lg" />
                        ) : <Package className="text-gray-300" size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{item.product_name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{item.upc_ean_code || 'No SKU'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{item.category_name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-gray-500">{item.manufacturer || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${item.selling_price?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{item.quantity_on_hand || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-blue-500 hover:text-blue-700 transition p-1 rounded-md hover:bg-blue-50">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-400 hover:text-red-600 transition p-1 rounded-md hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && viewMode === 'global' && globalCatalog.map((item: any) => (
                <tr key={item.product_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center border border-gray-100 flex-shrink-0">
                        <span className="text-[10px] font-bold text-gray-400">IMG</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{item.product_name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{item.upc_ean_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs uppercase font-bold tracking-wider">
                    {/* Example mapping, or empty if column needed but no data */}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {/* Manufacturer */}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-green-600 font-bold text-xs uppercase tracking-wide">
                      <CheckCircle size={14} />
                      In Store
                    </div>
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
