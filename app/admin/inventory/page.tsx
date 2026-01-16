'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, Tag, Search, Package, Filter, SlidersHorizontal } from 'lucide-react';
import PromotionModal from './promotion-modal';

const supabase = createClientComponentClient();

// 1. Types
type ProductRow = {
  id: string; // store_inventory_id
  name: string;
  sku: string;
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

  // 2. Fetch Data (The Complex Join)
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get Me (Tenant ID)
        const { data: roleData } = await supabase
          .from('tenant-user-role')
          .select('tenant-id')
          .eq('user-id', user.id)
          .single();

        const myTenantId = roleData ? (roleData as any)['tenant-id'] : null;

        const { data, error } = await supabase
          .from('retail-store-inventory-item')
          .select(`
            inventory-id,
            tenant-id,
            selling-price-amount,
            current-stock-quantity,
            global-product-master-catalog!global-product-id (
              product-name,
              upc-ean-code,
              image-url
            ),
            inventory-batch-tracking-record!inventory-id (
              batch-id,
              batch-quantity-count,
              expiry-date-timestamp
            )
          `);

        if (error) {
          console.error("Error fetching inventory:", error);
          setError(`Database Error: ${error.message}. Table or column names may have changed.`);
          setLoading(false);
          return;
        }

        // 2. FORCE FILTER ON FRONTEND (Safety Net)
        const filteredData = (data || []).filter((item: any) => item['tenant-id'] === myTenantId);

        // 3. Transform Data & Calculate Expiry Logic
        const processed: ProductRow[] = filteredData.map((item: any) => {
          const batches = (item['inventory-batch-tracking-record'] || []).map((b: any) => {
            const daysLeft = Math.ceil((new Date(b['expiry-date-timestamp']).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            return {
              id: b['batch-id'],
              qty: b['batch-quantity-count'],
              expiry: b['expiry-date-timestamp'],
              days_left: daysLeft,
              status: daysLeft < 7 ? 'CRITICAL' : daysLeft < 30 ? 'WARNING' : 'GOOD'
            };
          });

          // Sum total quantity
          const totalQty = batches.reduce((acc: number, b: any) => acc + b.qty, 0);

          return {
            id: item['inventory-id'],
            name: item['global-product-master-catalog']?.['product-name'] || 'Unknown',
            sku: item['global-product-master-catalog']?.['upc-ean-code'] || 'N/A',
            image: item['global-product-master-catalog']?.['image-url'],
            total_qty: item['current-stock-quantity'] || totalQty,
            batches: batches.sort((a: any, b: any) => a.days_left - b.days_left)
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
                  <th className="px-6 py-3">Total Stock</th>
                  <th className="px-6 py-3">Health Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-400">
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
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{product.total_qty}</span>
                            <span className="text-gray-400 text-xs">units</span>
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
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>

                      {/* EXPANDED DETAILS (BATCH VIEW) */}
                      {isExpanded && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 ml-14">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                  <Calendar size={14} /> Batch Breakdown
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

        {/* PROMOTION MODAL RENDERED HERE */}
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