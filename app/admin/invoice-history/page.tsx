'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Search, FileText, ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { toast } from 'sonner';

type InvoiceRecord = {
  invoice_id: string; // Updated from id
  supplier: string; // Updated from vendor_name
  invoice_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  line_items_json?: any[]; // Only present if detailed fetch or mapped (backend history doesn't send this by default)
  invoice_date?: string;
};

export default function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsCache, setDetailsCache] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.getInvoiceHistory();
        setInvoices(data.invoices || []);
      } catch (err: any) {
        toast.error('Failed to load invoice history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleExpand = async (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
      return;
    }
    setExpandedRow(id);

    // Fetch details if not cached/present
    if (!detailsCache[id]) {
      try {
        const details = await apiClient.getInvoice(id);
        setDetailsCache(prev => ({ ...prev, [id]: details }));
      } catch (err) {
        toast.error('Failed to load details');
      }
    }
  };

  const filtered = invoices.filter(inv =>
    (inv.supplier || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans min-h-screen bg-gray-50">

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-purple-600" />
            Invoice Data History
          </h1>
          <p className="text-gray-500 mt-1">Archive of all scanned inventory receipts.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vendor or invoice #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm w-64 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading History...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
              <tr>
                <th className="p-4">Vendor</th>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Items</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv) => {
                const isExpanded = expandedRow === inv.invoice_id;
                const details = detailsCache[inv.invoice_id];
                const items = details?.line_items_json || [];
                // Use details if available, else fallback to summary which lacks item count usually or calculate
                const itemCount = details ? items.length : '--';

                return (
                  <>
                    <tr
                      key={inv.invoice_id}
                      className={`hover:bg-gray-50 cursor-pointer transition ${isExpanded ? 'bg-blue-50/50' : ''}`}
                      onClick={() => handleExpand(inv.invoice_id)}
                    >
                      <td className="p-4 font-bold text-gray-900">{inv.supplier || 'Unknown'}</td>
                      <td className="p-4 font-mono text-sm text-blue-600">{inv.invoice_number || 'N/A'}</td>
                      <td className="p-4 text-sm text-gray-600">{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right font-bold">{itemCount}</td>
                      <td className="p-4 text-right font-bold text-green-600">${inv.total_amount?.toFixed(2)}</td>
                      <td className="p-4 text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS */}
                    {isExpanded && (
                      <tr className="bg-gray-50 shadow-inner">
                        <td colSpan={6} className="p-0">
                          <div className="p-6">
                            {!details ? (
                              <div className="text-center py-4 text-gray-500 text-sm">Loading details...</div>
                            ) : (
                              <>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                  <Receipt size={14} /> Line Items Record
                                </h4>
                                <table className="w-full text-sm bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <thead className="bg-gray-100 text-xs font-bold text-gray-500">
                                    <tr>
                                      <th className="p-3 text-left">Product</th>
                                      <th className="p-3 text-left">SKU / UPC</th>
                                      <th className="p-3 text-right">Qty</th>
                                      <th className="p-3 text-right">Unit Cost</th>
                                      <th className="p-3 text-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {items.map((item: any, idx: number) => (
                                      <tr key={idx}>
                                        <td className="p-3 font-medium">{item.product_name}</td>
                                        <td className="p-3 font-mono text-xs text-gray-500">{item.vendor_code || item.upc || item.upc_code}</td>
                                        <td className="p-3 text-right">{item.quantity || item.qty}</td>
                                        <td className="p-3 text-right text-gray-600">${(item.unit_cost || 0).toFixed(2)}</td>
                                        <td className="p-3 text-right font-bold">${((item.quantity || item.qty) * (item.unit_cost || 0)).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </>
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
          {filtered.length === 0 && <div className="p-10 text-center text-gray-400">No invoices found.</div>}
        </div>
      )}
    </div>
  );
}
