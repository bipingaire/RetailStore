'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ShoppingCart, Upload, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function RestockPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestock() {
      try {
        const data = await apiClient.getRestockRecommendations();
        setRecommendations(data);
      } catch (error) {
        // Fallback or empty state
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRestock();
  }, []);

  const generatePO = async (item: any) => {
    try {
      await apiClient.generatePO(item.vendor_id, [{
        product_id: item.product_id,
        quantity: item.suggested_quantity
      }]);
      toast.success('Purchase Order generated');
    } catch (e) {
      toast.error('Failed to generate PO');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Restock Recommendations</h1>

      <div className="grid gap-6">
        {recommendations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
            <Check className="mx-auto mb-4 text-green-500" size={48} />
            <h3 className="font-bold text-lg">Inventory Healthy</h3>
            <p className="text-gray-500">No restock needed at this time.</p>
          </div>
        ) : recommendations.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{item.product_name}</h3>
                <p className="text-sm text-gray-500">
                  Current: <span className="text-red-600 font-bold">{item.current_stock}</span> /
                  Recommended: <span className="text-green-600 font-bold">{item.suggested_quantity}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => generatePO(item)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Order Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}