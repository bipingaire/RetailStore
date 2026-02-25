'use client';
import { useState, useEffect } from 'react';
import { Upload, FileText, Check, X, Plus, Trash2, Layout, Columns, Rows, GripVertical, GripHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

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
  const [parsing, setParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState({ current: 0, total: 20 });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  // Split View State
  const [splitRatio, setSplitRatio] = useState(50);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);



  // Form state
  const [formData, setFormData] = useState({
    vendorId: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
  });

  useEffect(() => {
    loadData();
    loadData();
  }, []);

  // Update preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (parsedData?.fileUrl) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = parsedData.fileUrl.startsWith('http') ? parsedData.fileUrl : `${API_URL}${parsedData.fileUrl}`;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile, parsedData?.fileUrl]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const modalContent = document.getElementById('upload-modal-content');
      if (!modalContent) return;

      const rect = modalContent.getBoundingClientRect();

      let newRatio = 50;
      if (orientation === 'horizontal') {
        const x = e.clientX - rect.left;
        newRatio = (x / rect.width) * 100;
      } else {
        const y = e.clientY - rect.top;
        newRatio = (y / rect.height) * 100;
      }

      // Clamp between 20% and 80%
      if (newRatio < 20) newRatio = 20;
      if (newRatio > 80) newRatio = 80;

      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, orientation]);


  async function loadData() {
    try {
      const [invoicesRes, vendorsRes, productsRes] = await Promise.all([
        apiClient.get('/invoices'),
        apiClient.get('/vendors'),
        apiClient.get('/products'),
      ]);

      setInvoices(invoicesRes);
      setVendors(vendorsRes);
      setProducts(productsRes);

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
    setShowUploadModal(true); // Show modal immediately
    setParsing(true);
    setParsingProgress({ current: 0, total: 20 });
    toast.loading('📄 Scanning invoice...');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setParsingProgress(prev => {
        if (prev.current < prev.total - 2) {
          return { ...prev, current: prev.current + 1 };
        }
        return prev;
      });
    }, 150); // Update every 150ms

    try {
      // Parse invoice using OCR
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const parsed = await apiClient.post('/invoices/parse', formDataToSend);
      setParsedData(parsed);

      // Auto-match or create vendor
      let vendorId = '';
      const existingVendor = vendors.find(
        v => v.name.toLowerCase() === parsed.vendorName.toLowerCase()
      );

      if (existingVendor) {
        vendorId = existingVendor.id;
      } else {
        // Create new vendor automatically
        const newVendor = await apiClient.post('/vendors', { name: parsed.vendorName });
        vendorId = newVendor.id;
        await loadData(); // Reload to get new vendor in list
      }

      // Auto-fill form with parsed data
      const invoiceDate = parsed.invoiceDate
        ? new Date(parsed.invoiceDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        vendorId,
        invoiceNumber: parsed.invoiceNumber || '',
        invoiceDate,
        totalAmount: parsed.totalAmount || 0,
      });

      // Complete progress
      clearInterval(progressInterval);
      setParsingProgress({ current: 20, total: 20 });

      toast.dismiss();
      toast.success('✓ Invoice parsed! Review the data below.');

      // Show modal for review
    } catch (error) {
      clearInterval(progressInterval);
      toast.dismiss();
      toast.error('Failed to parse invoice. Please try again.');
    } finally {
      setParsing(false);
    }
  }

  async function handleEditInvoice(invoiceId: string) {
    try {
      const loadingToast = toast.loading('Loading invoice details...');
      const data = await apiClient.get(`/invoices/${invoiceId}/parsed`);

      setParsedData(data);
      setFormData({
        vendorId: data.vendorId || '',
        invoiceNumber: data.invoiceNumber || '',
        invoiceDate: new Date(data.invoiceDate).toISOString().split('T')[0],
        totalAmount: data.totalAmount || 0,
      });

      setEditingInvoice(invoiceId);
      setShowUploadModal(true);
      setSelectedFile(null);

      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to load invoice details');
    }
  }

  async function handleCreateInvoice() {
    try {
      if (editingInvoice) {
        const updatePayload = {
          vendorId: formData.vendorId,
          invoiceNumber: formData.invoiceNumber,
          invoiceDate: formData.invoiceDate,
          totalAmount: formData.totalAmount,
          items: parsedData?.items || []
        };
        await apiClient.put(`/invoices/${editingInvoice}`, updatePayload);
        toast.success('✅ Invoice updated!');
      } else {
        const formDataToSend = new FormData();
        if (selectedFile) formDataToSend.append('file', selectedFile);
        formDataToSend.append('vendorId', formData.vendorId);
        formDataToSend.append('invoiceNumber', formData.invoiceNumber);
        formDataToSend.append('invoiceDate', formData.invoiceDate);
        formDataToSend.append('totalAmount', formData.totalAmount.toString());

        if (parsedData?.items) {
          formDataToSend.append('items', JSON.stringify(parsedData.items));
        }

        await apiClient.post('/invoices/upload', formDataToSend);
        toast.success('✅ Saved to inventory!');
      }

      setEditingInvoice(null);
      setShowUploadModal(false);
      setSelectedFile(null);
      setParsedData(null);
      loadData();
    } catch (error) {
      toast.error('Failed to save invoice');
    }
  }

  async function handleCommitInvoice(invoiceId: string) {
    if (!confirm('This will add the invoice items to inventory. Continue?')) return;

    try {
      await apiClient.post(`/invoices/${invoiceId}/commit`, {});
      toast.success('Invoice committed! Inventory updated.');
      loadData();
      setEditingInvoice(null);
    } catch (error) {
      toast.error('Failed to commit invoice');
    }
  }

  function addItemRow() {
    setInvoiceItems([...invoiceItems, { productId: '', quantity: 1, unitCost: 0 }]);
  }

  function updateItem(index: number, field: keyof InvoiceItem, value: any) {
    const updated = [...invoiceItems];
    (updated[index] as any)[field] = value;
    setInvoiceItems(updated);
  }

  function removeItem(index: number) {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  }

  if (loading) return <div className="p-8">Loading invoices...</div>;

  return (
    <div className="p-8">
      {/* Hidden file input - triggered by Upload Invoice button */}
      <input
        ref={(input) => {
          if (input) {
            (window as any).invoiceFileInput = input;
          }
        }}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="invoice-file-input"
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory In - Invoice Management</h1>
          <p className="text-gray-500 mt-1">Upload vendor invoices to track incoming inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingInvoice(null);
            setParsedData(null);
            setFormData({ vendorId: '', invoiceNumber: '', invoiceDate: new Date().toISOString().split('T')[0], totalAmount: 0 });
            const fileInput = document.getElementById('invoice-file-input') as HTMLInputElement;
            if (fileInput) fileInput.click();
          }}
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
              <tr
                key={invoice.id}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleEditInvoice(invoice.id)}
              >
                <td className="px-6 py-4 text-sm font-medium text-blue-700 underline underline-offset-2">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.vendor?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-mono">${Number(invoice.totalAmount).toFixed(2)}</td>
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
                <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditInvoice(invoice.id)}
                      className="text-xs px-2 py-1 border rounded text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {invoice.status === 'committed' ? '👁 View' : '✏️ Edit'}
                    </button>
                    {invoice.status === 'validated' && (
                      <button
                        onClick={() => handleCommitInvoice(invoice.id)}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs px-2 py-1 border border-green-200 rounded hover:bg-green-50"
                      >
                        <Check size={14} />
                        Commit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload/Review Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${parsedData ? 'w-[98vw] h-[95vh]' : 'max-w-2xl w-full max-h-[90vh]'
            }`}>
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                  {parsedData ? 'Review & Verify Invoice' : 'Upload New Invoice'}
                </h2>
                {parsedData && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    Drag splitter to resize
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Controls (Only visible when reviewing) */}
                {parsedData && (
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
                    <button
                      title="Split Horizontally"
                      onClick={() => setOrientation('horizontal')}
                      className={`p-1.5 rounded transition-colors ${orientation === 'horizontal' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Columns size={18} />
                    </button>
                    <button
                      title="Split Vertically"
                      onClick={() => setOrientation('vertical')}
                      className={`p-1.5 rounded transition-colors ${orientation === 'vertical' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Rows size={18} />
                    </button>
                  </div>
                )}

                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body - Resizable Split View */}
            <div
              id="upload-modal-content"
              className={`flex-1 overflow-hidden relative ${parsedData ? 'flex' : 'block overflow-y-auto'}`}
              style={{ flexDirection: orientation === 'horizontal' ? 'row' : 'column' }}
            >

              {/* PANE 1: PREVIEW (Only visible if parsedData is present) */}
              {parsedData && (
                <>
                  <div
                    className="bg-gray-900 overflow-hidden relative flex items-center justify-center p-4"
                    style={{ flexBasis: `${splitRatio}%` }}
                  >
                    {selectedFile?.type === 'application/pdf' || parsedData?.fileUrl?.toLowerCase().endsWith('.pdf') ? (
                      <iframe src={previewUrl || ''} className="w-full h-full bg-white rounded shadow-lg border-0" title="PDF Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center overflow-auto">
                        <img src={previewUrl || ''} className="max-w-full max-h-full object-contain rounded shadow-lg" alt="Invoice Preview" />
                      </div>
                    )}
                  </div>

                  {/* RESIZER HANDLE */}
                  <div
                    onMouseDown={() => setIsDragging(true)}
                    className={`bg-gray-200 hover:bg-blue-500 z-10 flex items-center justify-center transition-colors shadow-sm
                      ${orientation === 'horizontal' ? 'w-4 cursor-col-resize h-full border-l border-r border-gray-300' : 'h-4 cursor-row-resize w-full border-t border-b border-gray-300'}
                    `}
                    title="Drag to resize"
                  >
                    {orientation === 'horizontal' ? <GripVertical className="text-gray-400" size={12} /> : <GripHorizontal className="text-gray-400" size={12} />}
                  </div>
                </>
              )}

              {/* PANE 2: FORM / DATA (or Main Upload View) */}
              <div
                className={`bg-white overflow-y-auto ${parsedData ? 'flex-1' : 'w-full h-full'}`}
                style={parsedData ? { flexBasis: `${100 - splitRatio}%` } : {}}
              >
                <div className="p-6">
                  {/* ORIGINAL CONTENT START */}
                  {/* File Info & Parsing Status */}
                  <div className="mb-6">
                    {/* Selected File Display */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{selectedFile?.name || 'No file selected'}</p>
                        <p className="text-xs text-gray-500">
                          {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Parsing Status */}
                    {parsing && (
                      <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-blue-700 font-medium">AI is scanning invoice...</span>
                          </div>
                          <span className="text-xs text-blue-600 font-semibold">{parsingProgress.current}/{parsingProgress.total}</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                            style={{ width: `${(parsingProgress.current / parsingProgress.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {parsedData && !parsing && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm text-green-700 font-medium">✓ Parsed successfully! Review the fields below.</span>
                      </div>
                    )}
                  </div>

                  {/* Parsed Data Summary - Only show after successful parsing */}
                  {parsedData && !parsing && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">📄 AI Extracted Data</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Verified by AI</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Vendor</p>
                          <p className="text-base font-semibold text-gray-900">
                            {vendors.find(v => v.id === formData.vendorId)?.name || 'Unknown'}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Invoice Number</p>
                          <p className="text-base font-semibold text-gray-900">{formData.invoiceNumber}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Invoice Date</p>
                          <p className="text-base font-semibold text-gray-900">
                            {new Date(formData.invoiceDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1">Total Amount</p>
                          <p className="text-base font-semibold text-green-600">${Number(formData.totalAmount).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Items Table */}
                      {parsedData.items && parsedData.items.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <h4 className="text-sm font-bold text-gray-900">📦 Scanned Items</h4>
                              {/* Legend */}
                              <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1">
                                  <span className="w-3 h-3 rounded bg-amber-200 inline-block"></span>
                                  <span className="text-amber-700 font-medium">Bulk (invoice)</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="w-3 h-3 rounded bg-blue-200 inline-block"></span>
                                  <span className="text-blue-700 font-medium">Retail units → stock</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="w-3 h-3 rounded bg-green-200 inline-block"></span>
                                  <span className="text-green-700 font-medium">Selling price (editable)</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 font-medium">Extend All Items:</span>
                              {[7, 30, 180, 365].map(days => (
                                <button
                                  key={days}
                                  onClick={() => {
                                    // Always extend from TODAY, not from the item's current expiry
                                    const today = new Date();
                                    const newItems = parsedData.items.map((item: any) => {
                                      const newDate = new Date(today);
                                      newDate.setDate(newDate.getDate() + days);
                                      return {
                                        ...item,
                                        expiryDate: newDate.toISOString().split('T')[0]
                                      };
                                    });
                                    setParsedData({ ...parsedData, items: newItems });
                                  }}
                                  className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg font-semibold shadow-sm"
                                >
                                  +{days}d All
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                            <table className="w-full text-sm min-w-[800px]">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-amber-700 bg-amber-50" title="Cases on invoice">Cases</th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-amber-700 bg-amber-50" title="Retail units per case">Units/Case</th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 bg-blue-50" title="Total retail units added to stock">Retail Units</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Size</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700" title="Cost per retail unit">Cost/Unit</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-green-700" title="Selling price — from Z-report or POS data">Sell Price ✎</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Expires</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Extend By</th>
                                </tr>
                              </thead>
                              <tbody>
                                {parsedData.items.map((item: any, idx: number) => {
                                  const itemDate = item.expiryDate ? new Date(item.expiryDate) : new Date();

                                  return (
                                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                                      <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                                      <td className="px-4 py-3 text-gray-600">{item.category || '-'}</td>

                                      {/* Bulk columns - amber */}
                                      <td className="px-4 py-3 text-center font-mono font-bold text-amber-700 bg-amber-50">
                                        {item.quantity}
                                      </td>
                                      <td className="px-4 py-3 text-center font-mono text-amber-600 bg-amber-50">
                                        {item.unitsPerCase || 1}
                                      </td>

                                      {/* Retail units - blue (what actually goes to stock) */}
                                      <td className="px-4 py-3 text-center font-mono font-bold text-blue-700 bg-blue-50">
                                        {(item.quantity || 1) * (item.unitsPerCase || 1)}
                                      </td>

                                      <td className="px-4 py-3 text-gray-500 text-xs">{item.unitSize || '-'}</td>

                                      <td className="px-4 py-3 text-gray-700 font-mono">
                                        ${Number(item.costPerUnit ?? item.unitPrice ?? 0).toFixed(2)}
                                      </td>

                                      {/* Editable Selling Price — comes from Z-report/POS, not invoice */}
                                      <td className="px-4 py-3">
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          value={item.sellingPrice ?? ''}
                                          placeholder="From Z-report"
                                          onChange={(e) => {
                                            const newItems = [...parsedData.items];
                                            newItems[idx] = { ...newItems[idx], sellingPrice: e.target.value ? parseFloat(e.target.value) : null };
                                            setParsedData({ ...parsedData, items: newItems });
                                          }}
                                          className="w-28 text-xs border border-green-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 bg-green-50"
                                        />
                                      </td>

                                      <td className="px-4 py-3">
                                        <input
                                          type="date"
                                          value={item.expiryDate || ''}
                                          onChange={(e) => {
                                            const newItems = [...parsedData.items];
                                            newItems[idx].expiryDate = e.target.value;
                                            setParsedData({ ...parsedData, items: newItems });
                                          }}
                                          className="text-xs border border-gray-300 rounded px-2 py-1"
                                        />
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                          {[7, 15, 30, 60, 180, 360].map(days => (
                                            <button
                                              key={days}
                                              onClick={() => {
                                                // Always extend from TODAY, not accumulate on existing date
                                                const today = new Date();
                                                const newDate = new Date(today);
                                                newDate.setDate(newDate.getDate() + days);
                                                const newItems = [...parsedData.items];
                                                newItems[idx].expiryDate = newDate.toISOString().split('T')[0];
                                                setParsedData({ ...parsedData, items: newItems });
                                              }}
                                              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded font-medium"
                                            >
                                              +{days}d
                                            </button>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleCreateInvoice}
                      disabled={!formData.vendorId || !formData.invoiceNumber}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg"
                    >
                      💾 Save to Inventory
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
            </div>
          </div>
        </div >
      )}


    </div >
  );
}
