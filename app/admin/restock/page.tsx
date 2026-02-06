'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Package, Mail, FileText, Send, Zap, ShoppingCart, AlertCircle, CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface RestockItem {
  inventory_id: string;
  product_name: string;
  current_stock: number;
  reorder_point: number;
  suggested_quantity: number;
  unit_cost: number;
  total_cost: number;
}

export default function RestockPage() {
  const router = useRouter();


  const [lowStockItems, setLowStockItems] = useState<RestockItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [vendorEmail, setVendorEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLowStockItems();
  }, []);

  async function loadLowStockItems() {
    const { data } = await supabase
      .from('retail-store-inventory-item')
      .select(`
          id:"inventory-id",
          stock:"current-stock-quantity",
          min_level:"reorder-level-quantity",
          global_products:"global-product-master-catalog"!"global-product-id" ( name:"product-name", image_url:"image-url")
        `)
      .lte('current-stock-quantity', 20) // Temporary fix: hardcoded threshold as RPC might not exist for new schema yet
      .eq('is-active-flag', true);

    const items: RestockItem[] = (data || []).map((item: any) => {
      const suggestedQty = Math.max(50, (item.reorder_point_value || 10) * 3);
      return {
        inventory_id: item.inventory_id,
        product_name: item.global_products?.product_name || 'Unknown',
        current_stock: item.current_stock_quantity,
        reorder_point: item.reorder_point_value,
        suggested_quantity: suggestedQty,
        unit_cost: item.cost_price_amount || 0,
        total_cost: suggestedQty * (item.cost_price_amount || 0)
      };
    });

    setLowStockItems(items);
    setSelectedItems(items.map(i => i.inventory_id));
    setLoading(false);
  }

  function generatePurchaseOrder() {
    const selected = lowStockItems.filter(i => selectedItems.includes(i.inventory_id));
    const totalCost = selected.reduce((sum, item) => sum + item.total_cost, 0);

    return `
PURCHASE ORDER
Date: ${new Date().toLocaleDateString()}

Items:
${selected.map((item, idx) =>
      `${idx + 1}. ${item.product_name}
   Quantity: ${item.suggested_quantity} units
   Unit Cost: $${item.unit_cost.toFixed(2)}
   Total: $${item.total_cost.toFixed(2)}`
    ).join('\n\n')}

TOTAL ORDER VALUE: $${totalCost.toFixed(2)}

Please confirm availability and delivery timeline.

Thank you!
    `.trim();
  }

  async function sendPurchaseOrder() {
    if (!vendorEmail || selectedItems.length === 0) {
      toast.error('Please enter vendor email and select items');
      return;
    }

    setSending(true);
    const loadingToast = toast.loading('Sending purchase order...');

    try {
      const po = generatePurchaseOrder();
      const response = await fetch('/api/email/send-po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: vendorEmail,
          subject: `Purchase Order - ${new Date().toLocaleDateString()}`,
          message: po
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Purchase order sent successfully!', { id: loadingToast });
        setVendorEmail('');
        setSelectedItems([]);
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error: any) {
      toast.error(`Failed to send: ${error.message}`, { id: loadingToast });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-400 text-sm">Loading restock data...</div>
      </div>
    );
  }

  const totalValue = lowStockItems
    .filter(i => selectedItems.includes(i.inventory_id))
    .reduce((sum, item) => sum + item.total_cost, 0);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Restock Automation</h1>
          <p className="text-sm text-gray-500">Auto-generate purchase orders for low stock items.</p>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">All Inventory Healthy</h3>
            <p className="text-gray-500">No items are currently below their reorder point.</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-red-50 text-red-600 rounded">
                    <Zap size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase">Critical Low Stock</span>
                </div>
                <div className="text-3xl font-black text-gray-900">{lowStockItems.length} <span className="text-base font-medium text-gray-400">items</span></div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase">Estimated PO Value</span>
                </div>
                <div className="text-3xl font-black text-gray-900">${totalValue.toFixed(2)}</div>
              </div>
            </div>

            {/* Restock Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-gray-900 text-sm">Suggested Reorders</h3>
                <div className="text-xs text-gray-500">Select items to include in PO</div>
              </div>
              <div className="divide-y divide-gray-100">
                {lowStockItems.map((item) => (
                  <label
                    key={item.inventory_id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.inventory_id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedItems([...selectedItems, item.inventory_id]);
                        else setSelectedItems(selectedItems.filter(id => id !== item.inventory_id));
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-sm">{item.product_name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="text-red-500 font-medium">Stock: {item.current_stock}</span>
                        <span className="text-gray-300">|</span>
                        <span>Reorder Point: {item.reorder_point}</span>
                      </div>
                    </div>

                    <div className="text-right w-32">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Quantity</div>
                      <div className="font-mono font-bold text-gray-900">{item.suggested_quantity}</div>
                    </div>
                    <div className="text-right w-32">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Cost</div>
                      <div className="font-mono font-bold text-gray-900">${item.total_cost.toFixed(2)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Vendor Actions */}
            {selectedItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Mail size={16} /> Vendor Details
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Vendor Email</label>
                      <input
                        type="email"
                        value={vendorEmail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                        placeholder="orders@vendor.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3">
                    <button
                      onClick={() => toast.info(generatePurchaseOrder(), { duration: 8000 })}
                      className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> Preview PO
                    </button>
                    <button
                      onClick={sendPurchaseOrder}
                      disabled={sending || !vendorEmail}
                      className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</span>
                      ) : (
                        <>
                          <Send size={16} /> Send Purchase Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}