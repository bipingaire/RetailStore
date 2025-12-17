'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, Search, DollarSign, TrendingUp, FileText, 
  Calendar, ArrowRight, AlertCircle, CheckCircle, Truck, 
  Phone, Mail, Globe, MapPin, Building
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type VendorProfile = {
  id?: string;
  name: string;
  // New Fields
  ein?: string;
  shipping_address?: string;
  website?: string;
  fax?: string;
  poc_name?: string;
  poc_phone?: string;
  
  contact_phone?: string;
  email?: string;
  
  // Analytics
  total_spend: number;
  invoice_count: number;
  last_order_date: string;
  outstanding_balance: number; 
  reliability_score: number;   
};

type VendorInvoice = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number;
  status: string;
  vendor_name: string;
};

export default function VendorDashboard() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [invoices, setInvoices] = useState<VendorInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadVendorData() {
      setLoading(true);

      // 1. Fetch Invoices
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('*')
        .order('invoice_date', { ascending: false });

      const rawInvoices = invoiceData || [];
      setInvoices(rawInvoices as any);

      // 2. Fetch Rich Vendor Data (Includes new fields)
      const { data: contactData } = await supabase
        .from('vendors')
        .select('*');

      // 3. Aggregate
      const vendorMap: Record<string, VendorProfile> = {};

      contactData?.forEach((c: any) => {
        vendorMap[c.name] = {
          id: c.id,
          name: c.name,
          contact_phone: c.contact_phone,
          email: c.email,
          // Map new fields
          ein: c.ein,
          shipping_address: c.shipping_address,
          website: c.website,
          fax: c.fax,
          poc_name: c.poc_name,
          
          total_spend: 0,
          invoice_count: 0,
          last_order_date: 'N/A',
          outstanding_balance: 0,
          reliability_score: 95
        };
      });

      // Merge Invoice Stats
      rawInvoices.forEach((inv: any) => {
        const name = inv.vendor_name || 'Unknown';
        if (!vendorMap[name]) {
            // Fallback for unconnected invoices
            vendorMap[name] = {
                name,
                total_spend: 0,
                invoice_count: 0,
                last_order_date: 'N/A',
                outstanding_balance: 0,
                reliability_score: 80
            };
        }
        const v = vendorMap[name];
        v.total_spend += inv.total_amount || 0;
        v.invoice_count += 1;
        if (v.last_order_date === 'N/A' || new Date(inv.invoice_date) > new Date(v.last_order_date)) {
          v.last_order_date = inv.invoice_date;
        }
      });

      setVendors(Object.values(vendorMap).sort((a, b) => b.total_spend - a.total_spend));
      setLoading(false);
    }
    loadVendorData();
  }, []);

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeVendorProfile = vendors.find(v => v.name === selectedVendor);
  const activeVendorInvoices = invoices.filter(i => i.vendor_name === selectedVendor);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Vendor Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-purple-600" /> Vendor Relations
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LIST */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
             <div className="p-4 border-b bg-gray-50">
                <input 
                    type="text" 
                    placeholder="Search vendors..." 
                    className="w-full pl-4 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex-1 overflow-y-auto">
                {filteredVendors.map(vendor => (
                    <div 
                        key={vendor.name} 
                        onClick={() => setSelectedVendor(vendor.name)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedVendor === vendor.name ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="font-bold text-gray-900">{vendor.name}</div>
                        <div className="text-xs text-gray-500 flex justify-between mt-1">
                            <span>{vendor.contact_phone || 'No Phone'}</span>
                            <span className="font-mono text-gray-700">${vendor.total_spend.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            {activeVendorProfile ? (
                <>
                    {/* RICH CONTACT CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{activeVendorProfile.name}</h2>
                                {activeVendorProfile.website && (
                                    <a href={activeVendorProfile.website} target="_blank" className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                                        <Globe size={12}/> {activeVendorProfile.website}
                                    </a>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active Vendor</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={16}/> <span>{activeVendorProfile.contact_phone || '--'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail size={16}/> <span>{activeVendorProfile.email || '--'}</span>
                                </div>
                                <div className="flex items-start gap-2 text-gray-600">
                                    <MapPin size={16} className="mt-1"/> 
                                    <span>{activeVendorProfile.shipping_address || 'No Address'}</span>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Key Contacts</h4>
                                <div className="space-y-2">
                                    <div>
                                        <div className="font-bold text-gray-800">{activeVendorProfile.poc_name || 'General Sales'}</div>
                                        <div className="text-xs text-gray-500">Point of Contact</div>
                                    </div>
                                    {activeVendorProfile.ein && (
                                        <div className="pt-2 border-t border-gray-200 mt-2">
                                            <div className="text-xs text-gray-400">EIN / Tax ID</div>
                                            <div className="font-mono text-xs">{activeVendorProfile.ein}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border text-center">
                            <div className="text-xs text-gray-400 uppercase">Total Orders</div>
                            <div className="text-xl font-black">{activeVendorProfile.invoice_count}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border text-center">
                            <div className="text-xs text-gray-400 uppercase">Total Spend</div>
                            <div className="text-xl font-black text-green-600">${activeVendorProfile.total_spend.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border text-center">
                            <div className="text-xs text-gray-400 uppercase">Last Order</div>
                            <div className="text-lg font-bold">{new Date(activeVendorProfile.last_order_date).toLocaleDateString()}</div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-full bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                    <Users size={48} className="mb-4 opacity-20"/>
                    <p>Select a vendor to view details.</p>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}