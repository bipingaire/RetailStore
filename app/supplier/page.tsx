'use client';
import { useState } from 'react';
import { Users, TrendingUp, Package, MapPin, Phone, MessageSquare } from 'lucide-react';

export default function SupplierDashboard() {
  // Mock Data - In real app fetch from 'supplier_retailer_contracts'
  const connectedStores = [
    { id: 1, name: "Downtown Market", city: "New York, NY", status: "Active", last_order: "2 mins ago" },
    { id: 2, name: "Bob's Grocery", city: "Brooklyn, NY", status: "Active", last_order: "Yesterday" },
    { id: 3, name: "Green Earth Organics", city: "Queens, NY", status: "Pending", last_order: "Never" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Global Distribution Inc.</p>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">Active Retailers</div>
          <div className="text-3xl font-black text-gray-900">124</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">Orders Today</div>
          <div className="text-3xl font-black text-blue-600">45</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">Revenue (Mo)</div>
          <div className="text-3xl font-black text-green-600">$84k</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 text-xs font-bold uppercase mb-1">Low Stock SKUs</div>
          <div className="text-3xl font-black text-red-500">12</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Connected Stores List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Users className="text-purple-600" /> Connected Retailers
            </h2>
            <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {connectedStores.map(store => (
              <div key={store.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {store.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{store.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={10} /> {store.city}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${store.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {store.status}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">Last Order: {store.last_order}</div>
                  </div>
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="Message Retailer">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Live Feed
          </h2>
          <div className="space-y-6">
            {[1,2,3].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-800"><b>Bob's Grocery</b> placed a new PO for <b>2 Pallets</b>.</p>
                  <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}