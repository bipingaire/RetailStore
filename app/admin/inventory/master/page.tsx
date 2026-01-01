'use client';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Filter, Package, Truck, ArrowUpDown, Info, Edit3, Save } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  margin: number; // calculated
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
  const [editPrice, setEditPrice] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editPack, setEditPack] = useState<string>('');
  const [editUom, setEditUom] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      // Fetch Inventory + Global Products + Vendors + Batches
      const { data, error } = await supabase
        .from('store_inventory')
        .select(`
          id, price, local_name, local_image_url, local_category, local_pack_quantity, local_uom,
          global_products ( name, upc_ean, image_url, category, pack_quantity, uom, manufacturer ),
          vendors ( name ),
          inventory_batches ( batch_quantity, cost_basis, arrival_date, expiry_date )
        `)
        .eq('is_active', true);

      // Vendors master list for filters
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('name')
        .order('name', { ascending: true });

      if (error) {
        console.error("Error loading master inventory", error);
        return;
      }

      const processed: MasterItem[] = (data || []).map((row: any) => {
        const batches = row.inventory_batches || [];
        const totalQty = batches.reduce((sum: number, b: any) => sum + b.batch_quantity, 0);
        const totalValue = batches.reduce((sum: number, b: any) => sum + (b.batch_quantity * (b.cost_basis || 0)), 0);
        const avgCost = totalQty > 0 ? totalValue / totalQty : 0;
        const salesPrice = row.price || 0;
        const margin = salesPrice > 0 ? ((salesPrice - avgCost) / salesPrice) * 100 : 0;
        const lastArrival = batches.length > 0 
            ? batches.sort((a: any, b: any) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime())[0].arrival_date 
            : 'N/A';
        const nextExpiry = batches
          .filter((b: any) => b.expiry_date)
          .sort((a: any, b: any) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())[0]?.expiry_date || null;

        const gp = row.global_products || {};
        const name = row.local_name || gp.name || 'Unknown';
        const image = row.local_image_url || gp.image_url || '';
        const category = row.local_category || gp.category || 'Uncategorized';
        const pack = row.local_pack_quantity ?? gp.pack_quantity ?? null;
        const uom = row.local_uom || gp.uom || null;

        return {
          id: row.id,
          name,
          sku: gp.upc_ean || 'N/A',
          image,
          category,
          vendor_name: row.vendors?.name || 'Unassigned',
          total_qty: totalQty,
          avg_unit_cost: avgCost,
          sales_price: salesPrice,
          margin,
          pack,
          uom,
          last_received: lastArrival,
          expiry_soon: nextExpiry,
        };
      });

      setItems(processed);
      setFilteredItems(processed);
      setVendorOptions(
        Array.from(
          new Set([
            'All',
            ...(vendorData || []).map((v: any) => v.name || 'Unassigned'),
            ...processed.map((p) => p.vendor_name || 'Unassigned'),
          ])
        ).filter(Boolean)
      );
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter / sort Logic
  useEffect(() => {
    let result = items;
    if (searchTerm) result = result.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm));
    if (filterVendor !== 'All') result = result.filter(i => i.vendor_name === filterVendor);
    if (filterCategory !== 'All') result = result.filter(i => i.category === filterCategory);

    if (sortKey === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'price') result = [...result].sort((a, b) => b.sales_price - a.sales_price);
    if (sortKey === 'expiry') result = [...result].sort((a, b) => {
      const ax = a.expiry_soon ? new Date(a.expiry_soon).getTime() : Number.POSITIVE_INFINITY;
      const bx = b.expiry_soon ? new Date(b.expiry_soon).getTime() : Number.POSITIVE_INFINITY;
      return ax - bx;
    });

    setFilteredItems(result);
  }, [searchTerm, filterVendor, filterCategory, sortKey, items]);

  const vendorsList = useMemo(
    () => (vendorOptions.length ? vendorOptions : Array.from(new Set(items.map(i => i.vendor_name)))),
    [vendorOptions, items]
  );
  const categoriesList = useMemo(() => Array.from(new Set(items.map(i => i.category))), [items]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="text-blue-600" />
                Master Inventory Ledger
            </h1>
            <p className="text-gray-500 mt-1">Comprehensive view of all products, costs, and vendor relationships.</p>
        </header>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search by name or SKU..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter size={18} className="text-gray-400" />
                <select 
                    className="border p-2 rounded-lg text-sm bg-gray-50"
                    value={filterVendor}
                    onChange={(e) => setFilterVendor(e.target.value)}
                >
                    <option value="All">All Vendors</option>
                    {vendorsList.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select 
                    className="border p-2 rounded-lg text-sm bg-gray-50"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={() => setSortKey('name')}
                  className={`border px-3 py-2 rounded-lg text-sm ${sortKey==='name'?'bg-blue-50 border-blue-200 text-blue-700':'bg-white'}`}
                >
                  Name <ArrowUpDown className="inline w-4 h-4" />
                </button>
                <button
                  onClick={() => setSortKey('price')}
                  className={`border px-3 py-2 rounded-lg text-sm ${sortKey==='price'?'bg-blue-50 border-blue-200 text-blue-700':'bg-white'}`}
                >
                  Price <ArrowUpDown className="inline w-4 h-4" />
                </button>
                <button
                  onClick={() => setSortKey('expiry')}
                  className={`border px-3 py-2 rounded-lg text-sm ${sortKey==='expiry'?'bg-blue-50 border-blue-200 text-blue-700':'bg-white'}`}
                >
                  Expiry <ArrowUpDown className="inline w-4 h-4" />
                </button>
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b">
                    <tr>
                        <th className="p-4">Product Details</th>
                        <th className="p-4">Vendor</th>
                        <th className="p-4 text-right">Cost (Avg)</th>
                        <th className="p-4 text-right">Sales Price</th>
                        <th className="p-4 text-right">Margin</th>
                        <th className="p-4 text-center">Stock</th>
                        <th className="p-4 text-right">Last Received</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={7} className="p-10 text-center text-gray-400">Loading Master Data...</td></tr>
                    ) : filteredItems.length === 0 ? (
                        <tr><td colSpan={7} className="p-10 text-center text-gray-400">No items found.</td></tr>
                    ) : filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition group" onClick={() => {
                          setDetail(item);
                          setEditPrice(item.sales_price.toString());
                          setEditName(item.name);
                          setEditImage(item.image || '');
                          setEditCategory(item.category);
                          setEditPack(item.pack?.toString() || '');
                          setEditUom(item.uom || '');
                        }}>
                            <td className="p-4 flex items-center gap-3 cursor-pointer">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : "IMG"}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 flex items-center gap-1">{item.name} <Info className="w-4 h-4 text-gray-300 group-hover:text-blue-500" /></div>
                                    <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                                    <div className="text-[11px] text-gray-400">{item.pack ? `Case: ${item.pack} ${item.uom || ''}` : item.uom || ''}</div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Truck size={14} className="text-gray-400"/> {item.vendor_name}
                                </div>
                                <div className="text-xs text-gray-400 pl-6">{item.category}</div>
                            </td>
                            <td className="p-4 text-right font-mono text-gray-600">
                                ${item.avg_unit_cost.toFixed(2)}
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-gray-900">
                                ${item.sales_price.toFixed(2)}
                            </td>
                            <td className="p-4 text-right">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.margin > 30 ? 'bg-green-100 text-green-700' : item.margin > 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.margin.toFixed(1)}%
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <span className="font-bold text-lg">{item.total_qty}</span>
                                {item.expiry_soon && (
                                  <div className="text-[11px] text-red-600">Exp: {new Date(item.expiry_soon).toLocaleDateString()}</div>
                                )}
                            </td>
                            <td className="p-4 text-right text-gray-500 text-xs">
                                {item.last_received !== 'N/A' ? new Date(item.last_received).toLocaleDateString() : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* DETAIL DRAWER */}
        {detail && (
          <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="text-blue-600" />
                  <h3 className="font-bold text-xl text-gray-900">Edit Item</h3>
                </div>
                <button onClick={() => setDetail(null)} className="text-sm text-gray-500 hover:text-gray-800">Close</button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center">
                    {editImage ? <img src={editImage} className="w-full h-full object-cover" /> : 'IMG'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs text-gray-500">Image URL</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Name</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Category</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Vendor</label>
                    <div className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600">
                      {detail.vendor_name}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Case Qty</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editPack}
                      onChange={(e) => setEditPack(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Unit (UOM)</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editUom}
                      onChange={(e) => setEditUom(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Avg Cost (from invoices)</label>
                    <div className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700">
                      ${detail.avg_unit_cost.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Sales Price (POS)</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const priceNum = parseFloat(editPrice || '0') || 0;
                    const packNum = editPack ? parseInt(editPack, 10) : null;
                    await supabase
                      .from('store_inventory')
                      .update({
                        price: priceNum,
                        local_name: editName || null,
                        local_image_url: editImage || null,
                        local_category: editCategory || null,
                        local_pack_quantity: packNum,
                        local_uom: editUom || null,
                      })
                      .eq('id', detail.id);
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === detail.id
                          ? {
                              ...i,
                              sales_price: priceNum,
                              name: editName,
                              image: editImage,
                              category: editCategory,
                              pack: packNum,
                              uom: editUom,
                            }
                          : i
                      )
                    );
                    setDetail(null);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}