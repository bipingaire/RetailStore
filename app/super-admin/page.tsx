'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Database, Store, Truck, Sparkles, Search,
  CheckCircle, AlertCircle, RefreshCw, Globe, UploadCloud, FileSpreadsheet, X, Image as ImageIcon, FileText, Activity, ExternalLink, Box, Layers, Link as LinkIcon, ArrowUp, ArrowRight, ChevronRight, Loader2, FileWarning, Tag, MessageSquare, ThumbsUp, ThumbsDown, Lock, DollarSign, Receipt, TrendingUp, Bell, Plus, Settings
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

type GlobalProduct = {
  id: string; // SKU
  name: string;
  upc_ean: string;
  image_url: string;
  manufacturer: string;
  ai_enriched_at: string | null;
  source_type: string;
  category: string;
  subcategory: string;
  target_demographic: string;
  tags: string[];
  description?: string;
  nutrients_json?: any;
  images?: string[];
  source_url?: string;
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
  subdomain?: string;
  subscription_tier?: string;
  is_active: boolean;
};

type PendingItem = {
  "pending-id": string;
  "product-name": string;
  "upc-ean-code": string;
  "brand-name": string;
  "category-name": string;
  "description-text": string;
  "image-url": string;
  "ai-confidence-score": number;
  "added-by-user-id": string;
  "tenant-id": string;
  "created-at": string;
  "tenant"?: { "store-name": string };
};

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'tenants' | 'pending' | 'website' | 'revenue' | 'categories' | 'taxes'>('products');
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<GlobalProduct | null>(null);
  const [editedProduct, setEditedProduct] = useState<GlobalProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [websiteConfig, setWebsiteConfig] = useState({ domain: 'retailstore.com', ssl: true, dns: true });
  const [revenueData, setRevenueData] = useState<{
    subscriptionTiers: { free: number; beta: number; pro: number; enterprise: number };
    totalEarnings: number;
    receipts: any[];
  }>({ subscriptionTiers: { free: 0, beta: 0, pro: 0, enterprise: 0 }, totalEarnings: 0, receipts: [] });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 20;

  // --- Categories State ---
  interface GlobalCategory { 'category-id': string; 'category-name': string; description: string | null; 'is-active': boolean; }
  const [catList, setCatList] = useState<GlobalCategory[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catSaving, setCatSaving] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // --- Tax State ---
  interface GlobalTaxRule { 'tax-rule-id': string; state: string; 'target-type': string; 'target-value': string; 'tax-rate': number; 'is-active': boolean; }
  const [taxRules, setTaxRules] = useState<GlobalTaxRule[]>([]);
  const [taxCategories, setTaxCategories] = useState<any[]>([]);
  const [taxLoading, setTaxLoading] = useState(false);
  const [taxSaving, setTaxSaving] = useState(false);
  const [newTaxState, setNewTaxState] = useState('');
  const [newTaxCategory, setNewTaxCategory] = useState('');
  const [newTaxRate, setNewTaxRate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'categories') loadCategories();
    if (activeTab === 'taxes') loadTaxData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);

    try {
      const data = await apiClient.get('/super-admin/dashboard-data');

      // Map Backend Data to Frontend Types

      // products
      const mappedProducts = data.products.map((p: any) => ({
        id: p.sku,
        name: p.productName,
        upc_ean: p.sku,
        image_url: p.imageUrl,
        manufacturer: 'Unknown', // Not in SharedCatalog currently
        category: p.category || 'General',
        description: p.description || "No description available.",
        images: p.imageUrl ? [p.imageUrl] : [],
        uom: 'Unit',
        pack_quantity: 1,
        source_type: 'network',
        ai_enriched_at: null, // Logic for enrichment needed
        tags: [],
        subcategory: 'General',
        target_demographic: 'General',
      }));
      setProducts(mappedProducts);

      // tenants
      const mappedTenants = data.tenants.map((t: any) => ({
        id: t.id,
        name: t.storeName,
        type: 'retailer', // Default logic
        status: t.isActive ? 'Active' : 'Inactive',
        created_at: t.createdAt,
        subdomain: t.subdomain,
        subscription_tier: t.subscriptionTier,
        is_active: t.isActive,
      }));
      setTenants(mappedTenants);

      // pendingItems
      const mappedPending = data.pendingItems.map((i: any) => ({
        "pending-id": i.id,
        "product-name": i.productName,
        "upc-ean-code": i.upcEanCode,
        "brand-name": i.brandName,
        "category-name": i.categoryName,
        "description-text": i.descriptionText,
        "image-url": i.imageUrl,
        "ai-confidence-score": i.aiConfidenceScore,
        "added-by-user-id": i.addedByUserId,
        "tenant-id": i.tenantId,
        "created-at": i.createdAt,
        "tenant": { "store-name": i.tenant?.storeName || 'Unknown Store' },
      }));
      setPendingItems(mappedPending);

      // Website Config
      if (data.websiteConfig) {
        setWebsiteConfig({
          domain: data.websiteConfig.primaryDomain,
          ssl: data.websiteConfig.sslEnabled,
          dns: data.websiteConfig.dnsConfigured,
        });
      }

      // Revenue
      if (data.revenueData) {
        const tiers = { free: 0, beta: 0, pro: 0, enterprise: 0 };
        data.revenueData.subscriptions.forEach((sub: any) => {
          if (tiers[sub.planType as keyof typeof tiers] !== undefined) {
            tiers[sub.planType as keyof typeof tiers]++;
          }
        });

        const earnings = data.revenueData.subscriptions.reduce((sum: number, sub: any) => sum + Number(sub.monthlyPrice), 0);

        const mappedReceipts = data.revenueData.transactions.map((tx: any) => ({
          "transaction-id": tx.id,
          "amount": tx.amount,
          "transaction-date": tx.transactionDate,
          "status": tx.status,
          "payment-method": tx.paymentMethod,
          "description": tx.description,
          "retail-store-tenant": { "store-name": tx.tenant?.storeName || 'Unknown' }
        }));

        setRevenueData({
          subscriptionTiers: tiers,
          totalEarnings: earnings,
          receipts: mappedReceipts
        });
      }

    } catch (err) {
      console.error("Data load failed:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  // --- CATEGORIES HANDLERS ---
  async function loadCategories() {
    setCatLoading(true);
    try {
      const data = await apiClient.get('/categories/global');
      setCatList(data.map((c: any) => ({ 'category-id': c.id, 'category-name': c.name, description: c.description, 'is-active': c.isActive })));
    } catch (e) { toast.error('Failed to load categories'); }
    finally { setCatLoading(false); }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSaving(true);
    try {
      await apiClient.post('/categories/global', { name: newCatName.trim(), description: newCatDesc.trim() || undefined });
      setNewCatName(''); setNewCatDesc('');
      await loadCategories();
      toast.success('Category added!');
    } catch (err: any) { toast.error('Failed to add category: ' + err.message); }
    finally { setCatSaving(false); }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    try { await apiClient.delete(`/categories/global/${id}`); await loadCategories(); toast.success('Category deleted'); }
    catch { toast.error('Failed to delete category'); }
  }

  // --- TAX HANDLERS ---
  async function loadTaxData() {
    setTaxLoading(true);
    try {
      const [rulesRes, catRes] = await Promise.all([apiClient.get('/tax/rules'), apiClient.get('/categories/global')]);
      setTaxRules(rulesRes.map((r: any) => ({ 'tax-rule-id': r.id, state: r.state, 'target-type': r.targetType, 'target-value': r.targetValue, 'tax-rate': parseFloat(r.taxRate), 'is-active': r.isActive })));
      setTaxCategories(catRes.map((c: any) => ({ 'category-id': c.id, 'category-name': c.name })));
    } catch (e) { toast.error('Failed to load tax data'); }
    finally { setTaxLoading(false); }
  }

  async function handleAddTaxRule(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaxCategory) { toast.error('Please select a category'); return; }
    setTaxSaving(true);
    try {
      await apiClient.post('/tax/rules', { state: newTaxState.trim().toUpperCase(), targetType: 'CATEGORY', targetValue: newTaxCategory, taxRate: parseFloat(newTaxRate) || 0 });
      setNewTaxRate(''); setNewTaxCategory('');
      await loadTaxData();
      toast.success('Tax rule added!');
    } catch (err: any) { toast.error('Failed to add rule: ' + err.message); }
    finally { setTaxSaving(false); }
  }

  async function handleDeleteTaxRule(id: string) {
    if (!confirm('Delete this tax rule?')) return;
    try { await apiClient.delete(`/tax/rules/${id}`); await loadTaxData(); toast.success('Tax rule deleted'); }
    catch { toast.error('Failed to delete tax rule'); }
  }

  // --- APPROVAL WORKFLOW ---
  const handleApproveItem = async (item: PendingItem) => {
    try {
      await apiClient.post(`/super-admin/products/${item['pending-id']}/approve`);
      toast.success("Product Approved & Added to Master Catalog");
      setPendingItems(prev => prev.filter(i => i['pending-id'] !== item['pending-id']));
      loadData(); // Reload catalog
    } catch (error: any) {
      toast.error("Failed to approve item: " + (error.message || "Unknown error"));
    }
  };

  const handleRejectItem = async (id: string) => {
    try {
      await apiClient.post(`/super-admin/products/${id}/reject`);
      toast.success("Item rejected");
      setPendingItems(prev => prev.filter(i => i['pending-id'] !== id));
    } catch (error: any) {
      toast.error("Failed to reject item");
    }
  };

  // --- ACTIONS ---
  const handleLinkToBulk = async (singleUnitId: string, bulkPackId: string) => {
    alert("Bulk linking not fully implemented in backend yet.");
  };

  const handleAiEnrich = async (product: GlobalProduct) => {
    setEnriching(product.id);
    try {
      const enriched = await apiClient.post(`/super-admin/products/${product.id}/enrich`);
      toast.success("Product enriched with AI!");
      
      if (editedProduct && editedProduct.id === product.id) {
        setEditedProduct(prev => prev ? {
          ...prev,
          image_url: enriched.imageUrl || prev.image_url,
          description: enriched.description || prev.description,
        } : prev);
      }

      setProducts(prev => prev.map(p => p.id === product.id ? {
        ...p,
        image_url: enriched.imageUrl || p.image_url,
        description: enriched.description || p.description,
        ai_enriched_at: enriched.aiEnrichedAt || new Date().toISOString(),
      } : p));
    } catch (error: any) {
      toast.error("Enrichment failed: " + (error.message || "Unknown error"));
    } finally {
      setEnriching(null);
    }
  };

  const handleSaveProduct = async () => {
    if (!editedProduct) return;
    setSaving(true);
    try {
      await apiClient.post(`/super-admin/products/${editedProduct.id}`, {
        name: editedProduct.name,
        category: editedProduct.category,
        description: editedProduct.description,
        image_url: editedProduct.image_url,
      });

      setProducts(prev => prev.map(p => p.id === editedProduct.id ? editedProduct : p));
      setSelectedProduct(editedProduct);
      toast.success('Product updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/super-admin/login';
    toast.success('Logged out successfully');
  };

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.upc_ean && p.upc_ean.includes(searchQuery))
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e4e7eb] via-[#fdf9e3] to-[#fceb9c] text-gray-900 font-sans overflow-auto">
      {/* Top Navigation */}
      <header className="flex items-center justify-between p-6 max-w-[1400px] mx-auto">
        <div className="border border-gray-400/30 bg-white/40 rounded-full px-6 py-2.5 backdrop-blur-md flex items-center gap-2 shadow-sm">
           <span className="font-semibold text-base tracking-tight text-gray-900">RetailOS<span className="text-[#2a2d32]">.cloud</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-white/40 backdrop-blur-md rounded-full border border-gray-400/30 p-1 shadow-sm">
          {[
            { id: 'products', label: 'Dashboard' },
            { id: 'tenants', label: 'Stores' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'categories', label: 'Categories' },
            { id: 'taxes', label: 'Tax Engine' },
            { id: 'website', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-[#2a2d32] text-white shadow-md' : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
           <button className="w-10 h-10 rounded-full bg-white/40 border border-gray-400/30 backdrop-blur-md flex items-center justify-center hover:bg-white/60 transition-all text-gray-700 shadow-sm">
              <Bell size={18} />
           </button>
           {/* User Avatar with Dropdown */}
           <div className="relative">
             <button
               onClick={() => setShowUserMenu(prev => !prev)}
               className="w-10 h-10 rounded-full bg-white overflow-hidden shadow-sm flex items-center justify-center border border-gray-400/30 hover:ring-2 hover:ring-[#2a2d32]/30 transition-all"
             >
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Avatar" className="w-full h-full object-cover" />
             </button>
             {showUserMenu && (
               <>
                 {/* Backdrop */}
                 <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                 {/* Dropdown */}
                 <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
                   <div className="px-4 py-3 border-b border-gray-100">
                     <p className="text-sm font-bold text-gray-900">Super Admin</p>
                     <p className="text-xs text-gray-500">admin@retailstore.com</p>
                   </div>
                   <button
                     onClick={() => { setShowUserMenu(false); setActiveTab('website'); }}
                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                   >
                     <Settings size={16} className="text-gray-400" /> Settings
                   </button>
                   <div className="border-t border-gray-100 mt-1" />
                   <button
                     onClick={() => { setShowUserMenu(false); handleLogout(); }}
                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                   >
                     <Lock size={16} className="text-red-400" /> Logout
                   </button>
                 </div>
               </>
             )}
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto p-6 space-y-8 pb-10">
        <h1 className="text-[3rem] font-light tracking-tight text-gray-900 mb-8 px-2">
          {activeTab === 'products' ? 'Global Catalog' : 
           activeTab === 'pending' ? 'Pending Approvals' :
           activeTab === 'tenants' ? 'Stores' :
           activeTab === 'revenue' ? 'Revenue Analytics' :
           activeTab === 'categories' ? 'Categories' :
           activeTab === 'taxes' ? 'Tax Engine' : 'System Settings'}
        </h1>
        
        <div className="space-y-8">

        {/* 1. MASTER CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search UPC, Name..."
                  className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-gray-300 outline-none w-64"
                />
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm">
                  Import Data
                </button>
                <button className="bg-[#2a2d32] hover:bg-black text-white px-5 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Table meta bar */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500"><strong className="text-gray-800 font-semibold">{filteredProducts.length}</strong> products</span>
              </div>

              {/* Scrollable table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium">Product</th>
                      <th className="px-4 py-3 text-left font-medium">SKU / UPC</th>
                      <th className="px-4 py-3 text-left font-medium">Category</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.length > 0 ? paginatedProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedProduct(p)}
                      >

                        {/* Product: image + name + category stacked */}
                        <td className="px-4 py-4 max-w-[280px]">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                              {p.image_url
                                ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                                : <ImageIcon size={16} className="text-gray-300" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm leading-snug truncate">{p.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                            </div>
                          </div>
                        </td>

                        {/* UPC */}
                        <td className="px-4 py-4">
                          <span className="font-mono text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                            {p.upc_ean || '—'}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">{p.category}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {p.ai_enriched_at ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              <Sparkles size={10} /> Enriched
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleAiEnrich(p)}
                              disabled={enriching === p.id}
                              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                enriching === p.id
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-[#2a2d32] hover:bg-black text-white'
                              }`}
                            >
                              {enriching === p.id ? <><Loader2 className="animate-spin" size={11} /> Processing</> : 'Enrich with AI'}
                            </button>
                            <button
                              onClick={() => setEditedProduct({ ...p })}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-14 text-center text-gray-400 text-sm">
                          No products found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <span className="text-xs text-gray-500">
                    Showing <strong className="text-gray-700">{((currentPage - 1) * itemsPerPage) + 1}</strong>–<strong className="text-gray-700">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> of <strong className="text-gray-700">{filteredProducts.length}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >← Prev</button>
                    <span className="px-3 py-1.5 text-xs text-gray-500">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >Next →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PENDING APPROVALS */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
              <p className="text-gray-500 text-sm mt-1">Review product submissions from retailers before adding them to the Master Catalog.</p>
            </div>

            {pendingItems.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-white/50 shadow-lg">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500 text-sm mt-1">There are no pending product submissions to review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingItems.map((item) => (
                  <div key={item['pending-id']} className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-lg flex items-start gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                      {item['image-url'] ? <img src={item['image-url']} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-300" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item['product-name']}</h3>
                          <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                            <Store size={14} className="text-gray-400" /> Submitted by: <span className="font-medium text-gray-700">{item.tenant?.['store-name'] || 'Unknown Store'}</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <span className="bg-gray-100 border border-gray-200 text-xs px-2.5 py-1 rounded-md text-gray-600 font-medium">UPC: {item['upc-ean-code']}</span>
                            <span className="bg-gray-100 border border-gray-200 text-xs px-2.5 py-1 rounded-md text-gray-600 font-medium">Brand: {item['brand-name']}</span>
                          </div>
                        </div>
                        <div className="text-right bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">AI Confidence</div>
                          <div className={`text-xl font-bold ${item['ai-confidence-score'] > 0.8 ? 'text-green-600' : 'text-amber-600'}`}>
                            {(item['ai-confidence-score'] * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-gray-50 p-3.5 rounded-lg text-sm text-gray-600 border border-gray-100">
                        {item['description-text'] || "No description provided."}
                      </div>

                      <div className="mt-5 flex justify-end gap-3">
                        <button onClick={() => handleRejectItem(item['pending-id'])} className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-sm">
                          <ThumbsDown size={16} /> Reject
                        </button>
                        <button onClick={() => handleApproveItem(item)} className="px-5 py-2.5 bg-[#2a2d32] hover:bg-black text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition">
                          <ThumbsUp size={16} /> Approve & Add to Master
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. TENANT NETWORK */}
        {activeTab === 'tenants' && (
          <div className="space-y-5">
            {/* Summary row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Stores', value: tenants.length, sub: 'Registered tenants' },
                { label: 'Active', value: tenants.filter(t => t.is_active).length, sub: 'Currently active' },
                { label: 'Inactive', value: tenants.filter(t => !t.is_active).length, sub: 'Suspended / inactive' },
              ].map(s => (
                <div key={s.label} className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl px-5 py-4 shadow-sm">
                  <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white/50">
                <h3 className="text-sm font-semibold text-gray-700">Available Stores</h3>
                <span className="text-xs text-gray-400">{tenants.length} stores</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left font-medium">Store</th>
                    <th className="px-5 py-3 text-left font-medium">Subdomain</th>
                    <th className="px-5 py-3 text-left font-medium">Plan</th>
                    <th className="px-5 py-3 text-left font-medium">Joined</th>
                    <th className="px-5 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tenants.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">No stores registered yet.</td></tr>
                  ) : tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Store name + avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                            {t.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{t.name}</span>
                        </div>
                      </td>
                      {/* Subdomain */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono text-gray-400">{t.subdomain || '—'}</span>
                      </td>
                      {/* Plan */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                          t.subscription_tier === 'enterprise' ? 'bg-green-50 text-green-700 border-green-200' :
                          t.subscription_tier === 'pro' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          t.subscription_tier === 'beta' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {t.subscription_tier ? t.subscription_tier.charAt(0).toUpperCase() + t.subscription_tier.slice(1) : 'Free'}
                        </span>
                      </td>
                      {/* Joined date */}
                      <td className="px-5 py-3.5 text-gray-500 text-sm">
                        {new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3.5 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                          t.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {t.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. REVENUE ANALYTICS */}
        {activeTab === 'revenue' && (
          <div className="space-y-5">

            {/* Summary Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Tenants', value: tenants.length, sub: 'Registered stores' },
                { label: 'MRR', value: `$${revenueData.totalEarnings.toFixed(2)}`, sub: 'Monthly recurring revenue' },
                { label: 'Paid Plans', value: revenueData.subscriptionTiers.pro + revenueData.subscriptionTiers.enterprise, sub: 'Pro + Enterprise' },
                { label: 'Transactions', value: revenueData.receipts.length, sub: 'This period' },
              ].map(s => (
                <div key={s.label} className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl px-5 py-4 shadow-sm">
                  <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Subscription Breakdown */}
            <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Subscription Plans</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-medium">Plan</th>
                    <th className="px-5 py-3 text-left font-medium">Price / mo</th>
                    <th className="px-5 py-3 text-left font-medium">Active Tenants</th>
                    <th className="px-5 py-3 text-left font-medium">MRR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { label: 'Free', price: 0, count: revenueData.subscriptionTiers.free },
                    { label: 'Beta', price: 0, count: revenueData.subscriptionTiers.beta },
                    { label: 'Pro', price: 49.99, count: revenueData.subscriptionTiers.pro },
                    { label: 'Enterprise', price: 199.99, count: revenueData.subscriptionTiers.enterprise },
                  ].map(p => (
                    <tr key={p.label} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                          p.label === 'Enterprise' ? 'bg-green-50 text-green-700 border-green-200' :
                          p.label === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          p.label === 'Beta' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>{p.label}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{p.price === 0 ? 'Free' : `$${p.price.toFixed(2)}`}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{p.count}</td>
                      <td className="px-5 py-3.5 text-gray-600">${(p.count * p.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Recent Transactions</h3>
                <span className="text-xs text-gray-400">{revenueData.receipts.length} records</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-medium">Date</th>
                    <th className="px-5 py-3 text-left font-medium">Store</th>
                    <th className="px-5 py-3 text-left font-medium">Description</th>
                    <th className="px-5 py-3 text-left font-medium">Amount</th>
                    <th className="px-5 py-3 text-left font-medium">Method</th>
                    <th className="px-5 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {revenueData.receipts.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No transactions recorded yet.</td></tr>
                  ) : revenueData.receipts.map((receipt: any) => (
                    <tr key={receipt['transaction-id']} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-gray-500">{new Date(receipt['transaction-date']).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{receipt['retail-store-tenant']?.['store-name'] || 'Unknown'}</td>
                      <td className="px-5 py-3.5 text-gray-500">{receipt.description}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">${parseFloat(receipt.amount).toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-gray-500 capitalize">{receipt['payment-method'] || '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                          receipt.status?.toLowerCase() === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                          receipt.status?.toLowerCase() === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>{receipt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 5. MASTER WEBSITE */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Master Website Configuration</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your primary website domain and settings</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-6 space-y-6 shadow-sm">
              {/* Domain Configuration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Domain</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue="retailstore.com"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                    placeholder="yourdomain.com"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm">
                    Update Domain
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">This is the main domain for the master website.</p>
              </div>

              {/* SSL Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SSL Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-900 font-medium">Active</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DNS Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-900 font-medium">Configured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {catLoading ? (
              <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 h-fit shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Tag size={18} className="text-blue-600" /> Add Category</h2>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                      <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Dairy" className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <input type="text" value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} placeholder="e.g. Milk, cheese, butter" className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={catSaving || !newCatName.trim()} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      {catSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Category
                    </button>
                  </form>
                </div>
                <div className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/40 bg-white/20">
                    <h3 className="font-semibold text-gray-900">Active Global Categories ({catList.length})</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Pushed to every store tenant and used for AI invoice parsing.</p>
                  </div>
                  {catList.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No global categories defined yet.</div>
                  ) : (
                    <ul className="divide-y divide-white/30">
                      {catList.map(cat => (
                        <li key={cat['category-id']} className="p-4 hover:bg-white/20 flex items-center justify-between transition-colors">
                          <div>
                            <p className="font-bold text-gray-900">{cat['category-name']}</p>
                            {cat.description && <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>}
                          </div>
                          <button onClick={() => handleDeleteCategory(cat['category-id'])} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><X className="w-4 h-4" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. TAX ENGINE */}
        {activeTab === 'taxes' && (
          <div className="space-y-6">
            {taxLoading ? (
              <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 h-fit shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Receipt size={18} className="text-indigo-600" /> Add Tax Rule</h2>
                  <form onSubmit={handleAddTaxRule} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State / Region</label>
                      <input type="text" value={newTaxState} onChange={e => setNewTaxState(e.target.value)} placeholder="e.g. NY, CA, ALL" className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Category</label>
                      <select value={newTaxCategory} onChange={e => setNewTaxCategory(e.target.value)} className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                        <option value="" disabled>Select a category...</option>
                        {taxCategories.map(c => <option key={c['category-id']} value={c['category-name']}>{c['category-name']}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                      <div className="relative">
                        <input type="number" step="0.001" value={newTaxRate} onChange={e => setNewTaxRate(e.target.value)} placeholder="e.g. 8.875" className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <button type="submit" disabled={taxSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2">
                      {taxSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Tax Rule
                    </button>
                  </form>
                </div>
                <div className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/40 bg-white/20">
                    <h3 className="font-semibold text-gray-900">Active Tax Rules ({taxRules.length})</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Enforced automatically across all store tenants.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="border-b border-white/30 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-6 py-3 font-medium">State</th>
                          <th className="px-6 py-3 font-medium">Type</th>
                          <th className="px-6 py-3 font-medium">Target</th>
                          <th className="px-6 py-3 font-medium">Rate</th>
                          <th className="px-6 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/30">
                        {taxRules.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No tax rules defined yet.</td></tr>
                        ) : taxRules.map(rule => (
                          <tr key={rule['tax-rule-id']} className="hover:bg-white/20">
                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${rule.state === 'ALL' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>{rule.state}</span></td>
                            <td className="px-6 py-4 text-gray-600">{rule['target-type']}</td>
                            <td className="px-6 py-4 font-mono text-gray-700">{rule['target-value']}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">{Number(rule['tax-rate']).toFixed(3).replace(/\.?0+$/, '')}%</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteTaxRule(rule['tax-rule-id'])} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors inline-flex items-center" title="Delete"><X className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        </div> {/* end space-y-8 */}
      </main>

      {/* Edit Product Modal */}
      {editedProduct && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Globe className="text-blue-500" size={20} /> Edit Global Product
              </h3>
              <button
                onClick={() => setEditedProduct(null)}
                className="text-gray-400 hover:text-gray-600 transition bg-white hover:bg-gray-100 p-1.5 rounded-md border border-transparent hover:border-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    value={editedProduct.name || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editedProduct.category || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Product Image</label>
                  <button
                    onClick={(e) => { e.preventDefault(); handleAiEnrich(editedProduct); }}
                    disabled={enriching === editedProduct.id}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      enriching === editedProduct.id
                        ? 'bg-gray-300 text-white cursor-not-allowed'
                        : 'bg-[#2a2d32] hover:bg-black text-white'
                    }`}
                  >
                    {enriching === editedProduct.id ? <><Loader2 className="animate-spin" size={12} /> Fetching...</> : 'Enrich with AI'}
                  </button>
                </div>

                <div className="flex gap-4 items-start">
                  {/* Image preview + upload button */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      {editedProduct.image_url ? (
                        <img src={editedProduct.image_url} className="w-full h-full object-cover" alt="Product" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1">
                          <ImageIcon size={24} />
                          <span className="text-[10px] font-medium">No image</span>
                        </div>
                      )}
                    </div>
                    {/* Upload button */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer shadow-sm">
                      <UploadCloud size={13} /> Upload
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const toastId = toast.loading("Uploading image...");
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await apiClient.post(`/super-admin/products/${editedProduct.id}/image`, formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            setEditedProduct({ ...editedProduct, image_url: res.imageUrl });
                            toast.success("Image uploaded successfully", { id: toastId });
                          } catch (err: any) {
                            toast.error("Upload failed: " + (err.message || 'Unknown error'), { id: toastId });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* URL input */}
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL</label>
                    <input
                      type="text"
                      value={editedProduct.image_url || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, image_url: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-xs shadow-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Upload a file using the button, or paste a direct image URL. Use <span className="text-violet-500 font-medium">Enrich with AI</span> to auto-fetch product data.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={editedProduct.description || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] shadow-sm resize-y"
                  placeholder="Enter product description..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-blue-800">
                  <span className="font-semibold">Note:</span> Changes made here will be pushed to the Global Catalog.
                  Tenants will receive these updates during their next sync or product fetch.
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setEditedProduct(null)}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
