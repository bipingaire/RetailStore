'use client';
import { useState, useEffect } from 'react';
import {
  Building, Globe, CreditCard, Share2, Users, Palette,
  Save, Phone, Mail, Plus, Trash2, Check, X, Search,
  Loader2, ExternalLink, ShieldCheck, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';



// Types (Stubbed for this file context)
type StoreProfile = {
  name: string; address: string; city_state_zip: string; phone: string; email: string; tax_id: string;
  default_safety_stock: number; subdomain: string; custom_domain: string; logo_url: string; hero_banner_url: string; primary_color: string;
};
type Vendor = { id: string; name: string; contact_phone: string; whatsapp_number: string; email: string; transport_rate_per_pallet: number; };
type Invoice = { id: string; date: string; amount: number; status: string; };
type Plan = { id: string; name: string; price: number; features: string[]; recommended?: boolean };

export default function SettingsPage() {
  // Supabase removed - refactor needed
  const [activeTab, setActiveTab] = useState<'profile' | 'vendors' | 'website' | 'billing' | 'social'>('profile');
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState<StoreProfile>({
    name: '', address: '', city_state_zip: '', phone: '', email: '', tax_id: '',
    default_safety_stock: 10, subdomain: 'demo-store', custom_domain: '', logo_url: '', hero_banner_url: '', primary_color: '#2563eb'
  });

  // Vendor State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Domain Search State
  const [domainQuery, setDomainQuery] = useState('');
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<{ domain: string, available: boolean, price: number } | null>(null);

  // Billing State
  const [currentPlan, setCurrentPlan] = useState('Growth');
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-2023-003', date: '2023-10-01', amount: 49.00, status: 'paid' },
    { id: 'INV-2023-002', date: '2023-09-01', amount: 49.00, status: 'paid' },
    { id: 'INV-2023-001', date: '2023-08-01', amount: 49.00, status: 'paid' },
  ]);

  // Social Media State
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock tenant data
      const mockTenant = {
        'tenant-id': 'mock-tenant-001',
        'store-name': 'Demo Retail Store',
        'store-address': '123 Main Street',
        'store-city': 'New York',
        'store-state': 'NY',
        'store-zip-code': '10001',
        'phone-number': '555-0123',
        'email-address': 'admin@demostore.com'
      };

      setTenantId(mockTenant['tenant-id']);
      setProfile({
        name: mockTenant['store-name'],
        address: mockTenant['store-address'] || '',
        city_state_zip: `${mockTenant['store-city'] || ''}, ${mockTenant['store-state'] || ''} ${mockTenant['store-zip-code'] || ''}`,
        phone: mockTenant['phone-number'] || '',
        email: mockTenant['email-address'] || '',
        tax_id: 'US-XX-XXXX',
        default_safety_stock: 10,
        subdomain: 'demo-store',
        custom_domain: '',
        logo_url: '',
        hero_banner_url: '',
        primary_color: '#2563eb'
      });

      // Mock vendors
      const mockVendors = [
        {
          id: 'vendor-001',
          name: 'ABC Distributors',
          contact_phone: '555-1001',
          whatsapp_number: '555-1001',
          email: 'sales@abc.com',
          transport_rate_per_pallet: 50
        },
        {
          id: 'vendor-002',
          name: 'XYZ Suppliers',
          contact_phone: '555-2002',
          whatsapp_number: '555-2002',
          email: 'contact@xyz.com',
          transport_rate_per_pallet: 45
        }
      ];
      setVendors(mockVendors);

      // Mock social accounts
      const mockSocial = [
        { id: 'social-001', platform: 'Facebook', account_name: 'Demo Store', connected: true },
        { id: 'social-002', platform: 'Instagram', account_name: '@demostore', connected: false }
      ];
      setSocialAccounts(mockSocial);
      setLoading(false);
    }

    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    if (!tenantId) return;
    setLoading(true);

    // Mock save (just update local state)
    await new Promise(resolve => setTimeout(resolve, 300));

    toast.success("Settings saved.");
    setLoading(false);
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;
    try {
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 300));

      if (editingVendor.id.startsWith('new-')) {
        const newVendor = { ...editingVendor, id: `vendor-${Date.now()}` };
        setVendors(prev => [...prev, newVendor]);
      } else {
        setVendors(prev => prev.map(v => v.id === editingVendor.id ? editingVendor : v));
      }
      setEditingVendor(null);
      toast.success("Vendor saved");
    } catch (err: any) { toast.error(err.message); }
  };

  const checkDomainAvailability = async () => {
    if (!domainQuery) return;
    setIsSearchingDomain(true);
    // Mock check
    setTimeout(() => {
      setDomainResult({ domain: domainQuery, available: true, price: 12.99 });
      setIsSearchingDomain(false);
    }, 1000);
  };

  const connectSocialMedia = async (platform: string) => {
    toast.info(`Redirecting to ${platform} OAuth...`);
    // Simulating OAuth redirect
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500">Manage your organization preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Sidebar Navigation */}
          <div className="space-y-1">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Building size={16} /> General
            </button>
            <button onClick={() => setActiveTab('website')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'website' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Globe size={16} /> Website & Domain
            </button>
            <button onClick={() => setActiveTab('vendors')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'vendors' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Users size={16} /> Vendors
            </button>
            <button onClick={() => setActiveTab('social')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'social' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Share2 size={16} /> Social Media
            </button>
            <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              <CreditCard size={16} /> Billing
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 space-y-6">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Profile</h3>
                  <div className="grid grid-cols-1 gap-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Store Name</label>
                      <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Support Email</label>
                      <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button onClick={handleSaveProfile} disabled={loading} className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* VENDORS TAB */}
            {activeTab === 'vendors' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 text-sm">Suppliers</h3>
                  <button
                    onClick={() => setEditingVendor({ id: `new-${Date.now()}`, name: '', contact_phone: '', whatsapp_number: '', email: '', transport_rate_per_pallet: 150 })}
                    className="text-xs bg-white border border-gray-200 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Vendor
                  </button>
                </div>
                {editingVendor && (
                  <div className="p-4 border-b border-gray-200 bg-blue-50/30">
                    <form onSubmit={handleSaveVendor} className="grid grid-cols-2 gap-3 max-w-2xl">
                      <input placeholder="Vendor Name" className="border rounded px-3 py-2 text-sm" value={editingVendor.name} onChange={e => setEditingVendor({ ...editingVendor, name: e.target.value })} required />
                      <input placeholder="Email" className="border rounded px-3 py-2 text-sm" value={editingVendor.email} onChange={e => setEditingVendor({ ...editingVendor, email: e.target.value })} />
                      <input placeholder="Phone" className="border rounded px-3 py-2 text-sm" value={editingVendor.contact_phone} onChange={e => setEditingVendor({ ...editingVendor, contact_phone: e.target.value })} />
                      <input type="number" placeholder="Rate ($/pallet)" className="border rounded px-3 py-2 text-sm" value={editingVendor.transport_rate_per_pallet} onChange={e => setEditingVendor({ ...editingVendor, transport_rate_per_pallet: Number(e.target.value) })} />
                      <div className="col-span-2 flex gap-2 pt-2">
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold">Save</button>
                        <button type="button" onClick={() => setEditingVendor(null)} className="text-gray-500 text-xs hover:underline">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                <div className="divide-y divide-gray-100">
                  {vendors.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No vendors configured.</div>
                  ) : vendors.map(v => (
                    <div key={v.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{v.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <Mail size={10} /> {v.email || 'N/A'}
                          <span className="text-gray-300">|</span>
                          <Phone size={10} /> {v.contact_phone || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">${v.transport_rate_per_pallet}/pallet</span>
                        <button onClick={() => setEditingVendor(v)} className="text-gray-400 hover:text-blue-600"><Palette size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WEBSITE TAB */}
            {activeTab === 'website' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Domain</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Find your perfect domain..."
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                      value={domainQuery}
                      onChange={(e) => setDomainQuery(e.target.value)}
                    />
                    <button
                      onClick={checkDomainAvailability}
                      disabled={isSearchingDomain || !domainQuery}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isSearchingDomain ? 'Checking...' : 'Search'}
                    </button>
                  </div>
                  {domainResult && (
                    <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        <span className="text-sm font-bold text-green-900">{domainResult.domain} is available!</span>
                      </div>
                      <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-green-700">
                        Buy for ${domainResult.price}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Subscription & Invoices</h3>
                </div>
                <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{currentPlan} Plan</div>
                      <div className="text-xs text-gray-500">$49.00 / month • Renews in 12 days</div>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold uppercase">Active</span>
                  </div>
                </div>
                <div>
                  {invoices.map(inv => (
                    <div key={inv.id} className="px-6 py-4 flex justify-between items-center border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded text-gray-500"><CreditCard size={16} /></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inv.id}</div>
                          <div className="text-xs text-gray-500">{inv.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">${inv.amount.toFixed(2)}</div>
                        <div className="text-xs text-green-600 font-medium uppercase">Paid</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === 'social' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">f</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Facebook Page</div>
                        <div className="text-xs text-gray-500">Not connected</div>
                      </div>
                    </div>
                    <button onClick={() => connectSocialMedia('facebook')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                      Connect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">In</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Instagram Business</div>
                        <div className="text-xs text-gray-500">Not connected</div>
                      </div>
                    </div>
                    <button onClick={() => connectSocialMedia('instagram')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
