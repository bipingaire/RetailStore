'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Package, Truck, ArrowUpDown, Info, Edit3, Save, X } from 'lucide-react';

import { supabase } from '@/lib/supabase';

type MasterItem = {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  vendor_name: string;
  total_qty: number;
  avg_unit_cost: number;
  sales_price: number;
  margin: number;
  pack: number | null;
  uom: string | null;
  last_received: string;
  expiry_soon: string | null;
};

export default function MasterInventoryPage() {
  const [items, setItems] = useState<MasterItem[]>([]);

  const [filteredItems, setFilteredItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendor, setFilterVendor] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<'name' | 'price' | 'expiry'>('name');
  const [detail, setDetail] = useState<MasterItem | null>(null);

  // Edit states
  const [editPrice, setEditPrice] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editPack, setEditPack] = useState<string>('');
  const [editUom, setEditUom] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('retail-store-inventory-item')
        .select(`
          id:"inventory-id",
          local_name:"product-name",
          local_image_url:"image-url",
          local_category:"category-name",
          price:"selling-price-amount",
          global_products:"global-product-master-catalog"!"global-product-id" ( name:"product-name", upc_ean:"upc-ean-code", image_url:"image-url", category:"category-name", pack_quantity:"package-size", manufacturer:"manufacturer-name" ),
          batches:"inventory-batch-tracking-record" ( batch_quantity:"batch-quantity-count", cost_basis:"cost-per-unit-amount", arrival_date:created_at, expiry_date:"expiry-date-timestamp" )
        `)
        .eq('is-active-flag', true);

      // Note: Vendors join removed as it might not be directly linked in new schema or needs different path.
      // Assuming vendor info comes from elsewhere or we skip for now to fix errors.
      // If needed, we might need to join via a different path or fetch separately.
      const { data: vendorData } = await supabase.from('vendors').select('name').order('name');
      if (error) return;

      const processed: MasterItem[] = (data || []).map((row: any) => {
        const batches = row.inventory_batches || [];
        const totalQty = batches.reduce((sum: number, b: any) => sum + b.batch_quantity, 0);
        const totalValue = batches.reduce((sum: number, b: any) => sum + (b.batch_quantity * (b.cost_basis || 0)), 0);
        const avgCost = totalQty > 0 ? totalValue / totalQty : 0;
        const salesPrice = row.price || 0;
        const margin = salesPrice > 0 ? ((salesPrice - avgCost) / salesPrice) * 100 : 0;
        const lastArrival = batches.length > 0 ? batches.sort((a: any, b: any) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime())[0].arrival_date : 'N/A';
        const nextExpiry = batches.filter((b: any) => b.expiry_date).sort((a: any, b: any) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())[0]?.expiry_date || null;
        const gp = row.global_products || {};

        return {
          id: row.id,
          name: row.local_name || gp.name || 'Unknown',
          sku: gp.upc_ean || 'N/A',
          image: row.local_image_url || gp.image_url || '',
          category: row.local_category || gp.category || 'Uncategorized',
          vendor_name: row.vendors?.name || 'Unassigned',
          total_qty: totalQty,
          avg_unit_cost: avgCost,
          sales_price: salesPrice,
          margin,
          pack: row.local_pack_quantity ?? gp.pack_quantity ?? null,
          uom: row.local_uom || gp.uom || null,
          last_received: lastArrival,
          expiry_soon: nextExpiry,
        };
      });

      setItems(processed);
      setFilteredItems(processed);
      setVendorOptions(Array.from(new Set(['All', ...(vendorData || []).map((v: any) => v.name), ...processed.map((p) => p.vendor_name)])).filter(Boolean));
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = items;
    if (searchTerm) result = result.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm));
    if (filterVendor !== 'All') result = result.filter(i => i.vendor_name === filterVendor);
    if (filterCategory !== 'All') result = result.filter(i => i.category === filterCategory);

    if (sortKey === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'price') result.sort((a, b) => b.sales_price - a.sales_price);
    if (sortKey === 'expiry') result.sort((a, b) => (a.expiry_soon ? new Date(a.expiry_soon).getTime() : Infinity) - (b.expiry_soon ? new Date(b.expiry_soon).getTime() : Infinity));

    setFilteredItems([...result]);
  }, [searchTerm, filterVendor, filterCategory, sortKey, items]);

  const vendorsList = useMemo(() => vendorOptions.length ? vendorOptions : Array.from(new Set(items.map(i => i.vendor_name))), [vendorOptions, items]);
  const categoriesList = useMemo(() => Array.from(new Set(items.map(i => i.category))), [items]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-blue-600" /> Master Inventory Ledger
          </h1>
          <p className="text-sm text-gray-500 mt-1">Global view of all products, costs, and data.</p>
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

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter size={16} className="text-gray-400 shrink-0" />
            <select className="border border-gray-200 p-2 rounded-lg text-sm bg-white outline-none focus:border-blue-500" value={filterVendor} onChange={(e) => setFilterVendor(e.target.value)}>
              <option value="All">All Vendors</option>
              {vendorsList.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="border border-gray-200 p-2 rounded-lg text-sm bg-white outline-none focus:border-blue-500" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button onClick={() => setSortKey('name')} className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${sortKey === 'name' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Name</button>
            <button onClick={() => setSortKey('price')} className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${sortKey === 'price' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Price</button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Vendor</th>
                <th className="px-6 py-3 font-medium text-right">Cost (Avg)</th>
                <th className="px-6 py-3 font-medium text-right">Price</th>
                <th className="px-6 py-3 font-medium text-right">Margin</th>
                <th className="px-6 py-3 font-medium text-center">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-400">No items found.</td></tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => {
                  setDetail(item);
                  setEditPrice(item.sales_price.toString());
                  setEditName(item.name);
                  setEditImage(item.image || '');
                  setEditCategory(item.category);
                  setEditPack(item.pack?.toString() || '');
                  setEditUom(item.uom || '');
                }}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-md shrink-0 overflow-hidden border border-gray-200">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-gray-700 flex items-center gap-1.5"><Truck size={12} className="text-gray-400" /> {item.vendor_name}</div>
                    <div className="text-xs text-gray-400 pl-4">{item.category}</div>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-gray-600 text-xs">${item.avg_unit_cost.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-bold text-gray-900 text-sm">${item.sales_price.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.margin > 30 ? 'bg-green-50 border-green-100 text-green-700' : item.margin > 15 ? 'bg-yellow-50 border-yellow-100 text-yellow-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                      {item.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="font-bold text-gray-900">{item.total_qty}</div>
                    {item.expiry_soon && <div className="text-[10px] text-red-500 font-medium">Exp {new Date(item.expiry_soon).toLocaleDateString()}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DRAWER */}
        {detail && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end z-50 animate-in fade-in">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><Edit3 size={18} className="text-blue-600" /> Edit Product</h3>
                <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-lg border border-gray-200 shrink-0 overflow-hidden">
                    {editImage ? <img src={editImage} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-semibold text-gray-500">Image URL</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={editImage} onChange={(e) => setEditImage(e.target.value)} />
                    <div className="text-[10px] text-gray-400">Preview updates automatically</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Product Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900" value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Category</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">UOM / Unit</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={editUom} onChange={(e) => setEditUom(e.target.value)} />
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
                  <h4 className="text-xs font-bold text-blue-800 uppercase">Pricing & Economics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Avg Cost</label>
                      <div className="text-sm font-mono text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2">${detail.avg_unit_cost.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-400 mt-1">Calculated from batches</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-blue-700 block mb-1">Sales Price</label>
                      <input className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const priceNum = parseFloat(editPrice || '0') || 0;
                    const packNum = editPack ? parseInt(editPack, 10) : null;
                    await supabase.from('store_inventory').update({
                      price: priceNum,
                      local_name: editName || null,
                      local_image_url: editImage || null,
                      local_category: editCategory || null,
                      local_pack_quantity: packNum,
                      local_uom: editUom || null,
                    }).eq('id', detail.id);
                    setItems((prev) => prev.map((i) => i.id === detail.id ? { ...i, sales_price: priceNum, name: editName, image: editImage, category: editCategory, pack: packNum, uom: editUom } : i));
                    setDetail(null);
                  }}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}