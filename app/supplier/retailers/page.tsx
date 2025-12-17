'use client';
import { useState, useEffect } from 'react';
import { 
  Users, MapPin, Phone, Mail, Clock, TrendingUp, 
  Package, Warehouse, UserPlus, Check, X, Search, 
  ArrowRight, FileText, Calendar 
} from 'lucide-react';

// --- TYPES ---
type PurchaseStat = {
  total_spent_ytd: number;
  avg_order_value: number;
  order_count: number;
  last_order_date: string;
};

type RetailerProfile = {
  id: string;
  name: string;
  location: string; // City, State
  address_full: string;
  contact_person: string;
  phone: string;
  email: string;
  status: 'active' | 'suspended';
  joined_date: string;
  
  // Logistics Data
  primary_warehouse_id: string;
  primary_warehouse_name: string;
  avg_lead_time_hours: number;
  
  // Analytics
  stats: PurchaseStat;
  top_products: { name: string; qty: number }[];
  recent_orders: { id: string; date: string; amount: number; items: number }[];
};

type ConnectionRequest = {
  id: string;
  store_name: string;
  location: string;
  requested_at: string;
  note: string;
};

export default function RetailerNetworkPage() {
  const [retailers, setRetailers] = useState<RetailerProfile[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock Data Loading
    setTimeout(() => {
      setRequests([
        { id: 'req-1', store_name: "Fresh Foods Market", location: "Jersey City, NJ", requested_at: new Date().toISOString(), note: "Looking for organic produce supplier." },
        { id: 'req-2', store_name: "City Corner Bodega", location: "Brooklyn, NY", requested_at: new Date(Date.now() - 86400000).toISOString(), note: "Need reliable beverage distributor." }
      ]);

      setRetailers([
        {
          id: 'ret-101',
          name: "Downtown Market",
          location: "New York, NY",
          address_full: "123 Broadway, New York, NY 10013",
          contact_person: "John Smith",
          phone: "(212) 555-0199",
          email: "procurement@downtownmarket.com",
          status: 'active',
          joined_date: "2023-01-15",
          primary_warehouse_id: "wh-nj",
          primary_warehouse_name: "NJ Distribution Center",
          avg_lead_time_hours: 26,
          stats: {
            total_spent_ytd: 45200.00,
            avg_order_value: 1250.00,
            order_count: 36,
            last_order_date: new Date(Date.now() - 172800000).toISOString()
          },
          top_products: [
            { name: "Heinz Ketchup", qty: 1200 },
            { name: "Coca-Cola 2L", qty: 950 },
            { name: "Chobani Greek Yogurt", qty: 800 }
          ],
          recent_orders: [
            { id: "PO-2023-088", date: "2023-10-25", amount: 1450.00, items: 12 },
            { id: "PO-2023-072", date: "2023-10-18", amount: 980.50, items: 8 },
            { id: "PO-2023-065", date: "2023-10-10", amount: 2100.00, items: 24 },
          ]
        },
        {
          id: 'ret-102',
          name: "Green Earth Organics",
          location: "Queens, NY",
          address_full: "45 Queens Blvd, Queens, NY 11104",
          contact_person: "Sarah Green",
          phone: "(718) 555-0222",
          email: "manager@greenearth.com",
          status: 'active',
          joined_date: "2023-03-10",
          primary_warehouse_id: "wh-li",
          primary_warehouse_name: "Long Island Hub",
          avg_lead_time_hours: 48,
          stats: {
            total_spent_ytd: 28400.00,
            avg_order_value: 850.00,
            order_count: 33,
            last_order_date: new Date(Date.now() - 86400000 * 5).toISOString()
          },
          top_products: [
            { name: "Organic Avocados", qty: 500 },
            { name: "Almond Milk", qty: 420 },
            { name: "Free-Range Eggs", qty: 300 }
          ],
          recent_orders: [
            { id: "PO-2023-091", date: "2023-10-22", amount: 850.00, items: 15 },
            { id: "PO-2023-084", date: "2023-10-15", amount: 720.00, items: 10 }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAcceptRequest = (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    // In real app: API call to create contract
    const newRetailer: RetailerProfile = {
      id: `ret-${Date.now()}`,
      name: req.store_name,
      location: req.location,
      address_full: "Pending Address Update",
      contact_person: "Pending",
      phone: "Pending",
      email: "pending@store.com",
      status: 'active',
      joined_date: new Date().toISOString(),
      primary_warehouse_id: "wh-default",
      primary_warehouse_name: "Main Distribution Center",
      avg_lead_time_hours: 0,
      stats: { total_spent_ytd: 0, avg_order_value: 0, order_count: 0, last_order_date: "Never" },
      top_products: [],
      recent_orders: []
    };

    setRetailers([newRetailer, ...retailers]);
    setRequests(requests.filter(r => r.id !== id));
    alert(`${req.store_name} added to your network!`);
  };

  const handleRejectRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="text-purple-600" />
          Retailer Network
        </h1>
        <p className="text-gray-500 mt-1">Manage partner relationships and connection requests.</p>
      </header>

      {/* 1. CONNECTION REQUESTS */}
      {requests.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus size={16} /> New Requests ({requests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 flex justify-between items-start animate-in slide-in-from-top-2">
                <div>
                  <div className="font-bold text-lg text-gray-900">{req.store_name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin size={12} /> {req.location}
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded italic border">
                    "{req.note}"
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2">
                    Requested: {new Date(req.requested_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleAcceptRequest(req.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition" 
                    title="Accept"
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    onClick={() => handleRejectRequest(req.id)}
                    className="bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 text-gray-400 p-2 rounded-lg transition"
                    title="Reject"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. RETAILER DIRECTORY */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search retailers..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-purple-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {retailers.length} Active Partners
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
            <tr>
              <th className="p-4">Retailer Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Primary Warehouse</th>
              <th className="p-4 text-right">YTD Spend</th>
              <th className="p-4 text-right">Last Order</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {retailers
              .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((retailer) => (
              <tr 
                key={retailer.id} 
                className="hover:bg-blue-50/50 transition cursor-pointer group"
                onClick={() => setSelectedRetailer(retailer)}
              >
                <td className="p-4">
                  <div className="font-bold text-gray-900">{retailer.name}</div>
                  <div className="text-xs text-gray-400">{retailer.contact_person}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin size={12}/> {retailer.location}</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                    <Warehouse size={12}/> {retailer.primary_warehouse_name}
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-medium text-gray-900">
                  ${retailer.stats.total_spent_ytd.toLocaleString()}
                </td>
                <td className="p-4 text-right text-sm text-gray-500">
                  {new Date(retailer.stats.last_order_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-400 group-hover:text-blue-500">
                  <ArrowRight size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. DETAIL MODAL */}
      {selectedRetailer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-gray-900 text-white p-8 flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                  {selectedRetailer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selectedRetailer.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {selectedRetailer.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> Partner since {new Date(selectedRetailer.joined_date).getFullYear()}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedRetailer(null)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              
              {/* Top Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Orders</div>
                  <div className="text-2xl font-black text-gray-900">{selectedRetailer.stats.order_count}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Avg Lead Time</div>
                  <div className="text-2xl font-black text-blue-600">{selectedRetailer.avg_lead_time_hours}h</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Avg Order Val</div>
                  <div className="text-2xl font-black text-green-600">${selectedRetailer.stats.avg_order_value.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Primary Warehouse</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">{selectedRetailer.primary_warehouse_name}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Contact & Popular */}
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users size={18} className="text-purple-600"/> Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">POC</span>
                        <span className="font-medium">{selectedRetailer.contact_person}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Phone</span>
                        <span className="font-medium">{selectedRetailer.phone}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-blue-600">{selectedRetailer.email}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-gray-500 block mb-1">Billing Address</span>
                        <span className="font-medium">{selectedRetailer.address_full}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-orange-600"/> Top Purchased Items
                    </h3>
                    <div className="space-y-3">
                      {selectedRetailer.top_products.map((prod, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-50 text-orange-600 w-6 h-6 rounded flex items-center justify-center font-bold text-xs">
                              {i + 1}
                            </div>
                            <span className="font-medium text-gray-800">{prod.name}</span>
                          </div>
                          <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {prod.qty.toLocaleString()} units
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchase History */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600"/> Recent Order History
                  </h3>
                  <div className="overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-gray-500 bg-gray-50 text-xs uppercase font-bold">
                        <tr>
                          <th className="p-3">PO Number</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedRetailer.recent_orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-3 font-mono text-blue-600">{order.id}</td>
                            <td className="p-3 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="p-3 text-right font-bold">${order.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 text-center">
                      <button className="text-xs font-bold text-blue-600 hover:underline">View All Orders</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}