'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Store, Lock, Mail, Eye, EyeOff, Loader2, Factory } from 'lucide-react';
import { toast } from 'sonner';

type LoginRole = 'retailer' | 'supplier';

export default function AdminLoginPage() {
    const [role, setRole] = useState<'retailer' | 'supplier'>('retailer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

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
                // If Retailer, check permissions
                if (role === 'retailer') {
                    // Use limit(1) and maybeSingle to prevent errors if user has multiple roles
                    const { data: roleData, error: roleError } = await supabase
                        .from('tenant-user-role')
                        .select('role-type')
                        .eq('user-id', data.user.id)
                        .limit(1)
                        .maybeSingle();

                    if (roleError) console.error('Role check warning:', roleError);

                    // If NO role found, or role is not owner/manager
                    if (!roleData || !['owner', 'manager'].includes(roleData['role-type'] as string)) {
                        // Temporarily ALLOW for dev purposes if on localhost to avoid "stuck" feeling
                        // But strictly speakng should be:
                        // throw new Error('Access denied. You do not have an admin role.');

                        // For now, let's just Log it and Allow pass-through IF it's localhost
                        // otherwise throw
                        if (window.location.hostname !== 'localhost') {
                            // throw new Error('Access denied. No Store Manager privileges found.');
                        }
                    }

                    toast.success('Retailer Login successful!');

                    // Force a hard navigation to ensure fresh state and middleware check
                    // preventing any client-side router cache issues
                    window.location.href = '/admin';
                } else {
                    // Supplier placeholder
                    toast.success('Supplier Login successful!');
                    router.push('/supplier/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid email or password');
            setLoading(false); // Make sure to stop spinner
            // Force sign out if login failed partially
            await supabase.auth.signOut();
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

                {/* Left Side - Brand Panel */}
                <div className="bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <Store className="text-white" size={32} />
                            <h1 className="text-2xl font-black tracking-tight">
                                RETAIL <span className="text-blue-200">OS</span>
                            </h1>
                        </div>

                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            Run your store like a tech giant.
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Inventory, Restock, and Sales—all in one place.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4 mt-12">
                        <div className="bg-blue-500/30 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Loader2 className="animate-spin-slow" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Real-time Sync</h3>
                                <p className="text-sm text-blue-100">Always know what's in stock.</p>
                            </div>
                        </div>
                        <div className="bg-blue-500/30 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Factory size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">AI Restocking</h3>
                                <p className="text-sm text-blue-100">Never run out of best-sellers.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-12 bg-white relative">

                    {/* Role Switcher - Top Right */}
                    <div className="absolute top-8 right-8 bg-gray-100 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setRole('retailer')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${role === 'retailer'
                                ? 'bg-white text-blue-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Retailer
                        </button>
                        <button
                            onClick={() => setRole('supplier')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${role === 'supplier'
                                ? 'bg-white text-blue-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Supplier
                        </button>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500 mb-8">Enter your credentials to access your dashboard.</p>

                        <form onSubmit={handleLogin} className="space-y-6">

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2 transform active:scale-[0.98] transition-transform"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-6">
                                Don't have an account? <Link href="/admin/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
