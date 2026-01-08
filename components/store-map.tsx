'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface Store {
    storeName: string;
    latitude: number;
    longitude: number;
    stockQuantity: number;
    distance: number;
}

interface StoreMapProps {
    stores: Store[];
    userLocation: {
        latitude: number;
        longitude: number;
    };
}

declare global {
    interface Window {
        google: any;
    }
}

export default function StoreMap({ stores, userLocation }: StoreMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        // Check if Google Maps script is loaded
        if (!window.google?.maps) {
            console.error('Google Maps script not loaded');
            return;
        }

        if (!mapRef.current) return;

        // Initialize map if not exists
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: userLocation.latitude, lng: userLocation.longitude },
                zoom: 11,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                    },
                ],
            });
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add user location marker
        new window.google.maps.Marker({
            position: { lat: userLocation.latitude, lng: userLocation.longitude },
            map: mapInstanceRef.current,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
            },
            title: 'Your Location',
        });

        // Add store markers
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });

        stores.forEach(store => {
            const position = { lat: store.latitude, lng: store.longitude };

            const marker = new window.google.maps.Marker({
                position,
                map: mapInstanceRef.current,
                title: store.storeName,
                label: {
                    text: store.stockQuantity.toString(),
                    color: 'white',
                    fontWeight: 'bold',
                },
            });

            // Info window
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
          <div class="p-2">
            <h3 class="font-bold">${store.storeName}</h3>
            <p class="text-sm">${store.distance.toFixed(1)} miles away</p>
            <p class="text-sm font-semibold text-green-600">${store.stockQuantity} in stock</p>
          </div>
        `,
            });

            marker.addListener('click', () => {
                infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
            bounds.extend(position);
        });

        // Fit bounds to show all markers
        mapInstanceRef.current.fitBounds(bounds);

    }, [stores, userLocation]);

    return (
        <div ref={mapRef} className="w-full h-full rounded-xl bg-gray-100 min-h-[300px]" />
    );
}
