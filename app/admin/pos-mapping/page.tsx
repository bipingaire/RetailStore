'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Settings2, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function POSMappingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const inventory = await apiClient.getInventory();
        setProducts(inventory);
      } catch (error) {
        toast.error('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">POS Mapping</h1>
          <p className="text-gray-500 mt-1">Link global products to POS machine codes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-700">Product Name</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">UPC/EAN</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700">POS Code</th>
                <th className="px-6 py-4 text-right font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.inventory_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{p.product_name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">{p.upc_ean_code}</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Enter POS Code"
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded transition">
                      <Save size={18} />
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