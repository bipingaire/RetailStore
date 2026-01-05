'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Package, Mail, FileText, Send, Sparkles, Zap, ShoppingCart } from 'lucide-react';

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
  const supabase = createClientComponentClient();

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
      .from('store_inventory')
      .select(`
        inventory_id,
        current_stock_quantity,
        reorder_point_value,
        cost_price_amount,
        global_products (product_name)
      `)
      .lte('current_stock_quantity', supabase.rpc('reorder_point_value'))
      .eq('is_active', true);

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
      alert('Please enter vendor email and select items');
      return;
    }

    setSending(true);
    const po = generatePurchaseOrder();
    const mailtoLink = `mailto:${vendorEmail}?subject=Purchase Order - ${new Date().toLocaleDateString()}&body=${encodeURIComponent(po)}`;
    window.location.href = mailtoLink;
    setSending(false);
    alert('Purchase order email opened! Send it from your email client.');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-teal-300/30 border-t-teal-500 rounded-full animate-spin"></div>
          <ShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-teal-400 animate-pulse" size={32} />
        </div>
      </div>
    );
  }

  const totalValue = lowStockItems
    .filter(i => selectedItems.includes(i.inventory_id))
    .reduce((sum, item) => sum + item.total_cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                <Package className="text-white" size={36} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Restock Automation</h1>
                <p className="text-teal-200 mt-1">Generate and send purchase orders for low-stock items</p>
              </div>
            </div>
          </div>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 p-16 text-center shadow-2xl">
            <Package className="mx-auto text-emerald-300 mb-6" size={64} />
            <h3 className="text-3xl font-bold text-white mb-2">All Stocked Up!</h3>
            <p className="text-emerald-200 text-lg">No items below reorder point</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-1 shadow-xl">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="text-rose-600" size={24} />
                    <span className="text-sm font-bold text-rose-900 uppercase tracking-wide">Items Below Reorder Point</span>
                  </div>
                  <div className="text-5xl font-black text-rose-900">{lowStockItems.length}</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="text-blue-600" size={24} />
                    <span className="text-sm font-bold text-blue-900 uppercase tracking-wide">Estimated Order Value</span>
                  </div>
                  <div className="text-5xl font-black text-purple-900">${totalValue.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white">Select Items to Restock</h3>
              </div>
              <div className="divide-y divide-white/10">
                {lowStockItems.map((item) => (
                  <label
                    key={item.inventory_id}
                    className="flex items-center gap-6 p-6 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.inventory_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.inventory_id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.inventory_id));
                        }
                      }}
                      className="w-6 h-6 rounded border-2 border-teal-400 text-teal-600 focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">{item.product_name}</div>
                      <div className="text-teal-200 text-sm mt-1">
                        Current: <span className="font-semibold">{item.current_stock}</span> |
                        Reorder Point: <span className="font-semibold">{item.reorder_point}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-200 text-sm mb-1">Suggested Qty</div>
                      <div className="font-black text-white text-2xl">{item.suggested_quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-200 text-sm mb-1">Total Cost</div>
                      <div className="font-black text-cyan-300 text-2xl">${item.total_cost.toFixed(2)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Vendor Email & Send */}
            {selectedItems.length > 0 && (
              <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 text-lg font-bold text-white mb-3">
                      <Mail size={24} className="text-teal-300" />
                      Vendor Email
                    </label>
                    <input
                      type="email"
                      value={vendorEmail}
                      onChange={(e) => setVendorEmail(e.target.value)}
                      placeholder="vendor@example.com"
                      className="w-full bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white placeholder-white/50 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => alert(generatePurchaseOrder())}
                      className="flex-1 bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <FileText size={22} />
                      Preview PO
                    </button>
                    <button
                      onClick={sendPurchaseOrder}
                      disabled={sending || !vendorEmail}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                    >
                      <Send size={22} />
                      {sending ? 'Sending...' : `Send PO ($${totalValue.toFixed(2)})`}
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