'use client';
import { useState, useRef, useEffect } from 'react';
import { Loader2, UploadCloud, Save, Trash2, Plus, FileText, Truck, Receipt, Calendar, User, MapPin, Globe, Phone, Clock, CheckSquare, Eye, Mail, ChevronRight, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Load PDF.js from CDN for client-side processing without heavy build steps
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ⚠️ REPLACE THIS WITH YOUR REAL TENANT ID FROM SUPABASE
const TENANT_ID = 'b719cc04-38d2-4af8-ae52-1001791aff6f'; 

// --- TYPES ---

type InvoiceItem = {
  id: string; // Temporary UI ID
  product_name: string;
  notes?: string;
  vendor_code?: string;
  upc?: string;
  qty: number;
  unit_cost: number;
  expiry?: string;
};

// Expanded Vendor Data for the new feature
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
  // State
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Data State
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [vendorData, setVendorData] = useState<VendorData>({
    name: '', ein: '', address: '', website: '', email: '', phone: '', fax: '', poc_name: ''
  });
  const [metadata, setMetadata] = useState<InvoiceMetadata>({
    vendor_name: '', invoice_number: '', invoice_date: new Date().toISOString().split('T')[0],
    total_tax: 0, total_transport: 0, total_amount: 0
  });

  // History State
  const [history, setHistory] = useState<InvoiceRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. INITIALIZATION ---

  // Load PDF.js script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Fetch Recent History
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (TENANT_ID.includes('PASTE')) return; // Don't fetch if ID is invalid
    
    const { data } = await supabase
      .from('invoices')
      .select('id, vendor_name, invoice_number, invoice_date, total_amount, created_at, status')
      .eq('tenant_id', TENANT_ID)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setHistory(data);
    setLoadingHistory(false);
  };

  // --- 2. FILE PROCESSING HELPERS ---

  const convertPdfToImages = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          // @ts-ignore - PDFJS is loaded globally via CDN script
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;

          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const images: string[] = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); // Scale up for better OCR
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context!, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg'));
          }
          resolve(images);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProcessingStatus('Initializing...');
    
    const file = files[0];
    let imagesToProcess: string[] = [];

    try {
      if (file.type.includes('pdf')) {
        setProcessingStatus('Converting PDF pages to readable images...');
        imagesToProcess = await convertPdfToImages(file);
      } else {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        imagesToProcess = [base64];
      }

      let aggregatedItems: InvoiceItem[] = [];
      let lastMetadata: Partial<InvoiceMetadata> = {};
      let lastVendorData: Partial<VendorData> = {};

      for (let i = 0; i < imagesToProcess.length; i++) {
        setProcessingStatus(`Scanning Page ${i + 1} of ${imagesToProcess.length}...`);
        
        const res = await fetch('/api/parse-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData: imagesToProcess[i], fileType: 'image' }),
        });
        
        const json = await res.json();
        
        if (json.success) {
            // Items
            const pageItems = json.data.items.map((item: any) => ({
                ...item,
                id: Math.random().toString(36).substr(2, 9),
                expiry: ''
            }));
            aggregatedItems = [...aggregatedItems, ...pageItems];

            // Metadata
            const pageMeta = json.data.metadata || {};
            lastMetadata = {
                vendor_name: pageMeta.vendor_name || lastMetadata.vendor_name,
                invoice_number: pageMeta.invoice_number || lastMetadata.invoice_number,
                invoice_date: pageMeta.invoice_date || lastMetadata.invoice_date,
                total_tax: pageMeta.total_tax || lastMetadata.total_tax,
                total_transport: pageMeta.total_transport || lastMetadata.total_transport,
                total_amount: pageMeta.total_amount || lastMetadata.total_amount,
            };

            // Vendor Data (New)
            const pageVendor = json.data.vendor || {};
            lastVendorData = {
                name: pageVendor.name || lastVendorData.name || pageMeta.vendor_name,
                ein: pageVendor.ein || lastVendorData.ein,
                address: pageVendor.address || lastVendorData.address,
                website: pageVendor.website || lastVendorData.website,
                email: pageVendor.email || lastVendorData.email,
                phone: pageVendor.phone || lastVendorData.phone,
                fax: pageVendor.fax || lastVendorData.fax,
                poc_name: pageVendor.poc_name || lastVendorData.poc_name
            };
        }
      }

      setItems(prev => [...prev, ...aggregatedItems]);
      setMetadata(prev => ({ ...prev, ...lastMetadata }));
      setVendorData(prev => ({ ...prev, ...lastVendorData }));
      setProcessingStatus('Complete!');

    } catch (err: any) {
      console.error(err);
      alert("Scan failed: " + err.message);
    } finally {
      setUploading(false);
      setProcessingStatus('');
    }
  };

  // --- 3. UI ACTIONS ---

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMetadataChange = (field: keyof InvoiceMetadata, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const applyExpiryBatch = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toISOString().split('T')[0];
    setItems(prev => prev.map(item => item.expiry ? item : { ...item, expiry: dateStr }));
  };

  const setItemExpiry = (id: string, days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    updateItem(id, 'expiry', date.toISOString().split('T')[0]);
  };

  // --- 4. SAVE HANDLER (UPSERT VENDOR + SAVE INVOICE) ---

  const handleSave = async () => {
    if (items.length === 0) return alert("No items to save.");
    if (!vendorData.name && !metadata.vendor_name) return alert("Vendor Name is required.");

    // Fallback if vendorData.name is empty but metadata has it
    const finalVendorName = vendorData.name || metadata.vendor_name;

    // Check for Placeholder ID
    if (TENANT_ID.includes('PASTE_YOUR_REAL')) {
        return alert("⚠️ CONFIG ERROR: Please update 'TENANT_ID' in app/admin/invoices/page.tsx with your actual Supabase Tenant ID.");
    }

    // 1. UPSERT VENDOR
    // This connects the invoice products to a specific vendor profile
    const { error: vendorError } = await supabase
        .from('vendors')
        .upsert({
            tenant_id: TENANT_ID,
            name: finalVendorName,
            ein: vendorData.ein,
            shipping_address: vendorData.address,
            website: vendorData.website,
            email: vendorData.email,
            contact_phone: vendorData.phone,
            fax: vendorData.fax,
            poc_name: vendorData.poc_name
        }, { onConflict: 'name' }); // Using Name as key for this MVP

    if (vendorError) {
        console.error("Vendor Save Error:", vendorError);
        // Continue anyway to save invoice
    }

    // 2. SAVE INVOICE RECORD
    const { data: invoiceData, error: invError } = await supabase
        .from('invoices')
        .insert({
            tenant_id: TENANT_ID,
            image_url: 'stored_file_url_placeholder', 
            status: 'completed',
            vendor_name: finalVendorName,
            invoice_number: metadata.invoice_number,
            invoice_date: metadata.invoice_date,
            total_amount: metadata.total_amount,
            line_items_json: items // Store full JSON snapshot
        })
        .select()
        .single();

    if (invError) {
        alert(`Failed to save invoice record: ${invError.message}`);
        return;
    }

    // 3. UPDATE INVENTORY (Via Commit API)
    const res = await fetch('/api/inventory/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tenantId: TENANT_ID,
            items: items.map(i => ({
                name: i.product_name,
                sku: i.vendor_code || i.upc,
                qty: i.qty,
                unit_cost: i.unit_cost,
                expiry: i.expiry
            }))
        })
    });

    if (res.ok) {
        alert("✅ Invoice Processed, Vendor Updated & Stock Added!");
        // Reset Form
        setItems([]);
        setMetadata({
            vendor_name: '', invoice_number: '', invoice_date: new Date().toISOString().split('T')[0],
            total_tax: 0, total_transport: 0, total_amount: 0
        });
        setVendorData({ name: '', ein: '', address: '', website: '', email: '', phone: '', fax: '', poc_name: '' });
        // Refresh History
        fetchHistory();
    } else {
        const err = await res.json();
        alert(`Failed to update inventory: ${err.error || "Unknown Error"}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans min-h-screen bg-gray-50">
      
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-blue-600" />
            Invoice Scanner
          </h1>
          <p className="text-gray-500 mt-1">
            Digitize paper invoices, track costs, and update stock.
          </p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition"
                disabled={uploading}
            >
                {uploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                Scan Invoice (PDF/Img)
            </button>
            <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={handleFiles}
            />
        </div>
      </header>

      {/* PROCESSING STATE INDICATOR */}
      {uploading && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <Loader2 className="animate-spin" />
            <span className="font-bold">{processingStatus}</span>
        </div>
      )}

      {/* --- EDITOR INTERFACE --- */}
      {items.length > 0 && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-6 mb-12">
            
            {/* 1. VENDOR & METADATA CARD */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                     <User size={16} className="text-purple-600"/> 
                     <h3 className="text-sm font-bold text-gray-700 uppercase">Vendor & Invoice Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Row 1: Core Vendor Info */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Company Name</label>
                        <input className="w-full border p-2 rounded bg-purple-50 font-bold" value={vendorData.name || metadata.vendor_name} onChange={e => { setVendorData({...vendorData, name: e.target.value}); setMetadata({...metadata, vendor_name: e.target.value}); }} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Invoice #</label>
                        <input className="w-full border p-2 rounded font-mono" value={metadata.invoice_number} onChange={e => setMetadata({...metadata, invoice_number: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                        <input type="date" className="w-full border p-2 rounded" value={metadata.invoice_date} onChange={e => setMetadata({...metadata, invoice_date: e.target.value})} />
                    </div>

                    {/* Row 2: Extended Vendor Info */}
                    <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-gray-400 mb-1">Address</label>
                         <input className="w-full border p-2 rounded text-sm" placeholder="Street, City, Zip" value={vendorData.address} onChange={e => setVendorData({...vendorData, address: e.target.value})} />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-400 mb-1">Phone</label>
                         <input className="w-full border p-2 rounded text-sm" placeholder="(555) ..." value={vendorData.phone} onChange={e => setVendorData({...vendorData, phone: e.target.value})} />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-400 mb-1">Email / Web</label>
                         <input className="w-full border p-2 rounded text-sm" placeholder="contact@vendor.com" value={vendorData.email || vendorData.website} onChange={e => setVendorData({...vendorData, email: e.target.value})} />
                    </div>
                </div>
                
                {/* Financials Row */}
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100 bg-gray-50/50 p-4 rounded-lg">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Total Tax</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input type="number" className="w-full border p-2 pl-6 rounded-lg font-medium" value={metadata.total_tax} onChange={(e) => handleMetadataChange('total_tax', parseFloat(e.target.value))}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Truck size={12}/> Transport Cost</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input type="number" className="w-full border p-2 pl-6 rounded-lg font-medium" value={metadata.total_transport} onChange={(e) => handleMetadataChange('total_transport', parseFloat(e.target.value))}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Grand Total</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input type="number" className="w-full border p-2 pl-6 rounded-lg font-black text-green-600" value={metadata.total_amount} onChange={(e) => handleMetadataChange('total_amount', parseFloat(e.target.value))}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PRODUCT TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                   <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><CheckSquare size={14} /> Batch Actions</div>
                   <div className="flex gap-2">
                      <button onClick={() => applyExpiryBatch(7)} className="bg-white border hover:bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold">+7 Days</button>
                      <button onClick={() => applyExpiryBatch(30)} className="bg-white border hover:bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold">+30 Days</button>
                      <button onClick={() => applyExpiryBatch(365)} className="bg-white border hover:bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold">+1 Year</button>
                   </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
                        <tr>
                            <th className="p-4">Product Name (Cleaned)</th>
                            <th className="p-4">Codes (SKU/UPC)</th>
                            <th className="p-4 w-24 text-center">Qty</th>
                            <th className="p-4 w-32 text-right">Unit Cost</th>
                            <th className="p-4 w-48">Expiry Date</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 group">
                                <td className="p-4">
                                    <input type="text" className="w-full font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0" value={item.product_name} onChange={(e) => updateItem(item.id, 'product_name', e.target.value)}/>
                                    {item.notes && <div className="text-xs text-orange-500 mt-1 flex items-center gap-1"><span className="bg-orange-100 px-1 rounded">Note:</span> {item.notes}</div>}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <input type="text" placeholder="SKU" className="text-xs font-mono bg-gray-50 border rounded px-1 w-24" value={item.vendor_code || ''} onChange={(e) => updateItem(item.id, 'vendor_code', e.target.value)}/>
                                        <input type="text" placeholder="UPC" className="text-xs font-mono bg-gray-50 border rounded px-1 w-24" value={item.upc || ''} onChange={(e) => updateItem(item.id, 'upc', e.target.value)}/>
                                    </div>
                                </td>
                                <td className="p-4"><input type="number" className="w-full border rounded p-1 text-center font-bold" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value))}/></td>
                                <td className="p-4 text-right"><div className="relative"><span className="absolute left-2 top-1 text-gray-400 text-xs">$</span><input type="number" className="w-full border rounded p-1 pl-4 text-right" value={item.unit_cost} onChange={(e) => updateItem(item.id, 'unit_cost', parseFloat(e.target.value))}/></div></td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <input type="date" className={`w-full border rounded p-1 text-xs ${!item.expiry ? 'border-red-300 bg-red-50' : ''}`} value={item.expiry || ''} onChange={(e) => updateItem(item.id, 'expiry', e.target.value)}/>
                                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => setItemExpiry(item.id, 7)} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-1 rounded text-gray-600">7d</button>
                                           <button onClick={() => setItemExpiry(item.id, 30)} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-1 rounded text-gray-600">30d</button>
                                           <button onClick={() => setItemExpiry(item.id, 365)} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-1 rounded text-gray-600">1y</button>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center"><button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition p-1"><Trash2 size={18}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 bg-gray-50 border-t flex justify-center">
                    <button onClick={() => setItems([...items, { id: Date.now().toString(), product_name: 'New Item', qty: 1, unit_cost: 0 }])} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <Plus size={16}/> Add Manual Row
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-4 pb-20">
                <button onClick={handleSave} className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 flex items-center gap-3 transition transform hover:scale-105">
                    <Save size={24} /> Confirm All & Update Stock
                </button>
            </div>
        </div>
      )}

      {/* --- HISTORY SECTION --- */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
           <Clock className="text-gray-400" /> Recent Scans
        </h2>
        
        {loadingHistory ? (
            <div className="text-sm text-gray-400">Loading history...</div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Vendor</th>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-gray-900">{inv.vendor_name || 'Unknown'}</td>
                                <td className="p-4 font-mono text-xs">{inv.invoice_number || '-'}</td>
                                <td className="p-4 text-right font-bold">${inv.total_amount?.toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <span className="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded-full uppercase font-bold">{inv.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {history.length === 0 && <div className="p-8 text-center text-gray-400">No previous scans found.</div>}
            </div>
        )}
      </div>

    </div>
  );
}