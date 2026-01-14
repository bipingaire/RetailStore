'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, User, Lock, ArrowRight, Loader2, CheckCircle, XCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        storeName: '',
        subdomain: ''
    });

    // Auto-generate subdomain from store name
    const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        // Simple slugify: lowercase, remove special chars, replace spaces with hyphens
        const suggestedSubdomain = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');

        setFormData(prev => ({
            ...prev,
            storeName: name,
            subdomain: prev.subdomain === '' || prev.subdomain === prev.storeName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
                ? suggestedSubdomain
                : prev.subdomain
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            toast.success('Store created successfully! Redirecting...');

            // Allow toast to show before redirect
            setTimeout(() => {
                router.push('/admin/login?registered=true');
            }, 1500);

        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

                    <Store className="mx-auto mb-4 text-blue-100" size={40} />
                    <h1 className="text-2xl font-bold mb-2">Start Your Business</h1>
                    <p className="text-blue-100 text-sm">Create your store on RetailOS</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* Store Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                            <Store size={14} /> Shop Details
                        </div>

                        {/* Store Name */}
                        <div>
                            <input
                                type="text"
                                required
                                value={formData.storeName}
                                onChange={handleStoreNameChange}
                                placeholder="Store Name (e.g. Acme Retail)"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Subdomain */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Globe size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.subdomain}
                                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                placeholder="subdomain"
                                className="w-full pl-11 pr-32 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 text-sm select-none bg-gray-50 rounded-r-xl border-l border-gray-200 px-3">
                                .indumart.us
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-4" />

                    {/* User Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                            <User size={14} /> Admin Account
                        </div>

                        {/* Full Name */}
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Full Name"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> {/* Reusing Icon for visual consistency */}
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email Address"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Password"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 hover:shadow-xl active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating Store...
                            </>
                        ) : (
                            <>
                                Create My Store <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account? <Link href="/admin/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
