'use client';
import { useState, useEffect } from 'react';
import { Upload, FileText, Check, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  vendorId: string;
  vendor?: { name: string };
  totalAmount: number;
  status: string;
  fileUrl?: string;
};

type InvoiceItem = {
  productId: string;
  quantity: number;
  unitCost: number;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    vendorId: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [invoicesRes, vendorsRes, productsRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/vendors'),
        fetch('/api/products'),
      ]);

      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (vendorsRes.ok) setVendors(await vendorsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Parse invoice using OCR (mock for now)
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/invoices/parse', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const parsed = await res.json();
        setParsedData(parsed);
        toast.success('Invoice parsed! Please review and confirm.');
      }
    } catch (error) {
      toast.error('Failed to parse invoice');
    }
  }

  async function handleCreateInvoice() {
    try {
      const formDataToSend = new FormData();
      if (selectedFile) formDataToSend.append('file', selectedFile);
      formDataToSend.append('vendorId', formData.vendorId);
      formDataToSend.append('invoiceNumber', formData.invoiceNumber);
      formDataToSend.append('invoiceDate', formData.invoiceDate);
      formDataToSend.append('totalAmount', formData.totalAmount.toString());

      const res = await fetch('/api/invoices/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.ok) {
        const invoice = await res.json();
        toast.success('Invoice created!');
        setEditingInvoice(invoice.id);
        setShowUploadModal(false);
        loadData();
      }
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  }

  async function handleAddItems(invoiceId: string) {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: invoiceItems }),
      });

      if (res.ok) {
        toast.success('Items added!');
        setInvoiceItems([]);
      }
    } catch (error) {
      toast.error('Failed to add items');
    }
  }

  async function handleCommitInvoice(invoiceId: string) {
    if (!confirm('This will add the invoice items to inventory. Continue?')) return;

    try {
      const res = await fetch(`/api/invoices/${invoiceId}/commit`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Invoice committed! Inventory updated.');
        loadData();
        setEditingInvoice(null);
      }
    } catch (error) {
      toast.error('Failed to commit invoice');
    }
  }

  function addItemRow() {
    setInvoiceItems([...invoiceItems, { productId: '', quantity: 1, unitCost: 0 }]);
  }

  function updateItem(index: number, field: keyof InvoiceItem, value: any) {
    const updated = [...invoiceItems];
    updated[index][field] = value;
    setInvoiceItems(updated);
  }

  function removeItem(index: number) {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  }

  if (loading) return <div className="p-8">Loading invoices...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory In - Invoice Management</h1>
          <p className="text-gray-500 mt-1">Upload vendor invoices to track incoming inventory</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Upload size={20} />
          Upload Invoice
        </button>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.vendor?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-mono">${invoice.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'committed'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'validated'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {invoice.status === 'pending' && (
                    <button
                      onClick={() => setEditingInvoice(invoice.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Add Items
                    </button>
                  )}
                  {invoice.status === 'validated' && (
                    <button
                      onClick={() => handleCommitInvoice(invoice.id)}
                      className="text-green-600 hover:text-green-800 flex items-center gap-1"
                    >
                      <Check size={16} />
                      Commit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upload New Invoice</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Invoice File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to upload invoice (PDF or Image)'}
                  </p>
                </label>
              </div>
            </div>

            {/* Invoice Details Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <select
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="INV-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateInvoice}
                disabled={!formData.vendorId || !formData.invoiceNumber}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg"
              >
                Create Invoice
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Items Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Invoice Items</h2>
              <button onClick={() => setEditingInvoice(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {invoiceItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    placeholder="Qty"
                    className="w-24 border border-gray-300 rounded-lg px-4 py-2"
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={item.unitCost}
                    onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value))}
                    placeholder="Unit Cost"
                    className="w-32 border border-gray-300 rounded-lg px-4 py-2"
                  />

                  <span className="w-32 py-2 text-right font-mono">
                    ${(item.quantity * item.unitCost).toFixed(2)}
                  </span>

                  <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800 p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={addItemRow}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus size={20} />
                Add Item
              </button>

              <button
                onClick={() => handleAddItems(editingInvoice)}
                disabled={invoiceItems.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg"
              >
                Save Items & Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
