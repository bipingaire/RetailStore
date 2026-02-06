'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Server, Truck, CreditCard, Save, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';

const SUPPLIER_TENANT_ID = 'PASTE_YOUR_SUPPLIER_UUID_HERE'; // Replace with real ID

export default function SupplierSettings() {
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  const [config, setConfig] = useState({
    erp_system: 'sap', // sap, oracle, netsuite, custom
    api_endpoint: '',
    api_key: '',
    sync_frequency: '1h',
    transport_rate_pallet: 150,
    transport_rate_mile: 2.50,
    payment_terms: ['Net 30', 'COD'],
    min_order_value: 500
  });

  // Mock API Test
  const testConnection = async () => {
    setLoading(true);
    // Simulate handshake
    setTimeout(() => {
      setApiStatus('connected');
      setLoading(false);
      alert("✅ Successfully connected to ERP Inventory System");
    }, 1500);
  };

  const handleSave = async () => {
    // Save to 'tenants' table -> supplier_config column
    alert("Settings Saved!");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Distributor Configuration</h1>
        <p className="text-gray-500">Manage ERP integrations and retailer terms.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 1. API INTEGRATION */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Server className="text-blue-600" /> ERP Integration
            </h2>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 ${apiStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {apiStatus === 'connected' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
              {apiStatus}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ERP System</label>
              <select
                className="w-full border p-2 rounded-lg bg-gray-50 font-medium"
                value={config.erp_system}
                onChange={e => setConfig({ ...config, erp_system: e.target.value })}
              >
                <option value="sap">SAP S/4HANA</option>
                <option value="oracle">Oracle NetSuite</option>
                <option value="microsoft">Microsoft Dynamics 365</option>
                <option value="custom">Custom REST API</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">API Endpoint URL</label>
              <input
                type="text"
                placeholder="https://api.myserver.com/v1/inventory"
                className="w-full border p-2 rounded-lg font-mono text-sm"
                value={config.api_endpoint}
                onChange={e => setConfig({ ...config, api_endpoint: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">API Secret Key</label>
              <input
                type="password"
                placeholder="sk_live_..."
                className="w-full border p-2 rounded-lg font-mono text-sm"
                value={config.api_key}
                onChange={e => setConfig({ ...config, api_key: e.target.value })}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={testConnection}
                disabled={loading}
                className="flex-1 bg-black text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800"
              >
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                Test Connection
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              We will sync SKU levels every {config.sync_frequency}.
            </p>
          </div>
        </div>

        {/* 2. LOGISTICS & TERMS */}
        <div className="space-y-8">

          {/* Logistics Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Truck className="text-orange-600" /> Logistics Settings
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Base Rate (Pallet)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input type="number" className="w-full border p-2 pl-6 rounded-lg font-bold" value={config.transport_rate_pallet} onChange={e => setConfig({ ...config, transport_rate_pallet: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Per Mile Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input type="number" className="w-full border p-2 pl-6 rounded-lg font-bold" value={config.transport_rate_mile} onChange={e => setConfig({ ...config, transport_rate_mile: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Minimum Order Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">$</span>
                  <input type="number" className="w-full border p-2 pl-6 rounded-lg font-bold" value={config.min_order_value} onChange={e => setConfig({ ...config, min_order_value: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <CreditCard className="text-green-600" /> Payment Terms
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Net 15', 'Net 30', 'Net 60', 'COD', 'Pre-Pay'].map(term => (
                <label key={term} className={`px-4 py-2 rounded-lg border cursor-pointer font-bold text-sm transition ${config.payment_terms.includes(term) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={config.payment_terms.includes(term)}
                    onChange={(e) => {
                      if (e.target.checked) setConfig(p => ({ ...p, payment_terms: [...p.payment_terms, term] }));
                      else setConfig(p => ({ ...p, payment_terms: p.payment_terms.filter(t => t !== term) }));
                    }}
                  />
                  {term}
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            <Save size={20} /> Save Configuration
          </button>

        </div>
      </div>
    </div>
  );
}