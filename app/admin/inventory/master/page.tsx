'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Filter, TrendingUp, DollarSign, Package, Truck, ArrowRight } from 'lucide-react';

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
  last_received: string;
};

export default function MasterInventoryPage() {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendor, setFilterVendor] = useState('All');

  useEffect(() => {
    async function fetchData() {
      // Fetch Inventory + Global Products + Vendors + Batches
      const { data, error } = await supabase
        .from('store_inventory')
        .select(`
          id, price,
          global_products ( name, upc_ean, image_url, category ),
          vendors ( name ),
          inventory_batches ( batch_quantity, cost_basis, arrival_date )
        `)
        .eq('is_active', true);

      if (error) {
        console.error("Error loading master inventory", error);
        return;
      }

      const processed: MasterItem[] = (data || []).map((row: any) => {
        const batches = row.inventory_batches || [];
        const totalQty = batches.reduce((sum: number, b: any) => sum + b.batch_quantity, 0);
        
        // Calculate Weighted Average Cost
        const totalValue = batches.reduce((sum: number, b: any) => sum + (b.batch_quantity * (b.cost_basis || 0)), 0);
        const avgCost = totalQty > 0 ? totalValue / totalQty : 0;
        
        const salesPrice = row.price || 0;
        const margin = salesPrice > 0 ? ((salesPrice - avgCost) / salesPrice) * 100 : 0;
        
        // Find most recent arrival
        const lastArrival = batches.length > 0 
            ? batches.sort((a: any, b: any) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime())[0].arrival_date 
            : 'N/A';

        return {
            id: row.id,
            name: row.global_products?.name || 'Unknown',
            sku: row.global_products?.upc_ean || 'N/A',
            image: row.global_products?.image_url,
            category: row.global_products?.category || 'Uncategorized',
            vendor_name: row.vendors?.name || 'Unassigned',
            total_qty: totalQty,
            avg_unit_cost: avgCost,
            sales_price: salesPrice,
            margin: margin,
            last_received: lastArrival
        };
      });

      setItems(processed);
      setFilteredItems(processed);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = items;
    if (searchTerm) result = result.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.sku.includes(searchTerm));
    if (filterVendor !== 'All') result = result.filter(i => i.vendor_name === filterVendor);
    setFilteredItems(result);
  }, [searchTerm, filterVendor, items]);

  const vendorsList = Array.from(new Set(items.map(i => i.vendor_name)));

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
                        <tr key={item.id} className="hover:bg-blue-50/30 transition group">
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                                    {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : "IMG"}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
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
                            </td>
                            <td className="p-4 text-right text-gray-500 text-xs">
                                {item.last_received !== 'N/A' ? new Date(item.last_received).toLocaleDateString() : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}