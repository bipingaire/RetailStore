'use client';
import { useState, type FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminLoginPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Schema Verification: Check against 'superadmin-users' table
            const { data: superAdmin, error: roleError } = await supabase
                .from('superadmin-users')
                .select('superadmin-id, is-active')
                .eq('user-id', data.user.id)
                .eq('is-active', true)
                .single();

            if (roleError || !superAdmin) {
                // Log them out immediately if not authorized
                await supabase.auth.signOut();
                throw new Error('Access Denied: Not a recognized Superadmin');
            }

            toast.success('Welcome back, Superadmin');
            router.push('/super-admin');
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Authentication failed');
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-2xl shadow-blue-900/50">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Super Admin</h1>
                    <p className="text-slate-400">RetailOS Platform Control</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm font-medium">
                                <AlertTriangle size={18} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@retailos.cloud"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Access Console'}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                    </form>
                </div>

                <div className="text-center mt-8 text-xs text-slate-600 font-medium">
                    Secure Environment • Authorized Personnel Only
                </div>

            </div>
        </div>
    );
}
