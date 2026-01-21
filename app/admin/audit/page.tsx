'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ClipboardCheck, Package, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [auditItems, setAuditItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await apiClient.getInventory();
        setInventory(data);

        // Initialize audit counts with current quantities
        const initial: Record<string, number> = {};
        data.forEach((item: any) => {
          initial[item.inventory_id] = item.quantity_on_hand || 0;
        });
        setAuditItems(initial);
      } catch (error: any) {
        console.error('Error loading inventory:', error);
        toast.error('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  async function handleSubmitAudit() {
    setSubmitting(true);
    try {
      // Start audit
      const audit = await apiClient.startAudit({
        audit_type: 'shelf_count',
      });

      // Submit audit items
      const items = Object.entries(auditItems).map(([id, counted]) => ({
        inventory_id: id,
        counted_quantity: counted,
      }));

      await apiClient.completeAudit(audit.audit_id, items);
      toast.success('Audit submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting audit:', error);
      toast.error('Failed to submit audit');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Shelf Audit</h1>
            <p className="text-gray-500 mt-1">Count physical inventory</p>
          </div>
          <button
            onClick={handleSubmitAudit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save size={20} />
                Submit Audit
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">System Count</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Physical Count</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => {
                const systemCount = item.quantity_on_hand || 0;
                const physicalCount = auditItems[item.inventory_id] || 0;
                const variance = physicalCount - systemCount;

                return (
                  <tr key={item.inventory_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{item.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{systemCount}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={physicalCount}
                        onChange={(e) => setAuditItems({
                          ...auditItems,
                          [item.inventory_id]: parseInt(e.target.value) || 0
                        })}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${variance === 0 ? 'text-gray-500' :
                          variance > 0 ? 'text-green-600' :
                            'text-red-600'
                        }`}>
                        {variance > 0 ? '+' : ''}{variance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}