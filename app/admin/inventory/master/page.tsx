'use client';
import { useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, Filter, Package, Truck, ArrowUpDown, Info, Edit3, Save, X, Plus, Globe, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import EditInventoryModal from './edit-modal';

// ... (Types remain same)

export default function MasterInventoryPage() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState<'my-inventory' | 'global-catalog'>('my-inventory');

  // Edit State
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  // ... (State & Fetch Data logic remains same)

  // ... (handleAddToStore remains same)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item from your inventory? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from('retail-store-inventory-item')
        .delete()
        .eq('inventory-id', id);

      if (error) throw error;

      toast.success("Item deleted.");
      setInventoryItems(prev => prev.filter(i => i.inventory_id !== id));
      setExistingProductIds(prev => {
        const next = new Set(prev);
        // We need to find the product_id for this inventory_id to remove from set, simpler to just re-fetch or ignore.
        // But let's try to remove it if possible.
        const item = inventoryItems.find(i => i.inventory_id === id);
        if (item) next.delete(item.product_id);
        return next;
      });

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete: " + err.message);
    }
  };

  const displayedItems = activeTab === 'my-inventory'
    ? inventoryItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm))
    : globalItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* ... Header & Controls ... */}
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
                {activeTab === 'my-inventory' && (
                  <>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-center">Stock</th>
                  </>
                )}
                <th className="px-6 py-3 font-medium text-right">Action</th>
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
                      <td className="px-6 py-3 text-right font-bold text-gray-900 text-sm">${item.sales_price?.toFixed(2)}</td>
                      <td className="px-6 py-3 text-center font-bold text-gray-900">{item.total_qty}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                            title="Edit Details"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.inventory_id)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                            title="Delete Item"
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

        {editItem && (
          <EditInventoryModal
            item={editItem}
            onClose={() => setEditItem(null)}
            onSuccess={fetchData}
          />
        )}

      </div>
    </div>
  );
}