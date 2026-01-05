'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Building, MapPin, Phone, Save, Users, Truck,
  Plus, Trash2, Globe, CreditCard, Loader2, Mail,
  LayoutTemplate, Link as LinkIcon, Palette, Image as ImageIcon,
  Upload, Search, Check, X, ExternalLink, ShoppingBag, Receipt, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'vendors' | 'website' | 'branding' | 'billing'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = useState<StoreProfile>({
    name: '', address: '', city_state_zip: '', phone: '', email: '', tax_id: '',
    default_safety_stock: 10,
    subdomain: 'demo-store',
    custom_domain: '',
    logo_url: '',
    hero_banner_url: '',
    primary_color: '#2563eb'
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
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);

      // 1. Resolve Tenant (Get first or Create)
      let currentTenantId = null;

      const { data: existingTenants, error: fetchError } = await supabase
        .from('retail-store-tenant')
        .select('*')
        .limit(1);

      if (existingTenants && existingTenants.length > 0) {
        // Use existing
        const t = existingTenants[0];
        currentTenantId = t['tenant-id'];
        setProfile({
          name: t['store-name'],
          address: t['store-address'] || '',
          city_state_zip: `${t['store-city'] || ''}, ${t['store-state'] || ''} ${t['store-zip-code'] || ''}`,
          phone: t['phone-number'] || '',
          email: t['email-address'] || '',
          tax_id: 'US-XX-XXXX', // Field missing in DB, using stub
          default_safety_stock: 10, // Field missing in DB, using stub
          subdomain: 'my-store',
          custom_domain: '',
          logo_url: '',
          hero_banner_url: '',
          primary_color: '#2563eb'
        });
      } else {
        // Create Default Tenant
        const { data: newTenant, error: createError } = await supabase
          .from('retail-store-tenant')
          .insert({
            'store-name': 'New Retail Store',
            'store-address': '123 Market St',
            'store-city': 'Retail City',
            'store-state': 'NY',
            'store-zip-code': '10001',
            'phone-number': '555-0123',
            'email-address': 'admin@retail.com'
          })
          .select()
          .single();

        if (newTenant) {
          currentTenantId = newTenant['tenant-id'];
          setProfile({
            name: newTenant['store-name'],
            address: newTenant['store-address'],
            city_state_zip: `${newTenant['store-city']}, ${newTenant['store-state']} ${newTenant['store-zip-code']}`,
            phone: newTenant['phone-number'],
            email: newTenant['email-address'],
            tax_id: '',
            default_safety_stock: 10,
            subdomain: 'new-store',
            custom_domain: '',
            logo_url: '',
            hero_banner_url: '',
            primary_color: '#2563eb'
          });
        }
      }

      setTenantId(currentTenantId);

      // 2. Load Vendors
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

      if (vendorData) setVendors(vendorData as any);

      // 3. Load Invoices (Mock)
      setInvoices([
        { id: 'INV-2023-003', date: '2023-10-01', amount: 49.00, status: 'paid' },
        { id: 'INV-2023-002', date: '2023-09-01', amount: 49.00, status: 'paid' },
        { id: 'INV-2023-001', date: '2023-08-01', amount: 49.00, status: 'paid' },
      ]);

      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    if (!tenantId) return;
    setLoading(true);

    // Parse City/State/Zip loose logic
    const parts = profile.city_state_zip.split(',');
    const city = parts[0]?.trim() || '';
    const stateZip = parts[1]?.trim() || '';
    const state = stateZip.split(' ')[0] || '';
    const zip = stateZip.split(' ')[1] || '';

    const { error } = await supabase
      .from('retail-store-tenant')
      .update({
        'store-name': profile.name,
        'store-address': profile.address,
        'store-city': city,
        'store-state': state,
        'store-zip-code': zip,
        'phone-number': profile.phone,
        'email-address': profile.email
      })
      .eq('tenant-id', tenantId);

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Store Settings Updated!");
    }

    setLoading(false);
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;
    setSaving(true);

    try {
      const payload = {

        tenant_id: tenantId,
        name: editingVendor.name,
        contact_phone: editingVendor.contact_phone,
        whatsapp_number: editingVendor.whatsapp_number,
        email: editingVendor.email,
        transport_rate_per_pallet: editingVendor.transport_rate_per_pallet
      };

      if (editingVendor.id.startsWith('new-')) {
        const { data, error } = await supabase.from('vendors').insert(payload).select().single();
        if (error) throw error;
        if (data) setVendors(prev => [...prev, data as any]);
      } else {
        const { error } = await supabase.from('vendors').update(payload).eq('id', editingVendor.id);
        if (error) throw error;
        setVendors(prev => prev.map(v => v.id === editingVendor.id ? editingVendor : v));
      }
      setEditingVendor(null);
    } catch (err: any) {
      console.error(err);
      alert("Failed to save vendor: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Are you sure? This vendor will be removed from future PO suggestions.")) return;
    const { error } = await supabase.from('vendors').delete().eq('id', id);
    if (error) {
      alert("Error deleting vendor");
    } else {
      setVendors(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleFileUpload = (field: 'logo_url' | 'hero_banner_url', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, [field]: url });
    }
  };

  // --- REAL API DOMAIN LOGIC ---
  const checkDomainAvailability = async () => {
    if (!domainQuery) return;
    setIsSearchingDomain(true);
    setDomainResult(null);

    try {
      const res = await fetch('/api/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainQuery })
      });

      const data = await res.json();

      if (res.ok) {
        setDomainResult({
          domain: data.domain,
          available: data.available,
          price: data.price
        });
      } else {
        alert("Domain check failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Network Error");
    } finally {
      setIsSearchingDomain(false);
    }
  };

  const buyDomain = async () => {
    if (!domainResult) return;
    const confirmed = confirm(`This will charge $${domainResult.price} to your card on file (Demo Mode). Continue?`);

    if (confirmed) {
      setLoading(true);
      try {
        const res = await fetch('/api/domains/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: domainResult.domain, price: domainResult.price })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setProfile({ ...profile, custom_domain: domainResult.domain });
          setDomainResult(null);
          setDomainQuery('');
          alert(`🎉 Successfully registered ${domainResult.domain}! Order ID: ${data.orderId}`);
        } else {
          alert("Purchase failed: " + data.error);
        }
      } catch (e) {
        alert("Purchase failed due to network error.");
      } finally {
        setLoading(false);
      }
    }
  };

  const PLANS: Plan[] = [
    { id: 'starter', name: 'Starter', price: 0, features: ['100 Products', 'Basic Reports', 'Email Support'] },
    { id: 'growth', name: 'Growth', price: 49, features: ['Unlimited Products', 'AI Restock', 'Priority Support', 'Custom Domain'], recommended: true },
    { id: 'enterprise', name: 'Scale', price: 299, features: ['Multi-Location', 'Dedicated Manager', 'API Access', 'Whitelabel'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-gray-500">Manage your store identity, branding, and supplier relationships.</p>
        </header>

        {/* TABS */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Building size={18} /> Store Profile
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'branding' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Palette size={18} /> Branding & Theme
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'vendors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={18} /> Suppliers
          </button>
          <button
            onClick={() => setActiveTab('website')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'website' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutTemplate size={18} /> Online Store
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'billing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Receipt size={18} /> Billing
          </button>
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe size={20} className="text-blue-500" /> Official Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tax ID / EIN</label>
                    <input type="text" value={profile.tax_id} onChange={(e) => setProfile({ ...profile, tax_id: e.target.value })} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Support Email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Physical Address</label>
                  <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Street Address" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2" />
                  <input type="text" value={profile.city_state_zip} onChange={(e) => setProfile({ ...profile, city_state_zip: e.target.value })} placeholder="City, State, Zip" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="mt-8 border-t pt-6 flex justify-end">
                <button onClick={handleSaveProfile} disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
                  <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-green-500" /> Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Default Safety Stock</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={profile.default_safety_stock} onChange={(e) => setProfile({ ...profile, default_safety_stock: parseInt(e.target.value) })} className="w-20 border p-2 rounded-lg font-mono font-bold text-center" />
                    <span className="text-sm text-gray-400">units</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    System will suggest reordering when inventory drops below this level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRANDING */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-purple-500" /> Store Assets
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Store Logo (Square)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                      {profile.logo_url ? <img src={profile.logo_url} className="w-full h-full object-cover" /> : <Building className="text-gray-300" />}
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs">Change</div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => handleFileUpload('logo_url', e)}
                      />
                      <p className="text-xs text-gray-400 mt-1">Recommended: 512x512 PNG</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Home Hero Banner</label>
                  <div className="w-full h-32 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden relative group mb-2">
                    {profile.hero_banner_url ? <img src={profile.hero_banner_url} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm">No Banner Uploaded</span>}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    onChange={(e) => handleFileUpload('hero_banner_url', e)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended: 1200x400 JPG</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Palette size={20} className="text-pink-500" /> Color Theme
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Primary Brand Color</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={profile.primary_color}
                      onChange={(e) => setProfile({ ...profile, primary_color: e.target.value })}
                      className="w-16 h-16 rounded-xl border-none cursor-pointer"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={profile.primary_color}
                        onChange={(e) => setProfile({ ...profile, primary_color: e.target.value })}
                        className="w-full border p-2 rounded font-mono uppercase"
                      />
                      <p className="text-xs text-gray-400 mt-1">Used for buttons, links, and highlights.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Preview</label>
                  <div className="p-4 rounded-xl border bg-gray-50 flex gap-2">
                    <button className="px-4 py-2 rounded-lg text-white font-bold text-sm shadow-md" style={{ backgroundColor: profile.primary_color }}>
                      Primary Button
                    </button>
                    <button className="px-4 py-2 rounded-lg border bg-white font-bold text-sm" style={{ color: profile.primary_color, borderColor: profile.primary_color }}>
                      Secondary Button
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t pt-6 flex justify-end">
                <button onClick={handleSaveProfile} disabled={loading} className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800">
                  <Save size={18} /> {loading ? 'Saving...' : 'Apply Branding'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VENDORS */}
        {activeTab === 'vendors' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Approved Supplier List</h2>
              <button
                onClick={() => setEditingVendor({ id: `new-${Date.now()}`, name: '', contact_phone: '', whatsapp_number: '', email: '', transport_rate_per_pallet: 150 })}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Vendor
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b">
                  <tr>
                    <th className="p-4 font-medium">Vendor Name</th>
                    <th className="p-4 font-medium">Contacts</th>
                    <th className="p-4 font-medium">Transport Rate</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 group">
                      <td className="p-4 font-bold text-gray-900">{v.name}</td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-2"><Phone size={14} /> {v.contact_phone || '-'}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1"><Mail size={12} /> {v.email || '-'}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono font-bold">
                          ${v.transport_rate_per_pallet || 150} / pallet
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingVendor(v)} className="text-blue-600 font-bold hover:underline">Edit</button>
                          <button onClick={() => handleDeleteVendor(v.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vendors.length === 0 && (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                  <Truck className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="font-medium">No vendors found.</p>
                  <p className="text-xs mt-1">Add one to enable the Restock Dashboard.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: WEBSITE & DOMAIN (NEW) */}
        {activeTab === 'website' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black mb-1">Your Store is Live!</h2>
                  <p className="text-blue-100 opacity-90">Share this link to start selling immediately. No setup required.</p>
                </div>
                <Link
                  href="/shop"
                  target="_blank"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-50 transition"
                >
                  <ShoppingBag size={20} /> Visit Storefront
                </Link>
              </div>
              <div className="p-6 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe size={20} className="text-blue-500" />
                  <span className="font-mono text-lg bg-white px-3 py-1 rounded border border-gray-200">
                    https://{profile.subdomain}.retailos.com
                  </span>
                </div>
                <button className="text-sm text-blue-600 font-bold hover:underline">Copy Link</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg text-green-700">
                    <LayoutTemplate size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Custom Domain Studio</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Want a professional look? Search and register a custom domain (e.g. <b>yourstore.com</b>) in seconds.
                </p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Find your perfect domain..."
                    className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-800"
                    value={domainQuery}
                    onChange={(e) => setDomainQuery(e.target.value)}
                  />
                  <button
                    onClick={checkDomainAvailability}
                    disabled={isSearchingDomain || !domainQuery}
                    className="bg-black text-white px-6 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSearchingDomain ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                    Search
                  </button>
                </div>
                {domainResult && (
                  <div className={`p-4 rounded-xl border-2 flex justify-between items-center animate-in zoom-in-95 ${domainResult.available ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {domainResult.available ? <Check className="text-green-600" size={20} /> : <X className="text-red-600" size={20} />}
                        <span className={`font-bold text-lg ${domainResult.available ? 'text-green-800' : 'text-red-800'}`}>
                          {domainResult.domain}
                        </span>
                      </div>
                      <p className={`text-xs ${domainResult.available ? 'text-green-600' : 'text-red-600'}`}>
                        {domainResult.available ? 'Available for instant setup.' : 'Sorry, this domain is taken.'}
                      </p>
                    </div>
                    {domainResult.available && (
                      <button
                        onClick={buyDomain}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition"
                      >
                        Buy for ${domainResult.price}
                      </button>
                    )}
                  </div>
                )}
                {profile.custom_domain && !domainResult && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-bold">Active Domain</span>
                      <div className="text-lg font-bold text-gray-900">{profile.custom_domain}</div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Check size={12} /> Connected
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                    <ExternalLink size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Connect Existing Domain</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Already own a domain? Add these records to your DNS provider (GoDaddy, Namecheap) to point it here.
                </p>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-6">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr><th className="p-3">Type</th><th className="p-3">Name</th><th className="p-3">Value</th></tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr><td className="p-3 font-mono font-bold">CNAME</td><td className="p-3 font-mono">www</td><td className="p-3 font-mono">cname.retailos.com</td></tr>
                      <tr className="border-t border-gray-200"><td className="p-3 font-mono font-bold">A</td><td className="p-3 font-mono">@</td><td className="p-3 font-mono">76.76.21.21</td></tr>
                    </tbody>
                  </table>
                </div>
                <button className="w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
                  Verify DNS Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BILLING (NEW) */}
        {activeTab === 'billing' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* CURRENT PLAN */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
                      <p className="text-gray-500 text-sm">Your subscription renews on Nov 1, 2023</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-black text-white p-4 rounded-xl">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900">{currentPlan} Plan</div>
                      <div className="text-sm text-gray-500">
                        ${PLANS.find(p => p.name === currentPlan)?.price.toFixed(2) || '0.00'} / month
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {PLANS.find(p => p.name === currentPlan)?.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-green-500" /> {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50">
                      Cancel Subscription
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                {/* INVOICE HISTORY */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Billing History</h2>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono text-gray-600">{inv.id}</td>
                          <td className="p-4 text-gray-900">{inv.date}</td>
                          <td className="p-4 font-bold">${inv.amount.toFixed(2)}</td>
                          <td className="p-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-blue-600 font-bold hover:underline text-xs flex items-center gap-1 justify-end">
                              <DownloadIcon size={12} /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-gray-400" /> Payment Method
                  </h2>
                  <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-xl text-white mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <CreditCard size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-gray-400 uppercase font-bold mb-4">Current Card</div>
                      <div className="text-2xl font-mono tracking-widest mb-4">•••• •••• •••• 4242</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Expires</div>
                          <div className="font-mono">12/25</div>
                        </div>
                        <div className="font-bold">VISA</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full border border-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-50 text-sm">
                    Update Payment Method
                  </button>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">Need Enterprise?</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    For multi-location chains and custom API integrations, contact our sales team.
                  </p>
                  <button className="text-sm font-bold text-blue-600 hover:underline">Contact Sales &rarr;</button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VENDOR MODAL */}
        {editingVendor && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <form onSubmit={handleSaveVendor} className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
              <h3 className="font-bold text-lg mb-4">{editingVendor.id.startsWith('new') ? 'Add Vendor' : 'Edit Vendor'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                  <input required type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingVendor.name} onChange={e => setEditingVendor({ ...editingVendor, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                    <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingVendor.contact_phone} onChange={e => setEditingVendor({ ...editingVendor, contact_phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                    <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingVendor.whatsapp_number} onChange={e => setEditingVendor({ ...editingVendor, whatsapp_number: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input type="email" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editingVendor.email} onChange={e => setEditingVendor({ ...editingVendor, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2">
                    <Truck size={14} /> Est. Transport Cost (per Pallet)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      type="number"
                      className="w-full border p-2 pl-6 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editingVendor.transport_rate_per_pallet || 150}
                      onChange={e => setEditingVendor({ ...editingVendor, transport_rate_per_pallet: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setEditingVendor(null)} className="flex-1 bg-gray-100 font-bold py-3 rounded text-gray-600 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

// Icon helper
function DownloadIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}