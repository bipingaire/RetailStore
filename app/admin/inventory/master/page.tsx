'use client';
import { useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, Filter, Package, Truck, ArrowUpDown, Info, Edit3, Save, X, Plus, Globe, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

// 1. Definition of Types based on Schema
type InventoryItem = {
  inventory_id: string; // from retail-store-inventory-item
  product_id: string;   // from global-product-master-catalog
  name: string;
  sku: string;
  image: string;
  category: string;
  manufacturer: string;
  total_qty: number;
  sales_price: number;
  is_enriched: boolean;
};

type GlobalProduct = {
  product_id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  brand: string;
  manufacturer: string;
  is_active: boolean;
  is_enriched: boolean;
};

export default function MasterInventoryPage() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState<'my-inventory' | 'global-catalog'>('my-inventory');

  // Inventory State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [globalItems, setGlobalItems] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, stock: 0 });

  // Checking existing inventory IDs to prevent duplicates in Global view
  const [existingProductIds, setExistingProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'my-inventory') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get My Tenant ID
        const { data: roleData } = await supabase
          .from('tenant-user-role')
          .select('tenant-id')
          .eq('user-id', user.id)
          .single();

        const myTenantId = roleData ? (roleData as any)['tenant-id'] : null;

        if (true) {
          const { data, error } = await supabase
            .from('retail-store-inventory-item')
            .select(`
              inventory-id,
              tenant-id,  
              current-stock-quantity,
              selling-price-amount,
              custom-product-name,
              global-product-master-catalog!global-product-id (
                product-id,
                product-name,
                upc-ean-code,
                image-url,
                category-name,
                manufacturer-name,
                enriched-by-superadmin
              )
            `);

          if (error) throw error;

          // 2. FORCE FILTER ON FRONTEND (Safety Net)
          const filteredData = (data || []).filter((row: any) => row['tenant-id'] === myTenantId);

          const processed: InventoryItem[] = filteredData.map((row: any) => {
            const gp = row['global-product-master-catalog'] || {};
            return {
              inventory_id: row['inventory-id'],
              product_id: gp['product-id'],
              name: row['custom-product-name'] || gp['product-name'] || 'Unknown',
              sku: gp['upc-ean-code'] || 'N/A',
              image: row['override-image-url'] || gp['image-url'] || '',
              category: gp['category-name'] || 'Uncategorized',
              manufacturer: gp['manufacturer-name'] || 'N/A',
              total_qty: row['current-stock-quantity'] || 0,
              sales_price: row['selling-price-amount'] || 0,
              is_enriched: gp['enriched-by-superadmin'] || false
            };
          });

          setInventoryItems(processed);
          setExistingProductIds(new Set(processed.map(i => i.product_id)));
        }

      } else {
        // Fetch Global Catalog
        const { data, error } = await supabase
          .from('global-product-master-catalog')
          .select('*')
          .eq('is-active', true)
          .order('product-name');

        if (error) throw error;

        const processed: GlobalProduct[] = (data || []).map((row: any) => ({
          product_id: row['product-id'],
          name: row['product-name'],
          sku: row['upc-ean-code'],
          image: row['image-url'],
          category: row['category-name'],
          brand: row['brand-name'],
          manufacturer: row['manufacturer-name'],
          is_active: row['is-active'],
          is_enriched: row['enriched-by-superadmin']
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

  const handleAddToStore = async (product: GlobalProduct) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roleData } = await supabase
        .from('tenant-user-role')
        .select('tenant-id')
        .eq('user-id', user.id)
        .single();

      if (!roleData) return;

      const { error } = await supabase
        .from('retail-store-inventory-item')
        .insert({
          'tenant-id': (roleData as any)['tenant-id'],
          'global-product-id': product.product_id,
          'current-stock-quantity': 0,
          'selling-price-amount': 0,
          'is-active': true
        });

      if (error) throw error;

      toast.success("Product added to your inventory!");
      setExistingProductIds(prev => new Set(prev).add(product.product_id));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditForm({ name: item.name, price: item.sales_price, stock: item.total_qty });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('retail-store-inventory-item')
        .update({
          'custom-product-name': editForm.name,
          'selling-price-amount': editForm.price,
          'current-stock-quantity': editForm.stock
        })
        .eq('inventory-id', editingItem.inventory_id);

      if (error) throw error;

      toast.success("Product updated successfully!");
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from your inventory?`)) return;

    try {
      const { error } = await supabase
        .from('retail-store-inventory-item')
        .delete()
        .eq('inventory-id', item.inventory_id);

      if (error) throw error;

      toast.success("Product deleted successfully!");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete product");
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
                <th className="px-6 py-3 font-medium">Manufacturer</th>
                {activeTab === 'my-inventory' ? (
                  <>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-center">Stock</th>
                    <th className="px-6 py-3 font-medium text-center">Actions</th>
                  </>
                ) : (
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading...</td></tr>
              ) : displayedItems.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-400">No items found.</td></tr>
              ) : displayedItems.map((item: any) => (
                <tr key={item.inventory_id || item.product_id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md shrink-0 overflow-hidden border border-gray-200 relative group/img">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Package className="p-2 text-gray-400" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{item.category}</td>
                  <td className="px-6 py-3 text-gray-600">{item.manufacturer}</td>

                  {activeTab === 'my-inventory' ? (
                    <>
                      <td className="px-6 py-3 text-right font-bold text-gray-900 text-sm">${item.sales_price.toFixed(2)}</td>
                      <td className="px-6 py-3 text-center font-bold text-gray-900">{item.total_qty}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-3 text-right">
                      {existingProductIds.has(item.product_id) ? (
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

        {/* EDIT MODAL */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="text-blue-600" size={20} />
                  Edit Product
                </h2>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Stock</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}