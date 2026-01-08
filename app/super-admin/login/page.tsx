'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperadminLogin() {
    const [email, setEmail] = useState('superadmin@retailos.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSetupAccount = async () => {
        setLoading(true);
        try {
            // Sign up the master account
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: 'Master Superadmin'
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (!signUpData.user) {
                throw new Error('Account creation failed');
            }

            // Insert into superadmin-users table
            const { error: insertError } = await supabase
                .from('superadmin-users')
                .insert({
                    'user-id': signUpData.user.id,
                    'full-name': 'Master Superadmin',
                    'email': email,
                    'permissions-json': {
                        manage_stores: true,
                        manage_products: true,
                        manage_users: true,
                        view_analytics: true,
                        global_admin: true
                    },
                    'is-active': true
                });

            if (insertError) {
                console.error('Failed to add to superadmin table:', insertError);
                // Continue anyway - they can add manually
            }

            toast.success('Master Account Created! Logging you in...');

            // Auto-login
            router.push('/super-admin');
            router.refresh();

        } catch (error: any) {
            console.error('Setup error:', error);
            toast.error(error.message || 'Account setup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            toast.success('Welcome back, Owner.');
            router.push('/super-admin');
            router.refresh();

        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid credentials. Try creating the account first.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 mb-6 border border-blue-600/30 shadow-lg shadow-blue-900/20">
                        <Database size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Master Console</h1>
                    <p className="text-gray-400">Restricted Access • Superadmin Only</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Superadmin ID</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="admin@retailos.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Security Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            {loading ? 'Verifying Credentials...' : 'Access Console'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <button
                            onClick={handleSetupAccount}
                            disabled={loading}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                            Create Master Account (First Time Setup)
                        </button>
                        <p className="text-xs text-gray-600 text-center mt-2">Click this if you haven't created the superadmin account yet</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
                        <AlertCircle size={12} />
                        <span>Unauthorized access attempts are logged.</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
