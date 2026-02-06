'use client';

import { useEffect, useState } from 'react';
import { MapPin, Store, ArrowRight, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Tenant = {
    'tenant-id': string;
    'store-name': string;
    'store-city': string;
    'subdomain': string;
    'description'?: string; // Optional, might not exist in schema yet so handle gracefully
};

export default function LocatorPage() {
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState<string | null>(null);
    const [stores, setStores] = useState<Tenant[]>([]);
    const supabase = createClientComponentClient();

    useEffect(() => {
        async function initLocator() {
            try {
                // 1. Fetch Stores from DB
                const { data: tenants, error } = await supabase
                    .from('retail-store-tenant')
                    .select('*')
                    .eq('is-active', true);

                if (error) {
                    console.error('Failed to fetch stores:', error);
                } else {
                    setStores(tenants || []);
                }

                // 2. Detect User Location
                const res = await fetch('https://ipapi.co/json/');
                const userData = await res.json();
                setCity(userData.city);

                // 3. Auto-Redirect Logic
                if (tenants) {
                    const matchedStore = tenants.find(
                        (t: Tenant) => t['store-city'].toLowerCase() === userData.city.toLowerCase()
                    );

                    if (matchedStore) {
                        // Construct URL: //subdomain.indumart.us (or current host)
                        // Assuming logic is strictly subdomain.indumart.us for production
                        const protocol = window.location.protocol;
                        const rootDomain = window.location.host.includes('localhost')
                            ? 'localhost:3000' // Dev fallback
                            : 'indumart.us';

                        // In dev, we might not want to actually redirect to a subdomain that doesn't resolve to localhost
                        // For now, simpler production-ready redirect:
                        if (!window.location.host.includes('localhost')) {
                            window.location.href = `//${matchedStore.subdomain}.indumart.us`;
                        }
                    }
                }

            } catch (error) {
                console.error('Locator initialization failed', error);
            } finally {
                setLoading(false);
            }
        }

        initLocator();
    }, [supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">Locating nearest store...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-4">Welcome to InduMart</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    {city ? `It looks like you are in ${city}.` : "We couldn't detect your exact location."} <br />
                    Please select your nearest store to continue shopping.
                </p>

                {stores.length === 0 ? (
                    <div className="text-gray-500 py-10">
                        No stores found active at the moment.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {stores.map((store) => (
                            <a
                                key={store['tenant-id']}
                                href={`//${store.subdomain}.indumart.us`}
                                className="group block bg-gray-50 hover:bg-green-50 border-2 border-transparent hover:border-green-500 rounded-xl p-6 transition-all text-left"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <Store className="w-6 h-6 text-green-600" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{store['store-name']}</h3>
                                <p className="text-sm text-gray-500">
                                    {store['store-city']} • {store.subdomain}
                                </p>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
