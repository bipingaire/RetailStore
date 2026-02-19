'use client';

import { useEffect, useState, useRef } from 'react';

interface Store {
    name: string;
    subdomain: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    hours: string;
    phone: string;
}

const STORES: Store[] = [
    {
        name: 'InduMart Highpoint',
        subdomain: 'highpoint',
        city: 'High Point, NC',
        address: '2500 N Main St, High Point, NC 27262',
        lat: 35.9557,
        lng: -79.9553,
        hours: 'Mon–Sat 8am–9pm · Sun 10am–7pm',
        phone: '(336) 555-0101',
    },
    {
        name: 'InduMart Greensboro',
        subdomain: 'greensboro',
        city: 'Greensboro, NC',
        address: '3200 W Friendly Ave, Greensboro, NC 27410',
        lat: 36.0726,
        lng: -79.792,
        hours: 'Mon–Sat 8am–9pm · Sun 10am–7pm',
        phone: '(336) 555-0202',
    },
];

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getStoreUrl(subdomain: string): string {
    if (typeof window === 'undefined') return '#';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const baseDomain = parts.length >= 2 ? parts.slice(-2).join('.') : 'indumart.us';
    return `${window.location.protocol}//${subdomain}.${baseDomain}`;
}

export default function FindStorePage() {
    const [status, setStatus] = useState<'detecting' | 'picker' | 'redirecting'>('detecting');
    const [nearest, setNearest] = useState<Store | null>(null);
    const [countdown, setCountdown] = useState(3);
    const countRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus('picker');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                let best = STORES[0];
                let bestDist = distanceKm(latitude, longitude, STORES[0].lat, STORES[0].lng);
                for (const store of STORES.slice(1)) {
                    const d = distanceKm(latitude, longitude, store.lat, store.lng);
                    if (d < bestDist) { bestDist = d; best = store; }
                }
                setNearest(best);
                setStatus('redirecting');
                let c = 3;
                countRef.current = setInterval(() => {
                    c--;
                    setCountdown(c);
                    if (c === 0) {
                        clearInterval(countRef.current!);
                        window.location.href = getStoreUrl(best.subdomain);
                    }
                }, 1000);
            },
            () => setStatus('picker'),
            { timeout: 5000 }
        );
        return () => { if (countRef.current) clearInterval(countRef.current); };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-900 flex flex-col items-center justify-center p-6">
            {/* Logo */}
            <div className="mb-10 text-center">
                <div className="text-5xl font-black tracking-tight text-white mb-1">
                    Indu<span className="text-cyan-400">Mart</span>
                </div>
                <p className="text-blue-200 text-sm tracking-widest uppercase">Your neighborhood store</p>
            </div>

            {/* Detecting */}
            {status === 'detecting' && (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">Finding your nearest store…</p>
                    <p className="text-blue-300 text-sm mt-2">Please allow location access</p>
                </div>
            )}

            {/* Redirecting countdown */}
            {status === 'redirecting' && nearest && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-white text-xl font-bold mb-1">Nearest store found!</p>
                    <p className="text-cyan-300 text-2xl font-black mb-1">{nearest.name}</p>
                    <p className="text-blue-200 text-sm mb-6">{nearest.address}</p>
                    <p className="text-white/60 text-sm mb-4">
                        Redirecting in <span className="text-white font-bold text-xl">{countdown}</span>s…
                    </p>
                    <a href={getStoreUrl(nearest.subdomain)}
                        className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-8 py-3 rounded-xl transition-all">
                        Go Now →
                    </a>
                </div>
            )}

            {/* Manual Picker */}
            {status === 'picker' && (
                <div className="w-full max-w-2xl">
                    <p className="text-white text-center text-lg font-semibold mb-6">Choose your InduMart store:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {STORES.map((store) => (
                            <a key={store.subdomain} href={getStoreUrl(store.subdomain)}
                                className="group block bg-white/10 backdrop-blur-md border border-white/20 hover:border-cyan-400/60 hover:bg-white/20 rounded-2xl p-6 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                                        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">{store.name}</h3>
                                        <p className="text-blue-200 text-sm mt-0.5">{store.address}</p>
                                        <p className="text-blue-300/70 text-xs mt-2">{store.hours}</p>
                                        <p className="text-blue-300/70 text-xs">{store.phone}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                                    Shop here
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <p className="mt-12 text-blue-400/50 text-xs">
                Powered by{' '}
                <a href="https://retailos.cloud" className="hover:text-blue-300 transition-colors">RetailOS.cloud</a>
            </p>
        </div>
    );
}
