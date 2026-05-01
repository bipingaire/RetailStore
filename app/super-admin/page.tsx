'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Database, Store, Truck, Sparkles, Search,
  CheckCircle, AlertCircle, RefreshCw, Globe, UploadCloud, FileSpreadsheet, X, Image as ImageIcon, FileText, Activity, ExternalLink, Box, Layers, Link as LinkIcon, ArrowUp, ArrowRight, ChevronRight, Loader2, FileWarning, Tag, MessageSquare, ThumbsUp, ThumbsDown, Lock, DollarSign, Receipt, TrendingUp, Bell, Plus
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
  const [activeTab, setActiveTab] = useState<'products' | 'tenants' | 'pending' | 'website' | 'revenue'>('products');
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

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className="h-screen bg-white text-gray-900 font-sans flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white flex flex-col shrink-0 transition-all z-20">
        <div className="p-8 pb-4 flex items-center gap-3">
          <Database className="text-[#155d3a]" size={28} strokeWidth={2.5} />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">Master Console</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 hide-scrollbar">
          <div className="text-[10px] font-bold text-gray-400 mb-3 px-3 uppercase tracking-wider">Main Menu</div>
          {[
            { id: 'products', icon: Database, label: 'Global Catalog' },
            { id: 'pending', icon: MessageSquare, label: 'Approvals', count: pendingItems.length },
            { id: 'tenants', icon: Store, label: 'Tenant Network' },
            { id: 'revenue', icon: DollarSign, label: 'Revenue' },
            { id: 'website', icon: Globe, label: 'Master Website' }
          ].map((tab) => (
            <div key={tab.id} className="relative px-4">
              {activeTab === tab.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#155d3a] rounded-r-lg"></div>
              )}
              <button
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group
                  ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={20} className={activeTab === tab.id ? 'text-[#155d3a]' : 'text-gray-400 group-hover:text-gray-600'} />
                  {tab.label}
                </div>
                {tab.count ? <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-[#155d3a] text-white' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span> : null}
              </button>
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 mb-3 px-3 uppercase tracking-wider">General</div>
            <div className="px-4">
              <Link href="/super-admin/categories" className="w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-3 group">
                <Tag size={20} className="text-gray-400 group-hover:text-gray-600" /> Categories
              </Link>
              <Link href="/super-admin/taxes" className="w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-3 group mt-1">
                <Receipt size={20} className="text-gray-400 group-hover:text-gray-600" /> Tax Engine
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="p-4 bg-white mt-auto">
          <div className="px-4">
            <button onClick={handleLogout} className="w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-3 group">
               <Lock size={20} className="text-gray-400 group-hover:text-gray-600" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 p-2 md:p-4 bg-white overflow-hidden flex flex-col">
        {/* Main Content Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f6f8f7] rounded-[2rem] overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-transparent px-8 flex items-center justify-between shrink-0 z-10 sticky top-0 mt-4">
          {/* Search Bar */}
          <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search data" className="bg-white border-none text-sm text-gray-900 rounded-full pl-11 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#155d3a] w-80 shadow-sm" />
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 bg-gray-100 font-medium rounded px-2 py-1">⌘F</span>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-900 transition">
                 <MessageSquare size={18} />
             </button>
             <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-900 transition">
                 <Bell size={18} />
             </button>
             <div className="flex items-center gap-3 ml-4 cursor-pointer">
                 <div className="w-10 h-10 rounded-full bg-[#fde1d3] overflow-hidden shadow-sm flex items-center justify-center">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <div className="hidden md:block text-left leading-tight">
                     <div className="text-sm font-bold text-gray-900">Super Admin</div>
                     <div className="text-xs text-gray-500">admin@retailstore.com</div>
                 </div>
             </div>
          </div>
        </header>

        {/* Scrollable Dashboard Space */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* --- TABS CONTENT --- */}

        {/* 1. MASTER CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Global Product Database</h2>
                <p className="text-gray-500 text-base">The single source of truth for all products across the network.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search UPC, Name..." className="bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-[#155d3a] outline-none w-64" />
                </div>
                <button className="bg-[#155d3a] hover:bg-[#10482c] text-white px-5 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2 shadow-sm">
                   <Plus size={18} /> Add Product
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium transition shadow-sm">
                   Import Data
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] border-none overflow-hidden shadow-sm p-2">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-100 text-gray-400 text-xs font-medium">
                  <tr>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.length > 0 ? paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                          {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-400" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{p.upc_ean || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4">
                        {p.ai_enriched_at ? (
                          <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs border border-green-200 font-medium flex w-fit items-center gap-1.5"><Sparkles size={12} className="text-green-500" /> Enriched</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">Standard</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAiEnrich(p);
                            }}
                            disabled={enriching === p.id}
                            className={`
                                text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md transition
                                ${enriching === p.id ? 'bg-purple-50 text-purple-400 cursor-not-allowed' : 'text-purple-600 bg-purple-50 hover:bg-purple-100'}
                            `}
                          >
                            {enriching === p.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                            {enriching === p.id ? 'Enriching...' : 'Enrich AI'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditedProduct({ ...p });
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">No products found matching your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white mt-2">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium text-gray-900">{filteredProducts.length}</span> products
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition border border-gray-300 shadow-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition border border-gray-300 shadow-sm"
                    >
                      Next
                    </button>
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
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500 text-sm mt-1">There are no pending product submissions to review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingItems.map((item) => (
                  <div key={item['pending-id']} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-start gap-5">
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
                        <button onClick={() => handleApproveItem(item)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition">
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
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Store size={18} className="text-gray-500" /> Tenant Network</h2>
            </div>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold">
                <tr><th className="p-4">Tenant Name</th><th className="p-4">Type</th><th className="p-4">Joined Date</th><th className="p-4 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      {t.subdomain && <div className="text-xs text-gray-500 font-mono mt-0.5">{t.subdomain}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700 capitalize">
                        <Store size={16} className="text-blue-500" /> {t.subscription_tier || 'Standard'}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${t.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. REVENUE ANALYTICS */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-gray-500 text-sm mt-1">Track subscriptions, earnings, and billing transactions</p>
            </div>

            {/* Subscription Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Subscription Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { tier: 'free', label: 'Free', color: 'gray', price: '$0', count: revenueData.subscriptionTiers.free },
                  { tier: 'beta', label: 'Beta', color: 'purple', price: '$0', count: revenueData.subscriptionTiers.beta },
                  { tier: 'pro', label: 'Pro', color: 'blue', price: '$49.99', count: revenueData.subscriptionTiers.pro },
                  { tier: 'enterprise', label: 'Enterprise', color: 'green', price: '$199.99', count: revenueData.subscriptionTiers.enterprise }
                ].map((item) => (
                  <div key={item.tier} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                    <div className={`text-${item.color}-600 text-xs font-bold uppercase tracking-wider mb-3`}>{item.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{item.count}</div>
                    <div className="text-sm text-gray-500">Tenants · {item.price}/mo</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-blue-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="text-sm font-medium text-blue-100 mb-2 flex items-center gap-2">
                    <DollarSign size={18} />
                    Monthly Recurring Revenue
                  </div>
                  <div className="text-5xl font-bold mb-2">
                    ${revenueData.totalEarnings.toFixed(2)}
                  </div>
                  <div className="text-sm text-blue-100">
                    From {revenueData.subscriptionTiers.pro + revenueData.subscriptionTiers.enterprise} active paid subscriptions
                  </div>
                </div>
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm border border-white/10">
                  <Receipt size={48} className="text-white" />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={20} className="text-green-500" />
                Recent Transactions
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Tenant</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {revenueData.receipts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    ) : (
                      revenueData.receipts.map((receipt: any) => (
                        <tr key={receipt['transaction-id']} className="hover:bg-gray-50 transition">
                          <td className="p-4 text-gray-500">
                            {new Date(receipt['transaction-date']).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {receipt['retail-store-tenant']?.['store-name'] || 'Unknown'}
                            </div>
                          </td>
                          <td className="p-4 text-gray-500">{receipt.description}</td>
                          <td className="p-4 font-bold text-gray-900">
                            ${parseFloat(receipt.amount).toFixed(2)}
                          </td>
                          <td className="p-4 text-gray-500 capitalize">{receipt['payment-method'] || 'N/A'}</td>
                          <td className="p-4 text-right">
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                              {receipt.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
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
        )
        }

          </div> {/* end max-w-6xl */}
        </main>
      </div> {/* end inner wrapper */}

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
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Product Image</label>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAiEnrich(editedProduct);
                    }}
                    disabled={enriching === editedProduct.id}
                    className="text-xs font-medium flex items-center gap-1.5 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition"
                  >
                    {enriching === editedProduct.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    {enriching === editedProduct.id ? 'Fetching...' : 'AI Enrich Data'}
                  </button>
                </div>
                
                <div className="flex gap-5 items-start">
                  <div className="w-28 h-28 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shrink-0 relative group shadow-sm">
                    {editedProduct.image_url ? (
                      <img src={editedProduct.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={28} className="mb-2" />
                        <span className="text-xs font-medium">No Image</span>
                      </div>
                    )}
                    
                    {/* Hover Upload Overlay */}
                    <label className="absolute inset-0 bg-gray-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[1px]">
                      <UploadCloud size={24} className="text-white mb-2" />
                      <span className="text-white text-sm font-medium">Upload</span>
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
                            console.error(err);
                            toast.error("Upload failed: " + (err.message || 'Unknown error'), { id: toastId });
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editedProduct.image_url || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, image_url: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm shadow-sm"
                      placeholder="Or paste an image URL..."
                    />
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Click the image preview to upload a file directly from your computer, click AI Enrich to fetch one from the web automatically, or paste a URL.
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
      </div>{/* end main content flex wrapper */}
    </div> // end outer root div
  );
}
