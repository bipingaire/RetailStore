'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { FileText, Upload, Clock, CloudUpload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    console.log('[Invoice Page] Fetching invoices...');
    try {
      const data = await apiClient.getInvoices();
      console.log('[Invoice Page] Invoices fetched:', data);

      // Handle both response formats
      const invoiceList = data.invoices || data || [];
      console.log('[Invoice Page] Processed invoice list:', invoiceList);

      setInvoices(invoiceList);
    } catch (error: any) {
      console.error('[Invoice Page] Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('[Invoice Upload] File input changed');
    const file = e.target.files?.[0];

    if (!file) {
      console.log('[Invoice Upload] No file selected');
      return;
    }

    console.log('[Invoice Upload] File selected:', file.name, file.size, 'bytes');

    try {
      console.log('[Invoice Upload] Starting upload...');
      toast.info('Uploading invoice...');

      const result = await apiClient.uploadInvoice(file);
      console.log('[Invoice Upload] Upload successful:', result);

      toast.success('Invoice uploaded successfully!');
      fetchInvoices();

      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      console.error('[Invoice Upload] Upload error:', error);
      console.error('[Invoice Upload] Error details:', error.message, error.stack);
      toast.error(`Failed to upload invoice: ${error.message || 'Unknown error'}`);
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">Invoice Scanner</h1>
            </div>
            <p className="text-gray-500 text-sm">Digitize invoices and update stock automatically.</p>
          </div>
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer text-sm shadow-sm">
            <CloudUpload size={18} />
            Scan New Invoice
            <input type="file" onChange={handleUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="font-bold text-gray-900">Recent Scans</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <tr key={invoice.invoice_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : new Date().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.supplier_name || 'Scanning...'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.invoice_number || '---'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                        ${parseFloat(invoice.total_amount_value || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.processing_status === 'completed'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                          }`}>
                          {invoice.processing_status === 'completed' ? 'PROCESSED' : 'PROCESSING'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No invoices scanned yet</p>
                      <p className="text-gray-400 text-sm mt-1">Upload an invoice to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}