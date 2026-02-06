'use client';

import { useEffect, useState } from 'react';
import { MapPin, Store, ArrowRight, Loader2 } from 'lucide-react';

export default function LocatorPage() {
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState<string | null>(null);

    useEffect(() => {
        async function locateUser() {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                setCity(data.city);

                if (data.city === 'Greensboro') {
                    window.location.href = '//greensboro.indumart.us';
                } else if (data.city === 'High Point') {
                    window.location.href = '//highpoint.indumart.us';
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Geolocation failed', error);
                setLoading(false);
            }
        }

        locateUser();
    }, []);

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
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-4">Welcome to InduMart</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    {city ? `It looks like you are in ${city}.` : "We couldn't detect your location."} <br />
                    Please select your nearest store to continue shopping.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <a href="//greensboro.indumart.us" className="group block bg-gray-50 hover:bg-green-50 border-2 border-transparent hover:border-green-500 rounded-xl p-6 transition-all text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <Store className="w-6 h-6 text-green-600" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Greensboro</h3>
                        <p className="text-sm text-gray-500">Serving the greater Greensboro area with fresh produce daily.</p>
                    </a>

                    <a href="//highpoint.indumart.us" className="group block bg-gray-50 hover:bg-green-50 border-2 border-transparent hover:border-green-500 rounded-xl p-6 transition-all text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <Store className="w-6 h-6 text-blue-600" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">High Point</h3>
                        <p className="text-sm text-gray-500">Your local hub for international groceries and essentials.</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
