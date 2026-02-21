'use client';
import { apiClient } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import { Search, Package, Edit3, Plus, Globe, CheckCircle2, Sparkles, RefreshCcw, Trash2, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import EditProductModal from '../edit-product-modal';

// 1. Definition of Types based on Schema
type InventoryItem = {
  inventory_id: string; // from retail-store-inventory-item
  product_id: string;   // from global-product-master-catalog
  name: string;
  sku: string;
  image: string;
  category: string;
  description: string;
  manufacturer: string;
  total_qty: number;
  sales_price: number;
  is_enriched: boolean;
};

export default function MasterInventoryPage() {
  const [activeTab, setActiveTab] = useState<'my-inventory' | 'global-catalog'>('my-inventory');

  // Inventory State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [globalItems, setGlobalItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Track existing inventory SKUs for 'In Store' check (SKU-based, not UUID-based)
  const [existingSkus, setExistingSkus] = useState<Set<string>>(new Set());
  const [skusLoaded, setSkusLoaded] = useState(false);

  // Always load inventory SKUs on mount so global catalog can check 'In Store'
  useEffect(() => {
    loadInventorySkus();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function loadInventorySkus() {
    try {
      const data = await apiClient.get('/products');
      const skus = new Set<string>((data || []).map((p: any) => p.sku).filter(Boolean));
      setExistingSkus(skus);
    } catch (e) {
      console.error('Failed to load inventory SKUs', e);
    } finally {
      setSkusLoaded(true);
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'my-inventory') {
        const data = await apiClient.get('/products');

        const processed: InventoryItem[] = (data || []).map((item: any) => {
          return {
            inventory_id: item.id,
            product_id: item.id, // Treating local ID as master ID for now
            name: item.name,
            sku: item.sku || 'N/A',
            image: item.image || '',
            category: item.category || 'Uncategorized',
            description: item.description || '',
            manufacturer: 'N/A', // Backend doesn't store this yet
            total_qty: item.total_qty || 0,
            sales_price: item.price || 0,
            is_enriched: false // Default to false
          };
        });

        setInventoryItems(processed);
        // Also refresh SKU set whenever my-inventory is loaded
        setExistingSkus(new Set(processed.map(i => i.sku).filter(Boolean)));

      } else {
        // Fetch real Global Catalog data
        const data = await apiClient.get('/master-catalog');

        const processed: InventoryItem[] = (data || []).map((item: any) => ({
          inventory_id: item.sku, // Use SKU as ID for catalog items
          product_id: item.sku,
          name: item.productName,
          sku: item.sku,
          image: item.imageUrl || '',
          category: item.category || 'Uncategorized',
          description: item.description || '',
          manufacturer: 'Global Supplier',
          total_qty: 0, // Catalog items don't have stock
          sales_price: Number(item.basePrice) || 0,
          is_enriched: false
        }));

        setGlobalItems(processed);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToStore = async (product: InventoryItem) => {
    try {
      await apiClient.post('/products', {
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        price: product.sales_price,
        stock: 0
      });

      toast.success(`"${product.name}" added to your inventory!`);
      // Mark this SKU as already in store
      setExistingSkus(prev => new Set(prev).add(product.sku));

    } catch (error: any) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product to store");
    }
  };

  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) return;

    try {
      const id = item.inventory_id || item.product_id;
      await apiClient.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      setInventoryItems(prev => prev.filter(i => (i.inventory_id !== id && i.product_id !== id)));
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSaveProduct = (updatedItem: any) => {
    setInventoryItems(prev => prev.map(i =>
      (i.inventory_id === updatedItem.id || i.product_id === updatedItem.id) ? { ...i, ...updatedItem, sales_price: updatedItem.price } : i
    ));
    setEditingProduct(null);
  };

  const [enrichingId, setEnrichingId] = useState<string | null>(null);

  const handleEnrich = async (item: any) => {
    const pid = item.product_id;
    if (!pid) {
      toast.error("Cannot enrich: Missing Product ID");
      return;
    }

    setEnrichingId(pid);
    toast.info("Generating AI Image... This may take a moment.");

    // Unified Backend Endpoint
    try {
      const res: any = await apiClient.post(`/products/${pid}/enrich`, {});

      if (res.imageUrl) {
        toast.success("Image generated successfully!");
        // Update local state to show new image immediately
        setGlobalItems(prev => prev.map(i => i.product_id === pid ? { ...i, image: res.imageUrl } : i));
        setInventoryItems(prev => prev.map(i => i.product_id === pid ? { ...i, image: res.imageUrl } : i));
      } else {
        toast.error("Failed to generate image");
      }
    } catch (e: any) {
      console.error("Enrichment error:", e);
      toast.error(e.message || "Network error during enrichment");
    } finally {
      setEnrichingId(null);
    }
  };

  const handleSyncCatalog = async () => {
    const toastId = toast.loading("Syncing your inventory to global catalog...");
    try {
      const res: any = await apiClient.post('/products/force-sync', {});
      const { synced = 0, skipped = 0 } = res || {};
      toast.success(
        `Synced ${synced} products to global catalog${skipped > 0 ? ` (${skipped} skipped)` : ''}`,
        { id: toastId }
      );
      // Refresh both SKU set and catalog data
      await loadInventorySkus();
      if (activeTab === 'global-catalog') fetchData();
    } catch (e) {
      toast.error("Sync failed — check server logs", { id: toastId });
    }
  };

  const displayedItems = activeTab === 'my-inventory'
    ? inventoryItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm))
    : globalItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="text-blue-600" /> Master Inventory Ledger
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your store products and browse global catalog.</p>
          </div>

          <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setActiveTab('my-inventory')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'my-inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              My Inventory
            </button>
            <button
              onClick={() => setActiveTab('global-catalog')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'global-catalog' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Globe size={14} /> Global Catalog
            </button>
            <button
              onClick={handleSyncCatalog}
              className="px-3 py-2 rounded-md text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-white transition-all ml-2"
              title="Force Sync to Global Catalog"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name or SKU..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Manufacturer</th>
                {activeTab === 'my-inventory' ? (
                  <>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-center">Stock</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </>
                ) : (
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400">Loading...</td></tr>
              ) : displayedItems.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-gray-400">No items found.</td></tr>
              ) : displayedItems.map((item: any) => (
                <tr key={item.inventory_id || item.product_id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md shrink-0 overflow-hidden border border-gray-200 relative group/img">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Package className="p-2 text-gray-400" />}

                        {/* ENRICH BUTTON OVERLAY */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEnrich(item); }}
                          disabled={enrichingId === item.product_id}
                          className={`absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity ${enrichingId === item.product_id ? 'opacity-100 cursor-wait' : 'cursor-pointer'}`}
                          title="Magic Enrich Image"
                        >
                          {enrichingId === item.product_id ? <RefreshCcw size={16} className="animate-spin" /> : <Sparkles size={16} className="text-yellow-400" />}
                        </button>

                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.category}</td>
                  <td className="px-6 py-3 text-gray-500 text-sm max-w-xs truncate" title={item.description}>{item.description || '—'}</td>
                  <td className="px-6 py-3 text-gray-600">{item.manufacturer}</td>

                  {activeTab === 'my-inventory' ? (
                    <>
                      <td className="px-6 py-3 text-right font-bold text-gray-900 text-sm">${Number(item.sales_price).toFixed(2)}</td>
                      <td className="px-6 py-3 text-center font-bold text-gray-900">{item.total_qty}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingProduct(item); }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-3 text-right">
                      {existingSkus.has(item.sku) ? (
                        <span className="text-green-600 text-xs font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 size={14} /> In Store
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddToStore(item)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1 ml-auto"
                        >
                          <Plus size={14} /> Add to Store
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
}
