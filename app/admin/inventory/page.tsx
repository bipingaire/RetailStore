'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, Tag, Search, TrendingUp } from 'lucide-react';
import PromotionModal from './promotion-modal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // State to manage the Promotion Pop-up
  const [promoTarget, setPromoTarget] = useState<{product: ProductRow, batch?: Batch} | null>(null);

  // 2. Fetch Data (The Complex Join)
  useEffect(() => {
    async function fetchData() {
      // In real app: Filter by tenant_id using the one you generated
      const { data, error } = await supabase
        .from('store_inventory')
        .select(`
          id,
          global_products ( name, upc_ean, image_url ),
          inventory_batches ( id, batch_quantity, expiry_date, status )
        `);

      if (error) {
        console.error("Error fetching inventory:", error);
        return;
      }

      // 3. Transform Data & Calculate Expiry Logic
      const processed: ProductRow[] = data.map((item: any) => {
        const batches = (item.inventory_batches || []).map((b: any) => {
          const daysLeft = Math.ceil((new Date(b.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          return {
            id: b.id,
            qty: b.batch_quantity,
            expiry: b.expiry_date,
            days_left: daysLeft,
            status: daysLeft < 7 ? 'CRITICAL' : daysLeft < 30 ? 'WARNING' : 'GOOD'
          };
        });

        // Sum total quantity
        const totalQty = batches.reduce((acc: number, b: any) => acc + b.qty, 0);

        return {
          id: item.id,
          name: item.global_products?.name || 'Unknown',
          sku: item.global_products?.upc_ean || 'N/A',
          image: item.global_products?.image_url,
          total_qty: totalQty,
          batches: batches.sort((a: any, b: any) => a.days_left - b.days_left) // Show expiring first
        };
      });

      setProducts(processed);
      setLoading(false);
    }
    fetchData();
  }, []);

  // 4. Helper for Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Inventory Pulse
            </h1>
            <p className="text-gray-500">Real-time view of shelf life and stock levels.</p>
          </div>
          <div className="relative w-full md:w-auto">
             <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search products..." 
               className="pl-10 pr-4 py-2 border rounded-lg shadow-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" 
             />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
             <p className="text-gray-500">Loading your store data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Health Check</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 && (
                   <tr>
                     <td colSpan={4} className="p-8 text-center text-gray-400">
                       No inventory found. Try scanning an invoice first!
                     </td>
                   </tr>
                )}
                {products.map((product) => {
                  const worstBatch = product.batches[0]; // The one expiring soonest
                  const isExpanded = expandedRow === product.id;

                  return (
                    <>
                      {/* MAIN ROW */}
                      <tr 
                        key={product.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition ${isExpanded ? 'bg-blue-50/30' : ''}`}
                        onClick={() => setExpandedRow(isExpanded ? null : product.id)}
                      >
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border shrink-0">
                            {product.image ? <img src={product.image} className="w-full h-full object-cover rounded-lg" alt="prod" /> : "IMG"}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-400 font-mono">{product.sku}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-lg">{product.total_qty}</span>
                          <span className="text-xs text-gray-400 ml-1">units</span>
                        </td>
                        <td className="p-4">
                          {worstBatch ? (
                            <span className={`px-2 py-1 rounded border text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(worstBatch.status)}`}>
                              <Calendar className="w-3 h-3" />
                              {worstBatch.days_left} Days Left
                            </span>
                          ) : (
                             <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right text-gray-400">
                           {isExpanded ? <ChevronUp className="w-5 h-5 ml-auto" /> : <ChevronDown className="w-5 h-5 ml-auto" />}
                        </td>
                      </tr>

                      {/* EXPANDED DETAILS (BATCH VIEW) */}
                      {isExpanded && (
                        <tr className="bg-gray-50 shadow-inner">
                          <td colSpan={4} className="p-4 sm:pl-20">
                            <div className="bg-white rounded-lg border p-4 shadow-sm">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch Breakdown</h4>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPromoTarget({ product }); // Promote entire product
                                  }}
                                  className="text-xs text-blue-600 font-bold hover:underline"
                                >
                                  + Create General Store Offer
                                </button>
                              </div>
                              
                              {product.batches.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No specific batch data available.</p>
                              ) : (
                                product.batches.map((batch) => (
                                  <div key={batch.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b last:border-0 gap-3">
                                    <div className="flex items-center gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">Quantity</span>
                                        <span className="font-mono font-bold text-gray-800">{batch.qty}</span>
                                      </div>
                                      <div className="h-8 w-px bg-gray-200"></div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">Expiry Date</span>
                                        <span className={`text-sm font-medium ${batch.days_left < 7 ? 'text-red-600' : 'text-gray-800'}`}>
                                          {batch.expiry} ({batch.days_left}d)
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* THE "PROMOTE" ACTION */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation(); // Stop row from closing
                                        setPromoTarget({ product, batch });
                                      }}
                                      className="text-xs bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-sm w-full sm:w-auto"
                                    >
                                      <Tag className="w-3 h-3" />
                                      {batch.status === 'CRITICAL' ? 'Clearance Sale' : 'Promote Batch'}
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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