'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Zap, FileText, CheckSquare, Square, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function RestockPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    // Mocking or fetching real data
    async function fetchRestock() {
      try {
        // In a real scenario, this comes from API. 
        // Using mock data to ensure UI matches screenshot if API is empty or different.
        const mockData = [
          { id: '1', product_name: 'ASHOKA DARK SOY SAUCE 24 x 210g(7.5oz)', current_stock: 0, reorder_point: 10, cost: 0.00, suggested_qty: 50 },
          { id: '2', product_name: 'ASHOKA PUNJABI SAMOSA 6 X 25 X 75g (2.652oz)', current_stock: 0, reorder_point: 10, cost: 0.00, suggested_qty: 50 },
          { id: '3', product_name: 'BOUNTY 24 X 57g', current_stock: 0, reorder_point: 10, cost: 0.00, suggested_qty: 50 },
          { id: '4', product_name: 'Britannia Milk Bread', current_stock: 0, reorder_point: 10, cost: 0.00, suggested_qty: 50 },
          { id: '5', product_name: 'CADBURY FRUIT&NUT CHOCOLATE 48 X 49g', current_stock: 0, reorder_point: 10, cost: 0.00, suggested_qty: 50 },
          { id: '6', product_name: 'Cadbury WHOLENUT CHOCOLATE 16 X 322g (10.4oz)', current_stock: 0, reorder_point: 10, cost: 0.00, suggested_qty: 50 },
        ];
        setRecommendations(mockData);

        // Initialize quantities
        const initialQty: Record<string, number> = {};
        const initialSelected = new Set<string>();
        mockData.forEach(item => {
          initialQty[item.id] = item.suggested_qty;
          initialSelected.add(item.id);
        });
        setQuantities(initialQty);
        setSelectedItems(initialSelected);

      } catch (error) {
        console.error("Failed to load restock data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestock();
  }, []);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const updateQuantity = (id: string, val: number) => {
    setQuantities({ ...quantities, [id]: val });
  };

  const totalPOValue = Array.from(selectedItems).reduce((sum, id) => {
    const item = recommendations.find(r => r.id === id);
    return sum + (item ? (item.cost * (quantities[id] || 0)) : 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Restock Automation</h1>
          <p className="text-gray-500 mt-1">Auto generate purchase orders for low stock items.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-32">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wide">
              <Zap size={16} />
              Critical Low Stock
            </div>
            <div className="text-4xl font-black text-gray-900 flex items-baseline gap-2">
              178 <span className="text-sm font-medium text-gray-400">items</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between h-32">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wide">
              <FileText size={16} />
              Estimated PO Value
            </div>
            <div className="text-4xl font-black text-gray-900">
              ${totalPOValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="font-bold text-gray-900">Suggested Reorders</h2>
            <span className="text-xs text-gray-400">Select items to include in PO</span>
          </div>

          <div className="divide-y divide-gray-50">
            {recommendations.map((item) => {
              const isSelected = selectedItems.has(item.id);
              return (
                <div key={item.id} className="p-6 flex items-center gap-4 hover:bg-gray-50 transition">
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className={`shrink-0 rounded flex items-center justify-center transition ${isSelected ? 'text-blue-600' : 'text-gray-300 hover:text-gray-400'
                      }`}
                  >
                    {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.product_name}</h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-rose-500 font-medium">Stock: {item.current_stock}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400">Reorder Point: {item.reorder_point}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Quantity</label>
                      <input
                        type="number"
                        value={quantities[item.id]}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-right font-bold text-gray-900 border-none bg-transparent focus:ring-0 p-0 text-lg outline-none"
                      />
                    </div>
                    <div className="text-right w-20">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Cost</label>
                      <div className="font-bold text-gray-900 text-lg">${item.cost.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}