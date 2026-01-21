'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Building2, Plus, Edit, Trash2, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      const data = await apiClient.getVendors();
      setVendors(data);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Vendors</h1>
            <p className="text-gray-500 mt-1">Manage your suppliers and vendors</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={20} />
            Add Vendor
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                    {vendor.ein && <p className="text-xs text-gray-500">EIN: {vendor.ein}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {vendor.contact_phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} />
                    <span>{vendor.contact_phone}</span>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} />
                    <span>{vendor.email}</span>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={14} />
                    <a href={vendor.website} target="_blank" className="text-blue-600 hover:underline">
                      {vendor.website}
                    </a>
                  </div>
                )}
              </div>

              {vendor.address && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{vendor.address}</p>
                </div>
              )}
            </div>
          ))}

          {vendors.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No vendors found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}