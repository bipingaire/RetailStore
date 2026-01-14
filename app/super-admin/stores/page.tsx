'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Store, Plus, Edit, Trash2, Check, X, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { isSubdomainAvailable } from '@/lib/subdomain';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface StoreData {
    'tenant-id': string;
    'store-name': string;
    'store-address'?: string;
    'store-city'?: string;
    'store-state'?: string;
    'store-zip-code'?: string;
    'phone-number'?: string;
    'email-address'?: string;
    'subdomain'?: string;
    'is-active': boolean;
    'subscription-tier': string;
    'created-at': string;
}

export default function StoresManagement() {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStore, setEditingStore] = useState<Partial<StoreData> | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadStores();
    }, []);

    async function loadStores() {
        const { data, error } = await supabase
            .from('retail-store-tenant')
            .select('*')
            .order('created-at', { ascending: false });

        if (error) {
            toast.error('Failed to load stores');
            console.error(error);
        } else {
            setStores(data || []);
        }
        setLoading(false);
    }

    async function handleSaveStore() {
        if (!editingStore) return;

        // Validate subdomain
        if (editingStore.subdomain) {
            const available = await isSubdomainAvailable(editingStore.subdomain);
            if (!available && !editingStore['tenant-id']) {
                toast.error('Subdomain is already taken');
                return;
            }
        }

        setLoading(true);

        try {
            let tenantId = editingStore['tenant-id'];

            if (tenantId) {
                // Update existing store
                const { error } = await supabase
                    .from('retail-store-tenant')
                    .update(editingStore)
                    .eq('tenant-id', tenantId);

                if (error) throw error;
                toast.success('Store updated successfully');
            } else {
                // Create new store
                const { data, error } = await supabase
                    .from('retail-store-tenant')
                    .insert(editingStore)
                    .select()
                    .single();

                if (error) throw error;
                tenantId = data['tenant-id'];

                // Create subdomain mapping
                if (editingStore.subdomain) {
                    const { error: subError } = await supabase
                        .from('subdomain-tenant-mapping')
                        .insert({
                            'subdomain': editingStore.subdomain,
                            'tenant-id': tenantId,
                            'is-active': true
                        });

                    if (subError) console.error('Subdomain mapping error:', subError);
                }

                toast.success('Store created successfully');
            }

            setEditingStore(null);
            setIsCreating(false);
            await loadStores();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save store');
        }

        setLoading(false);
    }

    async function handleGeocodeStore(store: StoreData) {
        if (!store['store-address'] || !store['store-city'] || !store['store-state']) {
            toast.error('Store must have address, city, and state to geocode');
            return;
        }

        if (!store.subdomain) {
            toast.error('Store must have a subdomain to create location mapping');
            return;
        }

        toast.info('Geocoding address...');

        try {
            // Call geocoding API
            const response = await fetch('/api/geocode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    street: store['store-address'],
                    city: store['store-city'],
                    state: store['store-state'],
                    postalCode: store['store-zip-code'],
                    country: 'USA'
                })
            });

            if (!response.ok) {
                throw new Error('Geocoding failed');
            }

            const { result } = await response.json();

            // Save to store-location-mapping
            const { error } = await supabase
                .from('store-location-mapping')
                .upsert({
                    'tenant-id': store['tenant-id'],
                    'subdomain': store.subdomain,
                    'latitude': result.latitude,
                    'longitude': result.longitude,
                    'address-text': store['store-address'],
                    'city': store['store-city'],
                    'state-province': store['store-state'],
                    'postal-code': store['store-zip-code'],
                    'country': 'USA',
                    'is-active': true
                }, {
                    onConflict: 'subdomain'
                });

            if (error) throw error;

            toast.success(`Location saved! (${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)})`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to geocode address');
        }
    }

    async function handleToggleActive(storeId: string, isActive: boolean) {
        const { error } = await supabase
            .from('retail-store-tenant')
            .update({ 'is-active': !isActive })
            .eq('tenant-id', storeId);

        if (error) {
            toast.error('Failed to update store status');
        } else {
            toast.success(`Store ${!isActive ? 'activated' : 'deactivated'}`);
            await loadStores();
        }
    }

    if (loading && stores.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">Loading stores...</div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Retail Stores</h1>
                    <p className="text-gray-600 mt-1">Manage all retail store locations and settings</p>
                </div>
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setEditingStore({
                            'store-name': '',
                            'subdomain': '',
                            'is-active': true,
                            'subscription-tier': 'beta'
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Store
                </button>
            </div>

            {/* Create/Edit Form */}
            {editingStore && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {isCreating ? 'Create New Store' : 'Edit Store'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                            <input
                                type="text"
                                value={editingStore['store-name'] || ''}
                                onChange={e => setEditingStore({ ...editingStore, 'store-name': e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="My Retail Store"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain *</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editingStore.subdomain || ''}
                                    onChange={e => setEditingStore({ ...editingStore, subdomain: e.target.value.toLowerCase() })}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="store1"
                                    required
                                />
                                <span className="text-sm text-gray-500">.yourdomain.com</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={editingStore['email-address'] || ''}
                                onChange={e => setEditingStore({ ...editingStore, 'email-address': e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="store@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={editingStore['phone-number'] || ''}
                                onChange={e => setEditingStore({ ...editingStore, 'phone-number': e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={editingStore['store-address'] || ''}
                                onChange={e => setEditingStore({ ...editingStore, 'store-address': e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                value={editingStore['store-city'] || ''}
                                onChange={e => setEditingStore({ ...editingStore, 'store-city': e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="New York"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    value={editingStore['store-state'] || ''}
                                    onChange={e => setEditingStore({ ...editingStore, 'store-state': e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="NY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                                <input
                                    type="text"
                                    value={editingStore['store-zip-code'] || ''}
                                    onChange={e => setEditingStore({ ...editingStore, 'store-zip-code': e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="10001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier</label>
                            <select
                                value={editingStore['subscription-tier'] || 'beta'}
                                onChange={e => setEditingStore({ ...editingStore, 'subscription-tier': e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="free">Free</option>
                                <option value="beta">Beta</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={handleSaveStore}
                            disabled={!editingStore['store-name'] || !editingStore.subdomain}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Create Store' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => {
                                setEditingStore(null);
                                setIsCreating(false);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Stores List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {stores.length === 0 ? (
                        <div className="p-12 text-center">
                            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No stores yet. Create your first store!</p>
                        </div>
                    ) : (
                        stores.map(store => (
                            <div key={store['tenant-id']} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{store['store-name']}</h3>
                                            {store.subdomain && (
                                                <a
                                                    href={`https://${store.subdomain}.yourdomain.com`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200"
                                                >
                                                    <Globe className="w-3 h-3" />
                                                    {store.subdomain}
                                                </a>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded-full ${store['is-active']
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {store['is-active'] ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                {store['subscription-tier']}
                                            </span>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            {store['store-address'] && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {store['store-address']}, {store['store-city']}, {store['store-state']} {store['store-zip-code']}
                                                </div>
                                            )}
                                            {store['email-address'] && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {store['email-address']}
                                                </div>
                                            )}
                                            {store['phone-number'] && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {store['phone-number']}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-400 mt-2">
                                            Created {new Date(store['created-at']).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleGeocodeStore(store)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="Geocode store location"
                                        >
                                            <MapPin className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingStore(store)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            title="Edit store"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(store['tenant-id'], store['is-active'])}
                                            className={`p-2 rounded-lg ${store['is-active']
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={store['is-active'] ? 'Deactivate' : 'Activate'}
                                        >
                                            {store['is-active'] ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
