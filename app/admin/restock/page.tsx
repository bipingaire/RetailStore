'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Package, Mail } from 'lucide-react';
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
  const [lowStockItems, setLowStockItems] = useState<RestockItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [vendorEmail, setVendorEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLowStockItems();
  }, []);

  async function loadLowStockItems() {
    try {
      // Fetch from real backend API
      const response = await fetch('http://localhost:3001/api/inventory/low-stock', {
        headers: {
          'x-tenant-id': 'retail_store_anuj',
        },
      });

      if (response.ok) {
        const data = await response.json();

        const items: RestockItem[] = data.map((product: any) => {
          const reorderPoint = product.reorderLevel ?? 10;
          const suggestedQty = Math.max(50, reorderPoint * 3);
          const unitCost = Number(product.costPrice) ?? 0;

          return {
            inventory_id: product.id,
            product_name: product.name,
            current_stock: product.stock ?? 0,
            reorder_point: reorderPoint,
            suggested_quantity: suggestedQty,
            unit_cost: unitCost,
            total_cost: unitCost * suggestedQty,
          };
        });

        setLowStockItems(items);
        setSelectedItems(items.map(i => i.inventory_id));
      } else {
        console.error('Failed to fetch low stock items');
      }
    } catch (error) {
      console.error('Error loading low stock items:', error);
      toast.error('Something went wrong loading data');
    } finally {
      setLoading(false);
    }
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
        toast.error('Failed to send email', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Error sending purchase order', { id: loadingToast });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading low stock items...</div>
      </div>
    );
  }

  const selected = lowStockItems.filter(i => selectedItems.includes(i.inventory_id));
  const totalOrderCost = selected.reduce((sum, item) => sum + item.total_cost, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Restock</h1>
        <p className="text-gray-500 mt-2">Items below reorder point - generate and send purchase orders</p>
      </div>

      {lowStockItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All stocked up!</h3>
          <p className="text-gray-500">No products currently below reorder level.</p>
        </div>
      ) : (
        <>
          {/* Alert Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {lowStockItems.length} items need restocking
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Review and send purchase order to your vendor
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === lowStockItems.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(lowStockItems.map(i => i.inventory_id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Point</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suggested Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockItems.map((item) => (
                  <tr key={item.inventory_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
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
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                    <td className="px-6 py-3">
                      <span className={`text-sm font-semibold ${item.current_stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                        {item.current_stock}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{item.reorder_point}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-blue-600">{item.suggested_quantity}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">${item.unit_cost.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">${item.total_cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Purchase Order Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Purchase Order</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Email
              </label>
              <input
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                placeholder="vendor@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Selected Items:</span>
                <span className="font-semibold text-gray-900">{selectedItems.length}</span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-gray-900">Total Order Cost:</span>
                <span className="font-bold text-blue-600">${totalOrderCost.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={sendPurchaseOrder}
              disabled={sending || selectedItems.length === 0 || !vendorEmail}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              <Mail className="w-5 h-5" />
              {sending ? 'Sending...' : 'Send Purchase Order'}
            </button>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-500 mb-2">Preview:</div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {selectedItems.length > 0 ? generatePurchaseOrder() : 'Select items to preview purchase order'}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
