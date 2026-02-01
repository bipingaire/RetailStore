'use client';
import { useState, ChangeEvent, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Loader2, Check, AlertTriangle, Save, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';

type InvoiceItem = {
  raw_name: string;
  qty: number;
  unit_price: number;
  total_price?: number;
  status: 'matched' | 'review' | 'saved';
  matched_product?: string;
};

type InvoiceDetails = {
  id: string;
  status: string;
  total_pages?: number;
  pages_scanned?: number;
  line_items_json?: any[];
  vendor_name?: string;
  invoice_number?: string;
  total_amount?: number;
  invoice_date?: string;
};

export default function InvoiceReview() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ scanned: 0, total: 0, percent: 0 });
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [invoiceMeta, setInvoiceMeta] = useState<InvoiceDetails | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = (id: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const details = (await apiClient.getInvoice(id)) as InvoiceDetails;
        const total = details.total_pages || 1;
        const scanned = details.pages_scanned || 0;
        const pct = Math.round((scanned / total) * 100);

        setProgress({ scanned, total, percent: pct });

        if (details.status === 'completed') {
          clearInterval(pollIntervalRef.current!);
          setLoading(false);
          setInvoiceMeta(details);

          if (details.line_items_json) {
            const mappedItems = details.line_items_json.map((item: any) => ({
              raw_name: item.product_name,
              qty: item.quantity,
              unit_price: item.unit_cost,
              total_price: item.total_price,
              status: item.product_name.toLowerCase().includes('milk') ? 'matched' : 'review', // Simple mock match logic
              matched_product: item.product_name.toLowerCase().includes('milk') ? 'Whole Milk 1 Gallon' : ''
            }));
            setItems(mappedItems);
            toast.success("Invoice scanning complete!");
          }
        } else if (details.status === 'failed') {
          clearInterval(pollIntervalRef.current!);
          setLoading(false);
          toast.error("Scanning failed. Please try again.");
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setItems([]);
    setProgress({ scanned: 0, total: 0, percent: 0 });

    try {
      // 1. Upload
      const res = await apiClient.uploadInvoice(file);
      const id = res.invoice_id;
      setInvoiceId(id);

      // 2. Poll for status
      startPolling(id);

    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}`);
      setLoading(false);
    }
  };

  const saveBatch = async () => {
    if (!invoiceId || !invoiceMeta) return;
    setUploading(true);

    try {
      const payload = {
        supplier_name: invoiceMeta.vendor_name || "Unknown Vendor",
        invoice_number: invoiceMeta.invoice_number || `INV-${Date.now()}`,
        invoice_date: invoiceMeta.invoice_date || new Date().toISOString(),
        total_amount: invoiceMeta.total_amount || 0,
        items: items.map(item => ({
          product_name: item.raw_name,
          quantity: item.qty,
          unit_cost: item.unit_price,
          upc_code: null
        }))
      };

      await apiClient.commitInvoice(payload);
      toast.success("Inventory Updated Successfully!");
      setItems([]);
      setInvoiceId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save transaction");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incoming Shipment</h1>
            <p className="text-gray-500">Scan invoice with AI to update inventory.</p>
          </div>
          <div className="bg-white p-2 rounded shadow border">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileUpload}
              disabled={loading}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 file:font-bold hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        {/* Scanning State */}
        {loading && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed flex flex-col items-center">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">AI is Analyzing Invoice...</h3>
            <p className="text-gray-500 mb-4">Reading supplier, dates, and line items.</p>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${Math.max(5, progress.percent)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Page {progress.scanned} of {progress.total || '?'}
            </p>
          </div>
        )}

        {/* Results Table */}
        {!loading && items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Invoice Meta Header */}
            {invoiceMeta && (
              <div className="bg-gray-50 p-4 border-b flex gap-6 text-sm">
                <div>
                  <span className="block text-gray-400 text-xs uppercase tracking-wider">Vendor</span>
                  <span className="font-semibold text-gray-800">{invoiceMeta.vendor_name}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase tracking-wider">Invoice #</span>
                  <span className="font-semibold text-gray-800">{invoiceMeta.invoice_number}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs uppercase tracking-wider">Total</span>
                  <span className="font-semibold text-green-600">${invoiceMeta.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            )}

            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th className="p-4 font-medium">Qty</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Unit Cost</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Matched Product</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={idx} className={item.status === 'review' ? 'bg-yellow-50' : ''}>
                    <td className="p-4 font-mono font-bold text-blue-600">{item.qty}</td>
                    <td className="p-4 text-gray-800 font-medium">{item.raw_name}</td>
                    <td className="p-4 text-gray-600">${item.unit_price?.toFixed(2)}</td>
                    <td className="p-4 text-gray-800 font-bold">${item.total_price?.toFixed(2)}</td>
                    <td className="p-4">
                      {item.status === 'matched' ? (
                        <div className="flex items-center gap-2 text-green-700 font-medium bg-green-50 px-2 py-1 rounded w-fit">
                          <Check size={14} />
                          {item.matched_product}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter master product..."
                            className="border rounded px-2 py-1 w-full bg-white text-xs"
                          />
                          <button className="text-gray-400 hover:text-blue-600"><Search size={16} /></button>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {item.status === 'matched' ? (
                        <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Verified</span>
                      ) : (
                        <button className="text-yellow-600 hover:text-yellow-700 text-xs font-bold flex items-center gap-1">
                          <AlertTriangle size={12} /> Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Action */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-gray-500 text-sm">
                Showing {items.length} items extracted from invoice.
              </span>
              <button
                onClick={saveBatch}
                disabled={uploading}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                Commit Transaction
              </button>
            </div>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileText size={32} />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No Invoice Scanned</h3>
            <p className="text-gray-500">Upload a PDF or Image invoice to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}