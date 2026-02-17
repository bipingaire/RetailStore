'use client';
import { useEffect, useState } from 'react';
import { Search, Calendar, ChevronDown, ChevronUp, FileText, ArrowRight, Receipt } from 'lucide-react';



type InvoiceRecord = {
  id: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number;
  line_items_json: any[];
  created_at: string;
};

export default function InvoiceHistoryPage() {
  // Supabase removed - refactor needed
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setInvoices(data as any);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = invoices.filter(inv =>
    (inv.vendor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                const isExpanded = expandedRow === inv.id;
                const itemCount = Array.isArray(inv.line_items_json) ? inv.line_items_json.length : 0;

                return (
                  <>
                    <tr
                      key={inv.id}
                      className={`hover:bg-gray-50 cursor-pointer transition ${isExpanded ? 'bg-blue-50/50' : ''}`}
                      onClick={() => setExpandedRow(isExpanded ? null : inv.id)}
                    >
                      <td className="p-4 font-bold text-gray-900">{inv.vendor_name || 'Unknown'}</td>
                      <td className="p-4 font-mono text-sm text-blue-600">{inv.invoice_number || 'N/A'}</td>
                      <td className="p-4 text-sm text-gray-600">{inv.invoice_date}</td>
                      <td className="p-4 text-right font-bold">{itemCount}</td>
                      <td className="p-4 text-right font-bold text-green-600">${inv.total_amount?.toFixed(2)}</td>
                      <td className="p-4 text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS */}
                    {isExpanded && inv.line_items_json && (
                      <tr className="bg-gray-50 shadow-inner">
                        <td colSpan={6} className="p-0">
                          <div className="p-6">
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
                                {inv.line_items_json.map((item: any, idx: number) => (
                                  <tr key={idx}>
                                    <td className="p-3 font-medium">{item.product_name}</td>
                                    <td className="p-3 font-mono text-xs text-gray-500">{item.vendor_code || item.upc}</td>
                                    <td className="p-3 text-right">{item.qty}</td>
                                    <td className="p-3 text-right text-gray-600">${item.unit_cost?.toFixed(2)}</td>
                                    <td className="p-3 text-right font-bold">${(item.qty * item.unit_cost).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
