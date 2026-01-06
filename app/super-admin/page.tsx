'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Database, Store, Truck, Sparkles, Search,
  CheckCircle, AlertCircle, RefreshCw, Globe, UploadCloud, FileSpreadsheet, X, Image as ImageIcon, FileText, Activity, ExternalLink, Box, Layers, Link as LinkIcon, ArrowUp, Loader2, FileWarning, Tag
} from 'lucide-react';
import * as XLSX from 'xlsx'; // Requires: npm install xlsx

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type GlobalProduct = {
  id: string;
  name: string;
  upc_ean: string;
  image_url: string;
  manufacturer: string;
  ai_enriched_at: string | null;
  source_type: string;
  category: string;
  subcategory: string; // New
  target_demographic: string;
  tags: string[]; // New
  description?: string;
  nutrients_json?: any;
  images?: string[];
  source_url?: string;

  // UOM & Linking Logic
  uom: string;
  pack_quantity: number;
  base_product_id?: string | null;
  base_product_name?: string;
};

type Tenant = {
  id: string;
  name: string;
  type: 'retailer' | 'supplier';
  status: string;
  created_at: string;
};

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'tenants'>('products');
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GlobalProduct | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: prodData } = await supabase
      .from('global_products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: tenantData } = await supabase
      .from('retail-store-tenant')
      .select('*')
      .order('created_at', { ascending: false });

    if (prodData) {
      const mappedProducts = prodData.map((p: any) => {
        const baseProd = prodData.find((b: any) => b.id === p.base_product_id);
        return {
          ...p,
          description: p.description || "No description available.",
          images: p.image_url ? [p.image_url] : [],
          uom: p.uom || 'Unit',
          pack_quantity: p.pack_quantity || 1,
          base_product_name: baseProd ? baseProd.name : null,
          subcategory: p.subcategory || 'General',
          tags: p.tags || []
        };
      });
      setProducts(mappedProducts);
    }
    if (tenantData) setTenants(tenantData as any);
    setLoading(false);
  }

  // --- ACTIONS ---

  const handleLinkToBulk = async (singleUnitId: string, bulkPackId: string) => {
    const { error } = await supabase
      .from('global_products')
      .update({ base_product_id: singleUnitId })
      .eq('id', bulkPackId);

    if (error) {
      alert("Failed to link products.");
      return;
    }

    const singleUnitName = products.find(p => p.id === singleUnitId)?.name;

    setProducts(prev => prev.map(p => {
      if (p.id === bulkPackId) {
        return { ...p, base_product_id: singleUnitId, base_product_name: singleUnitName };
      }
      return p;
    }));

    alert("Success! The Bulk Pack now recognizes this item as its base unit.");
    setIsLinking(false);
  };

  // --- REAL FILE PARSING ENGINE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security: Limit file size to mitigate xlsx vulnerability (DoS prevention)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert('File too large. Maximum size is 10MB for security.');
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setImporting(true);
    const fileType = file.name.split('.').pop()?.toLowerCase();

    // Helper: Map raw row object to GlobalProduct
    const mapRowToProduct = (row: any): Partial<GlobalProduct> => {
      // Smart Key matching (case-insensitive fuzzy match)
      const keys = Object.keys(row);
      const getKey = (match: string) => keys.find(k => k.toLowerCase().includes(match));

      const name = row[getKey('name') || getKey('product') || getKey('item') || ''] || '';
      if (!name) return {};

      return {
        name: name,
        upc_ean: row[getKey('upc') || getKey('ean') || getKey('code') || '']?.toString() || null,
        manufacturer: row[getKey('manuf') || getKey('brand') || ''] || '',
        category: row[getKey('cat') || getKey('dept') || ''] || 'General',
        subcategory: row[getKey('sub') || ''] || 'General',
        uom: row[getKey('uom') || getKey('unit') || ''] || 'Unit',
        pack_quantity: parseInt(row[getKey('pack') || getKey('qty') || ''] || '1') || 1,
        target_demographic: row[getKey('demo') || getKey('race') || ''] || 'General',
        source_type: `${fileType}_import`
      };
    };

    try {
      let extractedItems: Partial<GlobalProduct>[] = [];

      // 1. EXCEL (.xlsx, .xls) - Client Side
      if (fileType === 'xlsx' || fileType === 'xls') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        extractedItems = jsonData.map(mapRowToProduct).filter(p => p.name);
      }

      // 2. CSV - Client Side
      else if (fileType === 'csv') {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]+/g, ''));

        extractedItems = lines.slice(1).map(line => {
          const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (!values || values.length < headers.length) return {};

          const row: any = {};
          headers.forEach((h, i) => row[h] = values[i]?.replace(/^"|"$/g, '').trim());
          return mapRowToProduct(row);
        }).filter(p => p.name);
      }

      // 3. PDF - Server Side AI Simulation
      else if (fileType === 'pdf') {
        // For prototype, we simulate extraction. Real app needs OCR.
        // We will simulate finding PDF-specific items
        setTimeout(() => {
          const pdfItems: Partial<GlobalProduct>[] = [
            { name: "Simulated PDF Item 1", category: "General", source_type: "pdf_import" },
            { name: "Simulated PDF Item 2", category: "General", source_type: "pdf_import" }
          ];
          processExtractedItems(pdfItems);
          setImporting(false);
        }, 1500);
        return;
      }

      if (fileType !== 'pdf') {
        processExtractedItems(extractedItems);
      }

    } catch (error) {
      console.error("File Parse Error:", error);
      alert("Failed to parse file. Please ensure it is a valid CSV or Excel file.");
      setImporting(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processExtractedItems = (items: Partial<GlobalProduct>[]) => {
    // DEDUPLICATION & MERGE
    const newUniqueProducts = items.filter(newP => {
      const exists = products.some(existingP =>
        (newP.upc_ean && existingP.upc_ean === newP.upc_ean) ||
        (existingP.name.toLowerCase() === newP.name?.toLowerCase())
      );
      return !exists;
    });

    // Add IDs and defaults
    const finalProducts = newUniqueProducts.map(p => ({
      ...p,
      id: `imported-${Date.now()}-${Math.random()}`,
      image_url: '',
      ai_enriched_at: null,
      description: '',
      images: [],
      nutrients_json: {},
      tags: []
    } as GlobalProduct));

    // Update State
    setProducts(prev => [...finalProducts, ...prev]);
    setImporting(false);

    alert(`Import Successful!\n• Items Found: ${items.length}\n• New Added: ${finalProducts.length}\n• Duplicates Skipped: ${items.length - finalProducts.length}`);
  };

  const handleAiEnrich = async (product: GlobalProduct) => {
    setEnriching(product.id);
    try {
      const response = await fetch('/api/ai/enrich-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: product.name, upc: product.upc_ean })
      });

      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Failed to enrich");

      const enrichedData = json.data;
      const mainImage = product.image_url || `https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`;

      const updates = {
        manufacturer: enrichedData.manufacturer,
        description: enrichedData.description,
        category: enrichedData.category,
        target_demographic: enrichedData.target_demographic,
        nutrients_json: enrichedData.nutrients_json,
        ai_enriched_at: new Date().toISOString(),
        image_url: enrichedData.image_url || mainImage,
        source_url: enrichedData.source_url,
        uom: enrichedData.uom,
        pack_quantity: enrichedData.pack_quantity,
        // Map new fields if AI returns them, or keep defaults
        subcategory: product.subcategory || 'General',
        tags: product.tags || []
      };

      if (!product.id.startsWith('imported-')) {
        await supabase.from('global_products').update(updates).eq('id', product.id);
      }

      const updatedProduct = {
        ...product,
        ...updates,
        images: [enrichedData.image_url || mainImage]
      };

      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));

      if (selectedProduct?.id === product.id) {
        setSelectedProduct(updatedProduct);
      }
      alert(`✅ ${product.name} enriched with live data!`);
    } catch (error: any) {
      console.error(error);
      alert("Enrichment Failed: " + error.message);
    } finally {
      setEnriching(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Database className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Master Data Console</h1>
              <p className="text-xs text-gray-400">Super Admin Access</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Global Catalog</button>
            <button onClick={() => setActiveTab('tenants')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'tenants' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Tenant Network</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Total SKUs</div>
            <div className="text-2xl font-black text-white">{products.length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Enriched by AI</div>
            <div className="text-2xl font-black text-blue-400">{products.filter(p => p.ai_enriched_at).length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Active Retailers</div>
            <div className="text-2xl font-black text-green-400">{tenants.filter(t => t.type === 'retailer').length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-xs font-bold uppercase mb-1">Suppliers</div>
            <div className="text-2xl font-black text-purple-400">{tenants.filter(t => t.type === 'supplier').length}</div>
          </div>
        </div>

        {/* TAB: GLOBAL PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="font-bold flex items-center gap-2"><Globe size={18} /> Global Product Database</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2 text-gray-500" size={16} />
                  <input type="text" placeholder="Search UPC, Name..." className="bg-gray-900 border border-gray-600 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-64" />
                </div>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv, .xls, .xlsx, .pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  {importing ? <RefreshCw className="animate-spin" size={16} /> : <FileSpreadsheet size={16} />} Import Data
                </button>
              </div>
            </div>

            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900/50 text-gray-500 uppercase text-xs font-bold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category & Tags</th>
                  <th className="p-4">UOM / Relationship</th>
                  <th className="p-4">Data Quality</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((p) => {
                  const linkedBase = products.find(base => p.base_product_id === base.id);

                  return (
                    <tr key={p.id} className="hover:bg-gray-700/50 transition cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600 shrink-0">
                          {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-600">IMG</div>}
                        </div>
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{p.upc_ean || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{p.category} <span className="text-gray-500 text-xs">/ {p.subcategory}</span></div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.tags?.slice(0, 2).map(t => (
                            <span key={t} className="text-[10px] bg-blue-900/40 text-blue-300 px-1.5 rounded border border-blue-800">{t}</span>
                          ))}
                          {(p.tags?.length || 0) > 2 && <span className="text-[10px] text-gray-500">+{p.tags!.length - 2} more</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-white">
                            <Layers size={14} className="text-purple-400" />
                            <span className="font-mono">{p.pack_quantity > 1 ? `1 ${p.uom} = ${p.pack_quantity} Units` : `Single Unit`}</span>
                          </div>
                          {linkedBase && (
                            <div className="flex items-center gap-1 text-xs text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded w-fit border border-blue-900">
                              <LinkIcon size={10} /> Base: {linkedBase.name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {p.ai_enriched_at ? <div className="flex items-center gap-1 text-green-400 text-xs font-bold"><Sparkles size={14} /> AI Enriched</div> : <div className="flex items-center gap-1 text-gray-500 text-xs"><AlertCircle size={14} /> Basic Data</div>}
                      </td>
                      <td className="p-4 text-right">
                        {!p.ai_enriched_at && (
                          <button onClick={(e) => { e.stopPropagation(); handleAiEnrich(p); }} disabled={!!enriching} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ml-auto">
                            {enriching === p.id ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />} Enrich
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: TENANTS */}
        {activeTab === 'tenants' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><Store size={18} /> Tenant Network</h2>
            </div>
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900/50 text-gray-500 uppercase text-xs font-bold">
                <tr><th className="p-4">Tenant Name</th><th className="p-4">Type</th><th className="p-4">Joined Date</th><th className="p-4 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-700/50 transition">
                    <td className="p-4 font-bold text-white">{t.name}</td>
                    <td className="p-4">{t.type === 'retailer' ? <div className="flex items-center gap-2 text-green-400"><Store size={16} /> Retailer</div> : <div className="flex items-center gap-2 text-purple-400"><Truck size={16} /> Supplier</div>}</td>
                    <td className="p-4 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right"><span className="bg-green-900/20 text-green-400 border border-green-800 px-2 py-1 rounded text-xs font-bold uppercase">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- PRODUCT DETAILS MODAL --- */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-gray-800 w-full max-w-4xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

              <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-gray-900/50">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-600 shrink-0">
                    {selectedProduct.image_url ? <img src={selectedProduct.image_url} className="w-full h-full object-contain" /> : <div className="text-gray-400 text-xs">No Image</div>}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                    <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Store size={14} /> {selectedProduct.manufacturer || 'Unknown Manufacturer'}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-blue-900/30 text-blue-400 border border-blue-800 px-2 py-1 rounded text-xs font-bold">{selectedProduct.category} &rsaquo; {selectedProduct.subcategory}</span>
                      {selectedProduct.tags?.map(t => (
                        <span key={t} className="bg-purple-900/30 text-purple-400 border border-purple-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Tag size={10} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSelectedProduct(null); setIsLinking(false); }} className="text-gray-400 hover:text-white transition"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">

                {/* UOM & RELATIONSHIP CONFIG */}
                <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-600 mb-6">
                  <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
                    <Box size={16} className="text-blue-400" /> Unit Relationship Engine
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Pack Configuration</label>
                      <div className="flex gap-2 items-center text-white font-mono text-lg">
                        <span>1 {selectedProduct.uom}</span>
                        <span className="text-gray-500">=</span>
                        <span className="bg-gray-700 px-3 py-1 rounded">{selectedProduct.pack_quantity}</span>
                        <span>Base Units</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                        {selectedProduct.pack_quantity === 1 ? 'Link TO Bulk Pack' : 'Contains Base Unit'}
                      </label>

                      {/* REVERSED LOGIC: Only allow Single Units to search for Bulk Parents */}
                      {selectedProduct.pack_quantity === 1 ? (
                        <div>
                          {!isLinking ? (
                            <button onClick={() => setIsLinking(true)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2">
                              <ArrowUp size={14} /> Link to Bulk / Case
                            </button>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Search for Case/Box product..."
                                className="w-full bg-gray-900 border border-gray-500 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                              />
                              {/* List only BULK items */}
                              <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 mt-1 rounded shadow-xl z-50 max-h-40 overflow-y-auto">
                                {products
                                  .filter(p => p.id !== selectedProduct.id && p.pack_quantity > 1)
                                  .slice(0, 5)
                                  .map(p => (
                                    <div
                                      key={p.id}
                                      onClick={() => handleLinkToBulk(selectedProduct.id, p.id)}
                                      className="p-2 hover:bg-blue-600 cursor-pointer text-xs text-white"
                                    >
                                      {p.name} ({p.uom} of {p.pack_quantity})
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic mt-2">
                          This is a Bulk item. Link it by editing the Single Unit.
                          {selectedProduct.base_product_name && <div className="text-green-400 mt-1 font-bold">Current Base: {selectedProduct.base_product_name}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DETAILED INFO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* LEFT: IMAGES */}
                  <div className="col-span-1 space-y-4">
                    <div className="aspect-square bg-white rounded-xl border border-gray-700 flex items-center justify-center overflow-hidden">
                      {selectedProduct.image_url ? <img src={selectedProduct.image_url} className="w-full h-full object-contain" /> : <ImageIcon size={48} className="text-gray-300" />}
                    </div>
                    {selectedProduct.images && selectedProduct.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.map((img, i) => (
                          <div key={i} className="aspect-square bg-gray-700 rounded-lg overflow-hidden border border-gray-600 cursor-pointer hover:border-blue-500">
                            <img src={img} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: TEXT DETAILS */}
                  <div className="col-span-2 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><FileText size={14} /> Description</h3>
                      <p className="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-700">{selectedProduct.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Activity size={14} /> Nutrition & Specs</h3>
                      {selectedProduct.nutrients_json ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(selectedProduct.nutrients_json).map(([key, val]: any) => (
                            <div key={key} className="bg-gray-700 p-2 rounded text-center">
                              <div className="text-[10px] text-gray-400 uppercase font-bold">{key}</div>
                              <div className="text-white font-mono text-sm">{val}</div>
                            </div>
                          ))}
                        </div>
                      ) : <div className="text-sm text-gray-500 italic">No nutritional data enriched yet.</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 mt-4">
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">UPC / EAN</label><div className="text-white font-mono bg-black/30 px-2 py-1 rounded w-fit">{selectedProduct.upc_ean || 'N/A'}</div></div>
                      <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Authentic Source</label>{selectedProduct.source_url ? <a href={selectedProduct.source_url} target="_blank" className="text-blue-400 text-sm hover:underline flex items-center gap-1">View Source <ExternalLink size={12} /></a> : <div className="text-gray-500 text-sm">Not Available</div>}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex justify-end gap-3">
                <button onClick={() => { setSelectedProduct(null); setIsLinking(false); }} className="px-6 py-2 rounded-lg text-sm font-bold bg-gray-700 hover:bg-gray-600 text-white transition">Close</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}