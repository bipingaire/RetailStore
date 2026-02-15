
'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Database, Store, Truck, Sparkles, Search,
  CheckCircle, AlertCircle, RefreshCw, Globe, UploadCloud, FileSpreadsheet, X, Image as ImageIcon, FileText, Activity, ExternalLink, Box, Layers, Link as LinkIcon, ArrowUp, ArrowRight, Loader2, FileWarning, Tag, MessageSquare, ThumbsUp, ThumbsDown, Lock, DollarSign, Receipt, TrendingUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

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
      // Logic for aggregating simple counters from backend response if not pre-aggregated
      // Assuming backend returns struct similar to what we need or we map it
      if (data.revenueData) {
        // Construct tiers manually if backend doesn't aggregate
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

  // --- ACTIONS --- (Stubbed or simplified for now)
  const handleLinkToBulk = async (singleUnitId: string, bulkPackId: string) => {
    alert("Bulk linking not fully implemented in backend yet.");
  };

  const handleAiEnrich = async (product: GlobalProduct) => {
    setEnriching(product.id);
    try {
      await apiClient.post(`/super-admin/products/${product.id}/enrich`);
      toast.success("Product Enriched with AI!");
      loadData(); // Reload to see changes
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
        // Add other mappings
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <Database className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Master Console</h1>
              <p className="text-xs text-gray-400">Super Admin Access</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-800/50 p-1 rounded-xl">
              {[
                { id: 'products', icon: Globe, label: 'Master Catalog' },
                { id: 'pending', icon: MessageSquare, label: 'Approvals', count: pendingItems.length },
                { id: 'tenants', icon: Store, label: 'Tenant Network' },
                { id: 'revenue', icon: DollarSign, label: 'Revenue' },
                { id: 'website', icon: ExternalLink, label: 'Master Website' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                        px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2
                        ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                    `}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count ? <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{tab.count}</span> : null}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-gray-700"
            >
              <Lock size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">

        {/* --- TABS CONTENT --- */}

        {/* 1. MASTER CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Global Product Database</h2>
                <p className="text-gray-400">The single source of truth for all products across the network.</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <input type="text" placeholder="Search UPC, Name..." className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-64" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-900/50 text-gray-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-700/50 transition cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center overflow-hidden border border-gray-600 shrink-0">
                          {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={16} />}
                        </div>
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{p.upc_ean || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4">
                        {p.ai_enriched_at ? (
                          <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded text-xs border border-green-800 font-bold flex w-fit items-center gap-1"><Sparkles size={10} /> Enriched</span>
                        ) : (
                          <span className="bg-gray-700 text-gray-400 px-2 py-0.5 rounded text-xs">Standard</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAiEnrich(p);
                            }}
                            disabled={enriching === p.id}
                            className={`
                                text-xs font-bold flex items-center gap-1 px-2 py-1 rounded
                                ${enriching === p.id ? 'bg-purple-900/50 text-purple-300' : 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/20'}
                            `}
                          >
                            {enriching === p.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                            {enriching === p.id ? 'Enriching...' : 'Enrich AI'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditedProduct({ ...p }); // Create a copy to edit
                            }}
                            className="text-blue-400 hover:text-blue-300 text-xs font-bold"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. PENDING APPROVALS */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Pending Approvals</h2>
              <p className="text-gray-400">Review product submissions from retailers before adding them to the Master Catalog.</p>
            </div>

            {pendingItems.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700 border-dashed">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
                <p className="text-gray-400">There are no pending product submissions to review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingItems.map((item) => (
                  <div key={item['pending-id']} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600 shrink-0">
                      {item['image-url'] ? <img src={item['image-url']} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white">{item['product-name']}</h3>
                          <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                            <Store size={14} /> Submitted by: <span className="text-white">{item.tenant?.['store-name'] || 'Unknown Store'}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">UPC: {item['upc-ean-code']}</span>
                            <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">Brand: {item['brand-name']}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 font-bold uppercase mb-1">AI Confidence</div>
                          <div className={`text-lg font-black ${item['ai-confidence-score'] > 0.8 ? 'text-green-400' : 'text-amber-400'}`}>
                            {(item['ai-confidence-score'] * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-gray-900/50 p-3 rounded-lg text-sm text-gray-300 border border-gray-800">
                        {item['description-text'] || "No description provided."}
                      </div>

                      <div className="mt-4 flex justify-end gap-3">
                        <button onClick={() => handleRejectItem(item['pending-id'])} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition">
                          <ThumbsDown size={16} /> Reject
                        </button>
                        <button onClick={() => handleApproveItem(item)} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transition">
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
                    <td className="p-4">
                      <div className="font-bold text-white">{t.name}</div>
                      {t.subdomain && <div className="text-xs text-gray-500 font-mono">{t.subdomain}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-300 capitalize">
                        <Store size={16} className="text-blue-400" /> {t.subscription_tier || 'Standard'}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${t.is_active ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
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
              <h2 className="text-2xl font-bold text-white">Revenue Analytics</h2>
              <p className="text-gray-400">Track subscriptions, earnings, and billing transactions</p>
            </div>

            {/* Subscription Breakdown */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-400" />
                Subscription Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { tier: 'free', label: 'Free', color: 'gray', price: '$0', count: revenueData.subscriptionTiers.free },
                  { tier: 'beta', label: 'Beta', color: 'purple', price: '$0', count: revenueData.subscriptionTiers.beta },
                  { tier: 'pro', label: 'Pro', color: 'blue', price: '$49.99', count: revenueData.subscriptionTiers.pro },
                  { tier: 'enterprise', label: 'Enterprise', color: 'green', price: '$199.99', count: revenueData.subscriptionTiers.enterprise }
                ].map((item) => (
                  <div key={item.tier} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition">
                    <div className={`text-${item.color}-400 text-sm font-bold uppercase mb-2`}>{item.label}</div>
                    <div className="text-3xl font-bold text-white mb-1">{item.count}</div>
                    <div className="text-xs text-gray-500">Tenants · {item.price}/mo</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-700/50 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-blue-300 uppercase mb-2 flex items-center gap-2">
                    <DollarSign size={18} />
                    Monthly Recurring Revenue
                  </div>
                  <div className="text-5xl font-bold text-white mb-2">
                    ${revenueData.totalEarnings.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    From {revenueData.subscriptionTiers.pro + revenueData.subscriptionTiers.enterprise} active paid subscriptions
                  </div>
                </div>
                <div className="bg-blue-600/20 p-6 rounded-full">
                  <Receipt size={48} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Receipt size={20} className="text-green-400" />
                Recent Transactions
              </h3>
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-900/50 text-gray-500 uppercase text-xs font-bold">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Tenant</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {revenueData.receipts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    ) : (
                      revenueData.receipts.map((receipt: any) => (
                        <tr key={receipt['transaction-id']} className="hover:bg-gray-700/50 transition">
                          <td className="p-4 text-gray-500">
                            {new Date(receipt['transaction-date']).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">
                              {receipt['retail-store-tenant']?.['store-name'] || 'Unknown'}
                            </div>
                          </td>
                          <td className="p-4 text-gray-400">{receipt.description}</td>
                          <td className="p-4 font-bold text-green-400">
                            ${parseFloat(receipt.amount).toFixed(2)}
                          </td>
                          <td className="p-4 text-gray-500 capitalize">{receipt['payment-method'] || 'N/A'}</td>
                          <td className="p-4 text-right">
                            <span className="px-2 py-1 rounded text-xs font-bold uppercase border bg-green-900/20 text-green-400 border-green-800">
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
              <h2 className="text-2xl font-bold text-white">Master Website Configuration</h2>
              <p className="text-gray-400">Manage your primary website domain and settings</p>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
              {/* Domain Configuration */}
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Primary Domain</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue="retailstore.com"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    placeholder="yourdomain.com"
                  />
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition">
                    Update Domain
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">This is the main domain for the master website</p>
              </div>

              {/* SSL Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">SSL Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white font-bold">Active</span>
                  </div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">DNS Status</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white font-bold">Configured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        }

      </main >

      {/* Edit Product Modal */}
      {editedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="text-blue-400" /> Edit Global Product
              </h3>
              <button
                onClick={() => setEditedProduct(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editedProduct.category}
                    onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedProduct.image_url}
                    onChange={(e) => setEditedProduct({ ...editedProduct, image_url: e.target.value })}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                  {editedProduct.image_url && (
                    <div className="w-10 h-10 bg-gray-900 rounded border border-gray-700 overflow-hidden shrink-0">
                      <img src={editedProduct.image_url} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                <textarea
                  value={editedProduct.description || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                  placeholder="Enter product description..."
                />
              </div>

              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/50 flex items-start gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-blue-200">
                  <strong>Note:</strong> Changes made here will be pushed to the Global Catalog.
                  Tenants will receive these updates during their next sync or product fetch.
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end gap-3 bg-gray-800/50">
              <button
                onClick={() => setEditedProduct(null)}
                className="px-4 py-2 text-gray-300 hover:text-white font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
