'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { FileText, Upload, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      const data = await apiClient.getInvoices();
      setInvoices(data);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Uploading invoice...');
      await apiClient.uploadInvoice(file);
      toast.success('Invoice uploaded successfully!');
      fetchInvoices();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload invoice');
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
            <h1 className="text-3xl font-black text-gray-900">Invoices</h1>
            <p className="text-gray-500 mt-1">Upload and manage vendor invoices</p>
          </div>
          <label className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer">
            <Upload size={20} />
            Upload Invoice
            <input type="file" onChange={handleUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
          </label>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((invoice) => (
            <div key={invoice.invoice_id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{invoice.invoice_number || 'INV-' + invoice.invoice_id.slice(0, 8)}</h3>
                    <p className="text-xs text-gray-500">{invoice.supplier_name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold">${parseFloat(invoice.total_amount_value || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${invoice.processing_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {invoice.processing_status || 'pending'}
                  </span>
                </div>
              </div>

              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <Eye size={16} />
                View Details
              </button>
            </div>
          ))}

          {invoices.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No invoices uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}