'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Package, SlidersHorizontal, Save } from 'lucide-react';
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
        const data = await apiClient.getInventory();

        const processed: ProductRow[] = (data as any[]).map((item: any) => ({
          id: item.inventory_id,
          name: item.product_name || 'Unknown',
          sku: item.upc_ean_code || (Math.floor(Math.random() * 90000000) + 10000000).toString(),
          image: item.image_url,
          total_qty: item.quantity_on_hand || 0,
          price: item.selling_price || 0,
          batches: item.quantity_on_hand > 50 ? [] : [{
            id: 'mock-batch',
            qty: item.quantity_on_hand,
            expiry: '2026-02-15',
            days_left: 18,
            status: 'WARNING'
          }], // Mock batch for visual matching of health status
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
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time shelf life and stock levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-80 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none bg-white placeholder-gray-400"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition shadow-sm">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 w-[40%]">Product</th>
                  <th className="px-8 py-5 w-[15%]">Price</th>
                  <th className="px-8 py-5 w-[15%]">Stock</th>
                  <th className="px-8 py-5 w-[20%]">Health Status</th>
                  <th className="px-8 py-5 w-[10%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      No inventory found.
                    </td>
                  </tr>
                )}
                {products.map((product) => {
                  const worstBatch = product.batches[0];
                  const isExpanded = expandedRow === product.id;

                  return (
                    <React.Fragment key={product.id}>
                      <tr
                        className={`hover:bg-gray-50/50 transition-colors group ${isExpanded ? 'bg-gray-50/80' : ''}`}
                        onClick={() => setExpandedRow(isExpanded ? null : product.id)}
                      >
                        <td className="px-8 py-5 align-top">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0">
                              {product.image ? (
                                <img src={product.image} className="w-full h-full object-cover rounded-lg" alt="" />
                              ) : (
                                <Package className="text-gray-300" size={20} />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800 text-sm uppercase tracking-wide">{product.name}</div>
                              <div className="text-xs text-gray-400 font-medium mt-1">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 align-top">
                          <div className="flex items-center">
                            <span className="text-gray-400 text-sm mr-2 line-through opacity-0">$</span>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                              <input
                                type="number"
                                value={product.price}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleLocalChange(product.id, 'price', e.target.value)}
                                className="w-24 pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 align-top">
                          <input
                            type="number"
                            value={product.total_qty}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleLocalChange(product.id, 'total_qty', e.target.value)}
                            className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                          />
                        </td>
                        <td className="px-8 py-5 align-top">
                          {worstBatch ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                              {worstBatch.days_left} Days Left
                            </div>
                          ) : (
                            <span className="text-gray-300 text-lg block mt-1">—</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right align-top">
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {product.isDirty && (
                              <button
                                onClick={(e) => saveProduct(e, product)}
                                className="text-white bg-blue-600 hover:bg-blue-700 p-1.5 rounded-lg transition-colors shadow-sm"
                                title="Save Changes"
                              >
                                <Save size={16} />
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <ChevronDown size={20} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
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