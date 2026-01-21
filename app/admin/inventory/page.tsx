'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, Tag, Search, Package, SlidersHorizontal, Save } from 'lucide-react';
import PromotionModal from './promotion-modal';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

// Types
type ProductRow = {
  id: string;
  name: string;
  sku: string;
  image: string;
  total_qty: number;
  price: number;
  batches: Batch[];
  isDirty?: boolean;
};

type Batch = {
  id: string;
  qty: number;
  expiry: string;
  days_left: number;
  status: string;
};

export default function InventoryDashboard() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [promoTarget, setPromoTarget] = useState<{ product: ProductRow, batch?: Batch } | null>(null);

  // Fetch Data using FastAPI
  useEffect(() => {
    async function fetchData() {
      try {
        // Get inventory from FastAPI
        const data = await apiClient.getInventory();

        // Transform to match UI structure
        const processed: ProductRow[] = (data as any[]).map((item: any) => ({
          id: item.inventory_id,
          name: item.product_name || 'Unknown',
          sku: item.upc_ean_code || 'N/A',
          image: item.image_url,
          total_qty: item.quantity_on_hand || 0,
          price: item.selling_price || 0,
          batches: [], // TODO: Fetch batches if needed
        }));

        setProducts(processed);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching inventory:", err);
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
        toast.error('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const handleLocalChange = (id: string, field: 'price' | 'total_qty', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: numValue, isDirty: true };
      }
      return p;
    }));
  };

  const saveProduct = async (e: React.MouseEvent, product: ProductRow) => {
    e.stopPropagation();
    if (!product.isDirty) return;

    try {
      await apiClient.updateInventory(product.id, {
        quantity_on_hand: product.total_qty,
        selling_price: product.price,
      });

      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isDirty: false } : p));
      toast.success('Product updated successfully!');
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast.error(`Failed to update: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-sm text-gray-500">Real-time shelf life and stock levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading inventory data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-700 font-bold mb-2 flex items-center justify-center gap-2">
              <AlertCircle size={20} /> Unable to Load Data
            </div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Health Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={32} className="text-gray-300" />
                        <span>No inventory found. Try scanning an invoice.</span>
                      </div>
                    </td>
                  </tr>
                )}
                {products.map((product) => {
                  const worstBatch = product.batches[0];
                  const isExpanded = expandedRow === product.id;

                  return (
                    <React.Fragment key={product.id}>
                      <tr
                        className={`hover:bg-gray-50 transition-colors cursor-pointer group ${isExpanded ? 'bg-gray-50' : ''}`}
                        onClick={() => setExpandedRow(isExpanded ? null : product.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200 shrink-0 overflow-hidden">
                              {product.image ? <img src={product.image} className="w-full h-full object-cover" alt="prod" /> : <Package size={18} />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500 font-mono mt-0.5">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-sm">$</span>
                            <input
                              type="number"
                              value={product.price}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleLocalChange(product.id, 'price', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={product.total_qty}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleLocalChange(product.id, 'total_qty', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {worstBatch ? (
                            <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 ${getStatusColor(worstBatch.status)}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${worstBatch.days_left < 7 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              {worstBatch.days_left} Days Left
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {product.isDirty && (
                            <button
                              onClick={(e) => saveProduct(e, product)}
                              className="mr-3 text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                              title="Save Changes"
                            >
                              <Save size={18} />
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {promoTarget && (
          <PromotionModal
            product={promoTarget.product}
            batch={promoTarget.batch}
            onClose={() => setPromoTarget(null)}
          />
        )}

      </div>
    </div>
  );
}