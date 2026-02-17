'use client';
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, Tag, Search, Package, Filter, SlidersHorizontal, Edit3, Trash2 } from 'lucide-react';
import PromotionModal from './promotion-modal';
import EditProductModal from './edit-product-modal';
import { toast } from 'sonner';

// 1. Types
type ProductRow = {
  id: string; // store_inventory_id
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  image: string;
  total_qty: number;
  batches: Batch[];
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

  // State to manage the Promotion Pop-up
  const [promoTarget, setPromoTarget] = useState<{ product: ProductRow, batch?: Batch } | null>(null);

  // State for Editing
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSaveProduct = (updatedItem: any) => {
    // Refresh the list or update local state
    setProducts(prev => prev.map(p =>
      p.id === updatedItem.id ? {
        ...p,
        name: updatedItem.name,
        category: updatedItem.category,
        price: updatedItem.price,
        total_qty: updatedItem.total_qty
      } : p
    ));
    setEditingProduct(null);
  };

  // 2. Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.get('/products');

        // Backend returns mapped data, but we clarify shape here
        const processed: ProductRow[] = (data || []).map((item: any) => {
          const batches = (item.batches || []).map((b: any) => {
            const expiryDate = new Date(b.expiry);
            const today = new Date();
            const diffTime = expiryDate.getTime() - today.getTime();
            const days_left = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let status = 'GOOD';
            if (days_left <= 7) status = 'CRITICAL';
            else if (days_left <= 30) status = 'WARNING';

            return {
              id: b.id,
              qty: b.qty,
              expiry: b.expiry,
              days_left,
              status
            };
          }).sort((a: any, b: any) => a.days_left - b.days_left);

          return {
            id: item.id,
            name: item.name,
            sku: item.sku,
            category: item.category || 'Uncategorized',
            description: item.description || '',
            price: Number(item.price) || 0,
            image: item.image,
            total_qty: item.total_qty,
            batches: batches
          };
        });

        setProducts(processed);
        setError(null);
      } catch (err: any) {
        console.error("Exception fetching inventory:", err);
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 4. Helper for Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-green-50 text-green-700 border-green-200';
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
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Total Stock</th>
                  <th className="px-6 py-3">Health Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={32} className="text-gray-300" />
                        <span>No inventory found. Try scanning an invoice.</span>
                      </div>
                    </td>
                  </tr>
                )}
                {products.map((product) => {
                  const worstBatch = product.batches[0]; // The one expiring soonest
                  const isExpanded = expandedRow === product.id;

                  return (
                    <React.Fragment key={product.id}>
                      {/* MAIN ROW */}
                      <tr
                        key={product.id}
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
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm max-w-[150px] truncate" title={product.description}>
                          {product.description || '—'}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{product.total_qty}</span>
                              <span className="text-gray-400 text-xs">units</span>
                            </div>
                            {product.batches.length > 0 && (
                              <span className="text-[10px] text-gray-500">in {product.batches.length} batches</span>
                            )}
                          </div>
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
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingProduct(product); }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(product.id, product.name); }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* EXPANDED DETAILS (BATCH VIEW) */}
                      {isExpanded && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 ml-14">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                  <Package size={14} /> Stock Items (Batches)
                                </h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPromoTarget({ product }); // Promote entire product
                                  }}
                                  className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                                >
                                  + Create Store Offer
                                </button>
                              </div>

                              {product.batches.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No specific batch data available.</p>
                              ) : (
                                <div className="space-y-3">
                                  {product.batches.map((batch) => (
                                    <div key={batch.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors bg-gray-50/30">
                                      <div className="flex items-center gap-6">
                                        <div>
                                          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Quantity</span>
                                          <span className="font-mono font-semibold text-gray-900">{batch.qty}</span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Expiry Date</span>
                                          <span className={`text-sm font-medium ${batch.days_left < 7 ? 'text-red-600' : 'text-gray-700'}`}>
                                            {new Date(batch.expiry).toLocaleDateString()}
                                            <span className="text-gray-400 font-normal ml-1">({batch.days_left}d)</span>
                                          </span>
                                        </div>
                                      </div>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPromoTarget({ product, batch });
                                        }}
                                        className="mt-3 sm:mt-0 text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                                      >
                                        <Tag size={12} />
                                        {batch.status === 'CRITICAL' ? 'Clearance' : 'Promote'}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
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

        {/* EDIT MODAL RENDERED HERE */}
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
          />
        )}

      </div>
    </div>
  );
}