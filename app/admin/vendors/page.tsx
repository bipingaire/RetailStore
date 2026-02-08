'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Users, Search, Phone, Mail, Globe, MapPin, Building, ArrowRight } from 'lucide-react';

type VendorProfile = {
  id?: string;
  name: string;
  ein?: string;
  shipping_address?: string;
  website?: string;
  fax?: string;
  poc_name?: string;
  poc_phone?: string;
  contact_phone?: string;
  email?: string;
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
      try {
        // Fetch from Backend via apiClient
        // Promise.all for parallel fetching
        const [invoiceData, contactData] = await Promise.all([
          apiClient.get('/vendors/invoices'),
          apiClient.get('/vendors')
        ]);

        const rawInvoices = invoiceData || [];
        // Backend returns mapped keys: 'invoice-id', 'invoice-number', etc.
        const mappedInvoices = rawInvoices.map((inv: any) => ({
          id: inv['invoice-id'],
          invoice_number: inv['invoice-number'],
          invoice_date: inv['invoice-date'],
          total_amount: inv['total-amount-value'],
          status: inv['processing-status'],
          vendor_name: inv['supplier-name']
        }));
        setInvoices(mappedInvoices);

        const vendorMap: Record<string, VendorProfile> = {};
        contactData?.forEach((c: any) => {
          vendorMap[c.name] = {
            id: c.id,
            name: c.name,
            contact_phone: c['contact-phone'],
            email: c.email,
            ein: c.ein,
            shipping_address: c.address,
            website: c.website,
            fax: c.fax,
            poc_name: c['poc-name'],
            total_spend: 0,
            invoice_count: 0,
            last_order_date: 'N/A',
            outstanding_balance: 0,
            reliability_score: c['reliability-score'] || 95
          };
        });

        rawInvoices.forEach((inv: any) => {
          const name = inv['supplier-name'] || 'Unknown';
          if (!vendorMap[name]) {
            vendorMap[name] = { name, total_spend: 0, invoice_count: 0, last_order_date: 'N/A', outstanding_balance: 0, reliability_score: 80 };
          }
          const v = vendorMap[name];
          v.total_spend += Number(inv['total-amount-value']) || 0;
          v.invoice_count += 1;
          if (v.last_order_date === 'N/A' || new Date(inv['invoice-date']) > new Date(v.last_order_date)) v.last_order_date = inv['invoice-date'];
        });

        setVendors(Object.values(vendorMap).sort((a, b) => b.total_spend - a.total_spend));
      } catch (err) {
        console.error("Failed to load vendor data", err);
      } finally {
        setLoading(false);
      }
    }
    loadVendorData();
  }, []);

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeVendorProfile = vendors.find(v => v.name === selectedVendor);

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Vendors...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-purple-600" /> Vendor Relations
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage suppliers, contacts, and order history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LIST CARD */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredVendors.map(vendor => (
                <div
                  key={vendor.name}
                  onClick={() => setSelectedVendor(vendor.name)}
                  className={`p-4 cursor-pointer transition-colors ${selectedVendor === vendor.name ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-gray-900 text-sm">{vendor.name}</div>
                    {selectedVendor === vendor.name && <ArrowRight size={14} className="text-purple-500" />}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{vendor.invoice_count} Orders</span>
                    <span className="font-bold text-gray-900">${vendor.total_spend.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILS CARD */}
          <div className="lg:col-span-2 space-y-6">
            {activeVendorProfile ? (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{activeVendorProfile.name}</h2>
                      {activeVendorProfile.website && (
                        <a href={activeVendorProfile.website} target="_blank" className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                          <Globe size={12} /> {activeVendorProfile.website}
                        </a>
                      )}
                    </div>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">Active Supplier</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Phone size={14} /></div>
                        <span className="font-medium">{activeVendorProfile.contact_phone || 'No Phone'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Mail size={14} /></div>
                        <span className="font-medium">{activeVendorProfile.email || 'No Email'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><MapPin size={14} /></div>
                        <span className="font-medium max-w-[200px] leading-tight">{activeVendorProfile.shipping_address || 'No Address'}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <Building size={12} /> Commercial Details
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500">Point of Contact</div>
                          <div className="font-bold text-gray-900">{activeVendorProfile.poc_name || 'General Sales'}</div>
                        </div>
                        {activeVendorProfile.ein && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="text-xs text-gray-500">Tax ID / EIN</div>
                            <div className="font-mono text-xs text-gray-700">{activeVendorProfile.ein}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPI STATS */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Orders</div>
                    <div className="text-2xl font-black text-gray-900 mt-1">{activeVendorProfile.invoice_count}</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Lifetime Spend</div>
                    <div className="text-2xl font-black text-green-600 mt-1">${activeVendorProfile.total_spend.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Last Activity</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{activeVendorProfile.last_order_date !== 'N/A' ? new Date(activeVendorProfile.last_order_date).toLocaleDateString() : 'Never'}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Users size={24} className="opacity-50" /></div>
                <p className="font-medium">Select a vendor to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}