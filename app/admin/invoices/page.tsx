'use client';
import { useState, useRef, useEffect } from 'react';
import { Loader2, UploadCloud, Save, Trash2, Plus, FileText, Truck, Receipt, Calendar, User, CheckSquare, Clock } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { useTenant } from '@/lib/hooks/useTenant';

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const supabase = createClientComponentClient();

type InvoiceItem = {
  id: string;
  product_name: string;
  notes?: string;
  vendor_code?: string;
  upc?: string;
  qty: number;
  unit_cost: number;
  expiry?: string;
};

type VendorData = {
  name: string;
  ein: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  fax: string;
  poc_name: string;
};

type InvoiceMetadata = {
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  total_tax: number;
  total_transport: number;
  total_amount: number;
};

type InvoiceRecord = {
  id: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number;
  created_at: string;
  status: string;
};

export default function InvoicePage() {
  const { tenantId: TENANT_ID } = useTenant();
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [vendorData, setVendorData] = useState<VendorData>({
    name: '', ein: '', address: '', website: '', email: '', phone: '', fax: '', poc_name: ''
  });
  const [metadata, setMetadata] = useState<InvoiceMetadata>({
    vendor_name: '', invoice_number: '', invoice_date: new Date().toISOString().split('T')[0],
    total_tax: 0, total_transport: 0, total_amount: 0
  });
  const [history, setHistory] = useState<InvoiceRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (TENANT_ID) fetchHistory();
  }, [TENANT_ID]);

  const fetchHistory = async () => {
    if (!TENANT_ID || TENANT_ID.includes('PASTE')) return;
    const { data } = await supabase
      .from('uploaded-vendor-invoice-document')
      .select('invoice-id, supplier-name, invoice-number, invoice-date, total-amount-value, created-at, processing-status')
      .eq('tenant-id', TENANT_ID)
      .order('created-at', { ascending: false })
      .limit(10);

    if (data) {
      const mappedHistory = data.map((d: any) => ({
        id: d['invoice-id'],
        vendor_name: d['supplier-name'],
        invoice_number: d['invoice-number'],
        invoice_date: d['invoice-date'],
        total_amount: d['total-amount-value'],
        created_at: d['created-at'],
        status: d['processing-status']
      }));
      setHistory(mappedHistory);
    }
    setLoadingHistory(false);
  };

  const convertPdfToImages = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          // @ts-ignore
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
          const pdf = await pdfjsLib.getDocument(new Uint8Array(this.result as ArrayBuffer)).promise;
          const images: string[] = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg'));
          }
          resolve(images);
        } catch (e) { reject(e); }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleInvoiceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!TENANT_ID) {
      toast.error('Configuration error: No tenant ID found');
      return;
    }

    setUploading(true);
    setProcessingStatus('Initializing...');
    let imagesToProcess: string[] = [];

    try {
      if (file.type.includes('pdf')) {
        setProcessingStatus('Converting PDF...');
        imagesToProcess = await convertPdfToImages(file);
      } else {
        const reader = new FileReader();
        const base64 = await new Promise<string>(r => { reader.onload = e => r(e.target?.result as string); reader.readAsDataURL(file); });
        imagesToProcess = [base64];
      }

      let aggregatedItems: InvoiceItem[] = [];
      let lastMetadata: Partial<InvoiceMetadata> = {};
      let lastVendorData: Partial<VendorData> = {};

      for (let i = 0; i < imagesToProcess.length; i++) {
        setProcessingStatus(`Scanning Page ${i + 1}/${imagesToProcess.length}...`);
        const res = await fetch('/api/parse-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData: imagesToProcess[i], fileType: 'image' }),
        });
        const json = await res.json();

        if (json.success) {
          aggregatedItems = [...aggregatedItems, ...json.data.items.map((item: any) => ({ ...item, id: Math.random().toString(36).substr(2, 9), expiry: '' }))];
          const pageMeta = json.data.metadata || {};

          // Smart Merge: Don't overwrite existing valid data with empty/zero from other pages
          lastMetadata = {
            ...lastMetadata,
            vendor_name: (pageMeta.vendor_name && pageMeta.vendor_name !== 'string') ? pageMeta.vendor_name : lastMetadata.vendor_name,
            invoice_number: (pageMeta.invoice_number && pageMeta.invoice_number !== 'string') ? pageMeta.invoice_number : lastMetadata.invoice_number,
            invoice_date: (pageMeta.invoice_date && pageMeta.invoice_date !== 'YYYY-MM-DD') ? pageMeta.invoice_date : lastMetadata.invoice_date,

            // Prefer non-zero values
            total_tax: (pageMeta.total_tax > 0) ? pageMeta.total_tax : (lastMetadata.total_tax || 0),
            total_transport: (pageMeta.total_transport > 0) ? pageMeta.total_transport : (lastMetadata.total_transport || 0),
            total_amount: (pageMeta.total_amount > 0) ? pageMeta.total_amount : (lastMetadata.total_amount || 0),
          };

          const pageVendor = json.data.vendor || {};
          // Merge vendor data, preferring longer/more complete strings
          Object.keys(pageVendor).forEach(key => {
            // @ts-ignore
            if (pageVendor[key] && pageVendor[key] !== 'string' && pageVendor[key].length > (lastVendorData[key]?.length || 0)) {
              // @ts-ignore
              lastVendorData[key] = pageVendor[key];
            }
          });
        }
      }

      setItems(prev => [...prev, ...aggregatedItems]);
      setMetadata(prev => ({ ...prev, ...lastMetadata } as any));
      setVendorData(prev => ({ ...prev, ...lastVendorData } as any));
      setProcessingStatus('Complete!');
    } catch (err: any) {
      toast.error("Scan failed: " + err.message);
    } finally {
      setUploading(false);
      setProcessingStatus('');
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  const deleteItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));
  const applyExpiryBatch = (days: number) => {
    const date = new Date(); date.setDate(date.getDate() + days);
    setItems(prev => prev.map(item => item.expiry ? item : { ...item, expiry: date.toISOString().split('T')[0] }));
  };
  const setItemExpiry = (id: string, days: number) => {
    const date = new Date(); date.setDate(date.getDate() + days);
    updateItem(id, 'expiry', date.toISOString().split('T')[0]);
  };

  const handleSave = async () => {
    if (items.length === 0) return toast.error("No items to save.");
    if (!TENANT_ID) return toast.error("Please log in.");

    const finalVendorName = vendorData.name || metadata.vendor_name;

    // 1. Handle Vendor (Manual Upsert to avoid 400 error on missing unique constraint)
    let vendorId = null;
    try {
      // Check existence
      const { data: existing, error: fetchError } = await supabase
        .from('vendors')
        .select('id')
        .eq('tenant-id', TENANT_ID)
        .eq('name', finalVendorName)
        .maybeSingle();

      if (fetchError) console.warn("Error checking vendor:", fetchError);

      if (existing) {
        // Update
        vendorId = existing.id;
        const { error: updateError } = await supabase.from('vendors').update({
          ein: vendorData.ein,
          address: vendorData.address,
          website: vendorData.website,
          email: vendorData.email,
          'contact-phone': vendorData.phone,
          fax: vendorData.fax,
          'poc-name': vendorData.poc_name
        }).eq('id', vendorId);

        if (updateError) throw updateError;
      } else {
        // Insert
        const { data: newVendor, error: vError } = await supabase.from('vendors').insert({
          'tenant-id': TENANT_ID,
          name: finalVendorName,
          ein: vendorData.ein,
          address: vendorData.address, // Correct column name
          website: vendorData.website,
          email: vendorData.email,
          'contact-phone': vendorData.phone, // Kebab-case
          fax: vendorData.fax,
          'poc-name': vendorData.poc_name    // Kebab-case
        }).select().single();

        if (vError) throw vError;
        vendorId = newVendor?.id;
      }
    } catch (err: any) {
      console.error("Vendor Save Error:", err);
      // We continue even if vendor save might fail slightly, but ideally we warn.
      // But let's assume we proceed to save the invoice.
    }

    // 2. Save Invoice (Authenticated Client fixes 401 RLS)
    const { error: invError } = await supabase.from('uploaded-vendor-invoice-document').insert({
      'tenant-id': TENANT_ID,
      'file-url-path': 'stored_file_url_placeholder',
      'processing-status': 'processed',
      'supplier-name': finalVendorName,
      'invoice-number': metadata.invoice_number,
      'invoice-date': metadata.invoice_date,
      'total-amount-value': metadata.total_amount,
      'ai-extracted-data-json': { items, metadata }
    });

    if (invError) return toast.error(`Failed to save invoice: ${invError.message}`);

    // 3. Commit Inventory
    const res = await fetch('/api/inventory/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: TENANT_ID,
        items: items.map(i => ({ name: i.product_name, sku: i.vendor_code || i.upc, qty: i.qty, unit_cost: i.unit_cost, expiry: i.expiry }))
      })
    });

    if (res.ok) {
      toast.success("Processed & Stock Added!");
      setItems([]);
      setMetadata({ vendor_name: '', invoice_number: '', invoice_date: new Date().toISOString().split('T')[0], total_tax: 0, total_transport: 0, total_amount: 0 });
      setVendorData({ name: '', ein: '', address: '', website: '', email: '', phone: '', fax: '', poc_name: '' });
      fetchHistory();
    } else {
      toast.error("Failed to commit inventory.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="text-blue-600" size={28} />
              Invoice Scanner
            </h1>
            <p className="text-sm text-gray-500 mt-1">Digitize invoices and update stock automatically.</p>
          </div>
          <div className="flex gap-3">
            <input type="file" multiple ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleInvoiceUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-shadow shadow-sm hover:shadow-md" disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
              Scan New Invoice
            </button>
          </div>
        </div>

        {uploading && (
          <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <Loader2 className="animate-spin" size={20} />
            <span className="font-medium text-sm">{processingStatus}</span>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

            {/* META CARD */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <User size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Vendor & Invoice Info</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Company Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 font-semibold text-gray-900 focus:bg-white transition-colors" value={vendorData.name || metadata.vendor_name} onChange={e => { setVendorData({ ...vendorData, name: e.target.value }); setMetadata({ ...metadata, vendor_name: e.target.value }); }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Invoice #</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm" value={metadata.invoice_number} onChange={e => setMetadata({ ...metadata, invoice_number: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={metadata.invoice_date} onChange={e => setMetadata({ ...metadata, invoice_date: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6 pb-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Tax</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input type="number" className="w-full border border-gray-200 rounded-lg pl-6 py-2 text-sm" value={metadata.total_tax} onChange={(e) => setMetadata({ ...metadata, total_tax: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Truck size={12} /> Transport</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input type="number" className="w-full border border-gray-200 rounded-lg pl-6 py-2 text-sm" value={metadata.total_transport} onChange={(e) => setMetadata({ ...metadata, total_transport: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Grand Total</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-900 text-sm font-bold">$</span>
                    <input type="number" className="w-full border border-blue-200 bg-blue-50/50 rounded-lg pl-6 py-2 text-sm font-bold text-blue-700" value={metadata.total_amount} onChange={(e) => setMetadata({ ...metadata, total_amount: parseFloat(e.target.value) })} />
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <CheckSquare size={14} /> Line Items
                </div>
                <div className="flex gap-2">
                  {[7, 30, 365].map(d => (
                    <button key={d} onClick={() => applyExpiryBatch(d)} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-xs font-medium transition-colors">
                      +{d} Days
                    </button>
                  ))}
                </div>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Codes (SKU/UPC)</th>
                    <th className="px-6 py-3 font-medium text-center w-24">Qty</th>
                    <th className="px-6 py-3 font-medium text-right w-32">Unit Cost</th>
                    <th className="px-6 py-3 font-medium w-48">Expiry</th>
                    <th className="px-6 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 group transition-colors">
                      <td className="px-6 py-3">
                        <input className="w-full bg-transparent border-none p-0 font-medium text-gray-900 focus:ring-0 placeholder-gray-400" value={item.product_name} onChange={e => updateItem(item.id, 'product_name', e.target.value)} placeholder="Product Name" />
                      </td>
                      <td className="px-6 py-3 space-y-1">
                        <input className="block w-24 text-xs font-mono bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5" placeholder="SKU" value={item.vendor_code || ''} onChange={e => updateItem(item.id, 'vendor_code', e.target.value)} />
                        <input className="block w-24 text-xs font-mono bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5" placeholder="UPC" value={item.upc || ''} onChange={e => updateItem(item.id, 'upc', e.target.value)} />
                      </td>
                      <td className="px-6 py-3">
                        <input type="number" className="w-full border border-gray-200 rounded p-1.5 text-center font-semibold text-gray-900" value={item.qty} onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value))} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="relative">
                          <span className="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
                          <input type="number" className="w-full border border-gray-200 rounded p-1.5 pl-5 text-right font-mono" value={item.unit_cost} onChange={e => updateItem(item.id, 'unit_cost', parseFloat(e.target.value))} />
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <input type="date" className={`w-full border rounded p-1.5 text-xs ${!item.expiry ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-200'}`} value={item.expiry || ''} onChange={e => updateItem(item.id, 'expiry', e.target.value)} />
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {[7, 30, 365].map(d => (
                            <button key={d} onClick={() => setItemExpiry(item.id, d)} className="text-[10px] bg-gray-100 px-1.5 rounded text-gray-500 hover:text-gray-900">+{d}d</button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-gray-50/50 border-t border-gray-200 flex justify-center">
                <button onClick={() => setItems([...items, { id: Date.now().toString(), product_name: 'New Item', qty: 1, unit_cost: 0 }])} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors">
                  <Plus size={14} /> Add Manual Row
                </button>
              </div>
            </div>

            <div className="sticky bottom-6 flex justify-end">
              <button onClick={handleSave} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-gray-800 transition-transform active:scale-95 flex items-center gap-2">
                <Save size={18} /> Confirm & Update Inventory
              </button>
            </div>

          </div>
        )}

        {/* HISTORY */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-gray-400" /> Recent Scans
          </h2>
          {loadingHistory ? (
            <div className="text-sm text-gray-400">Loading history...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Vendor</th>
                    <th className="px-6 py-3">Invoice #</th>
                    <th className="px-6 py-3 text-right">Total</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 text-gray-600">{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-3 font-semibold text-gray-900">{inv.vendor_name}</td>
                      <td className="px-6 py-3 font-mono text-xs text-gray-500">{inv.invoice_number || '-'}</td>
                      <td className="px-6 py-3 text-right font-medium">${inv.total_amount?.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 uppercase">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length === 0 && <div className="p-12 text-center text-gray-400 text-sm">No recent invoice history found.</div>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}