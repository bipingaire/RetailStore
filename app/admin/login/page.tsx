'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Store, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Check if user has admin/manager role
                const { data: roleData } = await supabase
                    .from('tenant-user-role')
                    .select('role-type')
                    .eq('user-id', data.user.id)
                    .single();

                if (!roleData || !['owner', 'manager'].includes(roleData['role-type'] as string)) {
                    await supabase.auth.signOut();
                    toast.error('Access denied. Admin privileges required.');
                    setLoading(false);
                    return;
                }

                toast.success('Login successful! Redirecting...');

                // Redirect to admin dashboard
                router.push('/admin');
                router.refresh();
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid email or password');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                            <Store className="text-blue-400" size={40} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        RETAIL<span className="text-blue-400">OS</span>
                    </h1>
                    <p className="text-blue-200/60 text-sm font-semibold uppercase tracking-wider mt-2">
                        Admin Console
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-bold text-white/90 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@retailstore.com"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-bold text-white/90 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300/50" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-300 transition"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In to Admin'
                            )}
                        </button>

                        {/* Test Credentials Info */}
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                            <p className="text-xs text-blue-200/80 font-medium">
                                <strong className="text-blue-300">Test Credentials:</strong><br />
                                Email: superadmin@retailstore.com<br />
                                Password: SuperSecure123!
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-white/40 text-sm mt-6">
                    Retail Store Management System v1.0
                </p>
            </div>
        </div>
    );
}
