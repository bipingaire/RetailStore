'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Building2, Plus, Globe, CheckCircle, MoreVertical, Disc } from 'lucide-react';
import { toast } from 'sonner';
import { CreateTenantModal } from './create-tenant-modal';

interface Store {
    tenant_id: string; // Updated to match likely API response
    store_name: string;
    subdomain: string;
    is_active: boolean;
}

export default function SuperAdminStoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const data: any = await apiClient.getStores();
            // Ensure data is array
            setStores(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load stores');
            // Mock fallback if API fails completely so UI is visible
            setStores([
                { tenant_id: '1', store_name: 'InduMart Demo', subdomain: 'indumart', is_active: true },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    if (loading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Store Directory</h1>
                    <p className="text-slate-500 mt-1">Manage all registered tenants and store instances.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-900/20"
                >
                    <Plus size={20} />
                    Provision Store
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stores.map((store) => (
                    <div key={store.tenant_id} className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition relative overflow-hidden">

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                                <Building2 size={24} />
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${store.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {store.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1">{store.store_name}</h3>

                        <a
                            href={`https://${store.subdomain}.indumart.us`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline mb-6"
                        >
                            <Globe size={14} />
                            {store.subdomain}.indumart.us
                        </a>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                            <div>Plan: <span className="text-slate-900">Pro</span></div>
                            <button className="text-slate-400 hover:text-slate-900">Manage</button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition min-h-[240px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold">Add New Tenant</span>
                </button>
            </div>

            <CreateTenantModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={fetchStores}
            />
        </div>
    );
}
