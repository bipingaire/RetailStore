'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Phone, Clock, AlertCircle } from 'lucide-react';
import { requestUserLocation, checkLocationPermission } from '@/lib/geolocation/browser-location';
import { formatDistance } from '@/lib/geolocation/distance';

interface NearbyStoresModalProps {
    productId: string;
    productName: string;
    onClose: () => void;
}

interface Store {
    tenantId: string;
    storeName: string;
    distance: number;
    stockQuantity: number;
    address: string;
    phone: string;
    storeHours: any;
    latitude: number;
    longitude: number;
}

export default function NearbyStoresModal({ productId, productName, onClose }: NearbyStoresModalProps) {
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [radius, setRadius] = useState(25);
    const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

    useEffect(() => {
        checkPermission();
        findNearbyStores();
    }, []);

    async function checkPermission() {
        const status = await checkLocationPermission();
        setPermissionState(status);
    }

    async function findNearbyStores() {
        setLoading(true);
        setLocationError(null);

        try {
            // Get user location
            const position = await requestUserLocation();

            // Call API
            const response = await fetch('/api/customer/nearby-stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    userLatitude: position.latitude,
                    userLongitude: position.longitude,
                    radiusMiles: radius
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            setStores(data.stores);
        } catch (error: any) {
            console.error(error);
            if (error.code === 1) { // PERMISSION_DENIED
                setLocationError('Please enable location access to find nearby stores.');
            } else {
                setLocationError(error.message || 'Failed to find nearby stores');
            }
        }

        setLoading(false);
    }

    function getGoogleMapsUrl(store: Store) {
        return `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Find in Nearby Stores</h2>
                        <p className="text-sm text-gray-500">Checking availability for {productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-100 rounded-xl">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : locationError ? (
                        <div className="text-center py-12 px-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Access Required</h3>
                            <p className="text-gray-600 mb-6">{locationError}</p>
                            <button
                                onClick={findNearbyStores}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : stores.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stores Found</h3>
                            <p className="text-gray-600 mb-6">
                                None of our locations within {radius} miles have this item in stock.
                            </p>
                            <div className="flex justify-center gap-2">
                                {[25, 50, 100].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => { setRadius(r); findNearbyStores(); }}
                                        className={`px-3 py-1 rounded-full text-sm border ${radius === r
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {r} mi
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-900">
                                    {stores.length} store{stores.length !== 1 ? 's' : ''} found nearby
                                </span>
                                <select
                                    value={radius}
                                    onChange={(e) => {
                                        setRadius(Number(e.target.value));
                                        findNearbyStores();
                                    }}
                                    className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="10">Within 10 miles</option>
                                    <option value="25">Within 25 miles</option>
                                    <option value="50">Within 50 miles</option>
                                </select>
                            </div>

                            {stores.map(store => (
                                <div
                                    key={store.tenantId}
                                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{store.storeName}</h3>
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                    {formatDistance(store.distance)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{store.address}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                                {store.stockQuantity} in stock
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4">
                                        <a
                                            href={getGoogleMapsUrl(store)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Get Directions
                                        </a>
                                        {store.phone && (
                                            <a
                                                href={`tel:${store.phone}`}
                                                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Call
                                            </a>
                                        )}
                                    </div>

                                    {store.storeHours && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Open until {store.storeHours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.close || 'Close'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
