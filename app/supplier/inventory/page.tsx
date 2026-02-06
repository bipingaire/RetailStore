'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Package, Search, RefreshCw, AlertTriangle, 
  CheckCircle, ArrowUpRight, Edit2, Save, X, Warehouse, MapPin 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type WarehouseLocation = {
  id: string;
  name: string;
  type: 'DC' | 'Warehouse';
  location: string;
};

type SupplierProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  wholesale_price: number;
  moq: number;
  stock_by_location: Record<string, number>; // { warehouse_id: quantity }
  last_synced: string;
  status: 'synced' | 'manual_override' | 'low_stock';
};

export default function SupplierInventoryPage() {
  const [inventory, setInventory] = useState<SupplierProduct[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingItem, setEditingItem] = useState<string | null>(null); 
  const [editForm, setEditForm] = useState<Partial<SupplierProduct>>({});

  useEffect(() => {
    // 1. Mock Warehouses (In production, fetch from 'distribution_centers' table)
    const mockWarehouses: WarehouseLocation[] = [
      { id: 'wh-nj', name: 'NJ Distribution Hub', type: 'DC', location: 'Newark, NJ' },
      { id: 'wh-ca', name: 'West Coast Depot', type: 'Warehouse', location: 'Los Angeles, CA' },
      { id: 'wh-tx', name: 'Southern Fulfillment', type: 'DC', location: 'Dallas, TX' },
    ];
    setWarehouses(mockWarehouses);

    // 2. Mock Inventory Data with Location Splits
    const mockData: SupplierProduct[] = [
      { 
        id: '1', name: "Heinz Tomato Ketchup (24x20oz)", sku: "HJZ-9982", category: "Condiments", 
        wholesale_price: 45.00, moq: 5, 
        stock_by_location: { 'wh-nj': 800, 'wh-ca': 400, 'wh-tx': 0 }, 
        last_synced: new Date().toISOString(), status: 'synced' 
      },
      { 
        id: '2', name: "Coca-Cola Classic (12x2L)", sku: "CCE-1120", category: "Beverages", 
        wholesale_price: 18.50, moq: 10, 
        stock_by_location: { 'wh-nj': 200, 'wh-ca': 150, 'wh-tx': 100 }, 
        last_synced: new Date().toISOString(), status: 'synced' 
      },
      { 
        id: '3', name: "Chobani Greek Yogurt Variety", sku: "CHB-3341", category: "Dairy", 
        wholesale_price: 32.00, moq: 2, 
        stock_by_location: { 'wh-nj': 40, 'wh-ca': 45, 'wh-tx': 0 }, 
        last_synced: new Date(Date.now() - 86400000).toISOString(), status: 'low_stock' 
      },
      { 
        id: '4', name: "Doritos Nacho Cheese (Case)", sku: "FRT-5521", category: "Snacks", 
        wholesale_price: 24.00, moq: 5, 
        stock_by_location: { 'wh-nj': 1000, 'wh-ca': 800, 'wh-tx': 200 }, 
        last_synced: new Date().toISOString(), status: 'synced' 
      },
      { 
        id: '5', name: "Generic Paper Towels (Bulk)", sku: "GEN-8822", category: "Household", 
        wholesale_price: 15.00, moq: 20, 
        stock_by_location: { 'wh-nj': 0, 'wh-ca': 0, 'wh-tx': 0 }, 
        last_synced: new Date().toISOString(), status: 'manual_override' 
      },
    ];
    setInventory(mockData);
    setLoading(false);
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Inventory successfully synced with ERP (Multi-Location).");
    }, 2000);
  };

  const startEdit = (item: SupplierProduct) => {
    setEditingItem(item.id);
    // Deep copy the stock map to avoid direct mutation issues
    setEditForm({ 
      wholesale_price: item.wholesale_price,
      stock_by_location: { ...item.stock_by_location } 
    });
  };

  const updateEditStock = (whId: string, val: number) => {
    setEditForm(prev => ({
      ...prev,
      stock_by_location: {
        ...prev.stock_by_location,
        [whId]: val
      }
    }));
  };

  const saveEdit = (id: string) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        ...editForm, 
        status: 'manual_override', 
        last_synced: new Date().toISOString() 
      } : item
    ));
    setEditingItem(null);
  };

  const getTotalStock = (item: SupplierProduct) => {
    return Object.values(item.stock_by_location).reduce((a, b) => a + b, 0);
  };

  const getFilteredStock = (item: SupplierProduct) => {
    if (selectedLocation === 'all') return getTotalStock(item);
    return item.stock_by_location[selectedLocation] || 0;
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-purple-600" />
            Live Inventory
          </h1>
          <p className="text-gray-500 mt-1">Manage stock across {warehouses.length} locations.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Warehouse Selector */}
          <div className="relative">
            <Warehouse className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg bg-white text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Locations (Global)</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-48 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <button 
            onClick={handleSync}
            disabled={syncing}
            className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-70 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync ERP'}
          </button>
        </div>
      </header>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 w-64">
                {selectedLocation === 'all' ? 'Total Stock' : `Stock @ ${warehouses.find(w => w.id === selectedLocation)?.name}`}
              </th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map((item) => {
              const currentStock = getFilteredStock(item);
              const totalStock = getTotalStock(item);
              const isEditing = editingItem === item.id;

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition group">
                  
                  {/* Product Info */}
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.sku}</div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-4 text-right font-mono">
                    {isEditing ? (
                      <input 
                        type="number" 
                        className="w-20 border rounded p-1 text-right focus:ring-2 focus:ring-purple-500 outline-none"
                        value={editForm.wholesale_price}
                        onChange={(e) => setEditForm({...editForm, wholesale_price: parseFloat(e.target.value)})}
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">${item.wholesale_price.toFixed(2)}</span>
                    )}
                    <div className="text-[10px] text-gray-400">MOQ: {item.moq}</div>
                  </td>

                  {/* Stock Level (Multi-Location Edit Logic) */}
                  <td className="p-4">
                    {isEditing ? (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        {warehouses.map(w => (
                          <div key={w.id} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 truncate max-w-[100px]" title={w.name}>{w.name}</span>
                            <input 
                              type="number" 
                              className="w-20 border rounded p-1 text-right bg-white focus:ring-1 focus:ring-purple-500"
                              value={editForm.stock_by_location?.[w.id] || 0}
                              onChange={(e) => updateEditStock(w.id, parseInt(e.target.value) || 0)}
                            />
                          </div>
                        ))}
                        <div className="pt-1 mt-1 border-t flex justify-between font-bold text-xs">
                          <span>Total:</span>
                          <span>
                            {editForm.stock_by_location 
                              ? Object.values(editForm.stock_by_location).reduce((a:number, b:number) => a + b, 0) 
                              : 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                         <span className={`font-bold text-lg ${currentStock < 50 ? 'text-red-600' : 'text-gray-900'}`}>
                           {currentStock.toLocaleString()}
                         </span>
                         
                         {/* Utilization Bar */}
                         <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                           <div 
                             className={`h-full rounded-full ${currentStock < 100 ? 'bg-red-500' : 'bg-green-500'}`} 
                             style={{ width: `${Math.min(100, (currentStock / 1000) * 100)}%` }}
                           />
                         </div>

                         {/* Tooltip hint if global view */}
                         {selectedLocation === 'all' && (
                           <div className="text-[10px] text-gray-400">
                             across {Object.keys(item.stock_by_location).length} sites
                           </div>
                         )}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-4 text-right">
                    {item.status === 'low_stock' || totalStock < 100 ? (
                      <div className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">
                        <AlertTriangle size={12} /> Low Stock
                      </div>
                    ) : item.status === 'manual_override' ? (
                      <div className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold">
                        <Edit2 size={12} /> Manual
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                        <CheckCircle size={12} /> Synced
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400 mt-1">
                      {new Date(item.last_synced).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveEdit(item.id)} className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded shadow"><Save size={14}/></button>
                        <button onClick={() => setEditingItem(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-1.5 rounded"><X size={14}/></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEdit(item)}
                        className="text-gray-400 hover:text-purple-600 hover:bg-purple-50 p-2 rounded transition"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredInventory.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            No products found matching "{searchTerm}".
          </div>
        )}
      </div>

    </div>
  );
}