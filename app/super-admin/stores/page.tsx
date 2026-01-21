'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Building2, Plus, Edit, MoreHorizontal, Circle } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminStoresPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock fetch function until backend endpoint matches
    useEffect(() => {
        async function fetchStores() {
            try {
                // TODO: Create getTenants endpoint in backend
                setStores([
                    { id: '1', name: 'Westside Branch', status: 'active', tenant_id: 'tenant_1' },
                    { id: '2', name: 'Downtown Store', status: 'active', tenant_id: 'tenant_2' },
                    { id: '3', name: 'North Franchise', status: 'inactive', tenant_id: 'tenant_3' },
                ]);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchStores();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white">Store Management</h1>
                        <p className="text-purple-200 mt-1">Monitor all active tenants and stores</p>
                    </div>
                    <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition flex items-center gap-2">
                        <Plus size={20} />
                        Create Store
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-purple-500 p-3 rounded-lg">
                                    <Building2 className="text-white" size={24} />
                                </div>
                                <button className="text-white/50 hover:text-white transition">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{store.name}</h3>
                            <p className="text-white/50 text-sm mb-4">ID: {store.tenant_id}</p>

                            <div className="flex items-center gap-2 mb-6">
                                <Circle size={10} className={`fill-current ${store.status === 'active' ? 'text-green-400' : 'text-red-400'}`} />
                                <span className="text-sm font-medium text-white/80 capitalize">{store.status}</span>
                            </div>

                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2">
                                <Edit size={16} />
                                Manage Store
                            </button>
                        </div>
                    ))}

                    {/* New Store Placeholder */}
                    <button className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition">
                        <Plus size={48} className="mb-4" />
                        <span className="font-bold">Register New Tenant</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
