'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2, Navigation, Store, AlertCircle, ArrowRight } from 'lucide-react';
import { buildDomainUrl } from '@/lib/domain-utils';
import { requestUserLocation } from '@/lib/geolocation/browser-location';

interface StoreData {
    subdomain: string;
    city: string;
    state: string;
    distance: number;
    distanceMiles: number;
    address: string;
}

export default function FindStorePage() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'requesting' | 'locating' | 'redirecting' | 'error' | 'denied'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [nearestStore, setNearestStore] = useState<StoreData | null>(null);
    const [allStores, setAllStores] = useState<any[]>([]);
    const [showManualSelection, setShowManualSelection] = useState(false);

    useEffect(() => {
        // Auto-start geolocation on page load
        handleFindNearestStore();
    }, []);

    const handleFindNearestStore = async () => {
        setStatus('requesting');
        setErrorMessage('');

        try {
            // Request user's location
            const position = await requestUserLocation();
            setStatus('locating');

            // Call API to find nearest store
            const response = await fetch(
                `/api/stores/nearest?lat=${position.latitude}&lng=${position.longitude}`
            );

            if (!response.ok) {
                throw new Error('Failed to find nearest store');
            }

            const data = await response.json();

            if (!data.success || !data.nearest) {
                throw new Error('No stores found nearby');
            }

            setNearestStore(data.nearest);
            setStatus('redirecting');

            // Redirect to nearest store after 2 seconds
            setTimeout(() => {
                const storeUrl = buildDomainUrl('indumart-tenant', '/shop', data.nearest.subdomain);
                window.location.href = storeUrl;
            }, 2000);
        } catch (error: any) {
            console.error('Geolocation error:', error);

            if (error.code === 1) {
                // Permission denied
                setStatus('denied');
                loadAllStores();
            } else {
                setStatus('error');
                setErrorMessage(error.message || 'Failed to get your location');
                loadAllStores();
            }
        }
    };

    const loadAllStores = async () => {
        try {
            const response = await fetch('/api/stores/list');
            if (response.ok) {
                const data = await response.json();
                setAllStores(data.stores || []);
                setShowManualSelection(true);
            }
        } catch (error) {
            console.error('Failed to load stores:', error);
        }
    };

    const handleManualStoreSelect = (subdomain: string) => {
        const storeUrl = buildDomainUrl('indumart-tenant', '/shop', subdomain);
        window.location.href = storeUrl;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full mb-4">
                        <Store size={20} />
                        <span className="font-bold">InduMart</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        Finding Your Nearest Store
                    </h1>
                    <p className="text-gray-600">
                        We'll connect you to the closest InduMart location
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    {/* Requesting Permission */}
                    {status === 'requesting' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Navigation size={32} className="text-blue-600 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Requesting Your Location
                            </h2>
                            <p className="text-gray-600">
                                Please allow location access in your browser
                            </p>
                        </div>
                    )}

                    {/* Locating */}
                    {status === 'locating' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Loader2 size={32} className="text-green-600 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Finding Nearest Store...
                            </h2>
                            <p className="text-gray-600">
                                Calculating distances to our locations
                            </p>
                        </div>
                    )}

                    {/* Redirecting */}
                    {status === 'redirecting' && nearestStore && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Found Your Store!
                            </h2>
                            <div className="bg-green-50 rounded-xl p-6 mt-4 border border-green-200">
                                <div className="text-lg font-bold text-green-900 mb-1">
                                    {nearestStore.city}, {nearestStore.state}
                                </div>
                                <div className="text-sm text-green-700 mb-3">
                                    {nearestStore.address}
                                </div>
                                <div className="text-2xl font-black text-green-600">
                                    {nearestStore.distanceMiles.toFixed(1)} miles away
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4 flex items-center justify-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                Redirecting you now...
                            </p>
                        </div>
                    )}

                    {/* Error or Denied */}
                    {(status === 'error' || status === 'denied') && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} className="text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {status === 'denied' ? 'Location Access Denied' : 'Unable to Get Location'}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {status === 'denied'
                                    ? "No problem! You can manually select your preferred store below."
                                    : errorMessage || "Please select your preferred store manually."}
                            </p>
                            <button
                                onClick={() => setShowManualSelection(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition inline-flex items-center gap-2"
                            >
                                Choose Store Manually
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Manual Store Selection */}
                    {showManualSelection && allStores.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Select Your Store
                            </h3>
                            <div className="space-y-3">
                                {allStores.map((store) => (
                                    <button
                                        key={store.subdomain}
                                        onClick={() => handleManualStoreSelect(store.subdomain)}
                                        className="w-full bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl p-4 transition text-left group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-green-700">
                                                    {store.displayName}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {store.fullAddress}
                                                </div>
                                            </div>
                                            <ArrowRight
                                                size={20}
                                                className="text-gray-400 group-hover:text-green-600 transition"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>
                        Having trouble?{' '}
                        <button
                            onClick={handleFindNearestStore}
                            className="text-green-600 hover:text-green-700 font-semibold underline"
                        >
                            Try again
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
