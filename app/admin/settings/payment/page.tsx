'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CreditCard, Eye, EyeOff, Save, Edit2, CheckCircle, AlertCircle, DollarSign, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTenant } from '@/lib/hooks/useTenant';

type PaymentStatement = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: string;
    description: string;
    customerEmail: string;
};

export default function PaymentSettingsPage() {
    const supabase = createClientComponentClient();
    const { tenantId } = useTenant();

    const [activeTab, setActiveTab] = useState<'settings' | 'statements'>('settings');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);

    const [config, setConfig] = useState({
        publishableKey: '',
        secretKey: '',
        paymentEnabled: false
    });

    const [formData, setFormData] = useState({
        publishableKey: '',
        secretKey: ''
    });

    //  Statements
    const [statements, setStatements] = useState<PaymentStatement[]>([]);
    const [loadingStatements, setLoadingStatements] = useState(false);

    useEffect(() => {
        if (tenantId) {
            fetchPaymentConfig();
        }
    }, [tenantId]);

    useEffect(() => {
        if (activeTab === 'statements' && tenantId && config.paymentEnabled) {
            fetchStatements();
        }
    }, [activeTab, tenantId, config.paymentEnabled]);

    async function fetchPaymentConfig() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tenant-payment-config')
                .select('*')
                .eq('tenant-id', tenantId)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setConfig({
                    publishableKey: data['stripe-publishable-key'] || '',
                    secretKey: data['stripe-secret-key'] || '',
                    paymentEnabled: data['payment-enabled'] || false
                });
                setFormData({
                    publishableKey: data['stripe-publishable-key'] || '',
                    secretKey: data['stripe-secret-key'] || ''
                });
            }
        } catch (err: any) {
            console.error('Error fetching payment config:', err);
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    }

    async function fetchStatements() {
        setLoadingStatements(true);
        try {
            const response = await fetch(`/api/payment-statements?tenantId=${tenantId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch statements');
            }

            setStatements(data.statements || []);
        } catch (err: any) {
            console.error('Error fetching statements:', err);
            toast.error(err.message || 'Failed to load payment statements');
        } finally {
            setLoadingStatements(false);
        }
    }

    const handleSave = async () => {
        if (!tenantId) return toast.error('Tenant ID not found');

        // Validate keys
        if (!formData.publishableKey.startsWith('pk_')) {
            return toast.error('Invalid publishable key format. Must start with pk_');
        }
        if (!formData.secretKey.startsWith('sk_')) {
            return toast.error('Invalid secret key format. Must start with sk_');
        }

        try {
            const { data: existing } = await supabase
                .from('tenant-payment-config')
                .select('config-id')
                .eq('tenant-id', tenantId)
                .maybeSingle();

            if (existing) {
                // Update
                const { error } = await supabase
                    .from('tenant-payment-config')
                    .update({
                        'stripe-publishable-key': formData.publishableKey,
                        'stripe-secret-key': formData.secretKey,
                        'payment-enabled': true,
                        'updated-at': new Date().toISOString()
                    })
                    .eq('config-id', existing['config-id']);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('tenant-payment-config')
                    .insert({
                        'tenant-id': tenantId,
                        'stripe-publishable-key': formData.publishableKey,
                        'stripe-secret-key': formData.secretKey,
                        'payment-enabled': true
                    });

                if (error) throw error;
            }

            toast.success('Payment settings saved successfully!');
            setEditMode(false);
            fetchPaymentConfig();
        } catch (err: any) {
            console.error('Error saving payment config:', err);
            toast.error('Failed to save payment settings');
        }
    };

    const handleCancel = () => {
        setFormData({
            publishableKey: config.publishableKey,
            secretKey: config.secretKey
        });
        setEditMode(false);
        setShowSecretKey(false);
    };

    const maskSecretKey = (key: string) => {
        if (!key) return '';
        return key.slice(0, 7) + '••••••••••••••••' + key.slice(-4);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CreditCard className="text-blue-600" size={28} />
                            Payment Settings
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Configure Stripe payment integration for your store</p>
                    </div>

                    {activeTab === 'settings' && !editMode && config.publishableKey && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            <Edit2 size={16} />
                            Edit Keys
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 w-fit">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'settings'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <CreditCard size={16} />
                        API Keys
                    </button>
                    <button
                        onClick={() => setActiveTab('statements')}
                        className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'statements'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                        disabled={!config.paymentEnabled}
                    >
                        <FileText size={16} />
                        Statements
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'settings' ? (
                    <>
                        {/* Status Card */}
                        <div className={`p-4 rounded-xl border-2 ${config.paymentEnabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex items-center gap-3">
                                {config.paymentEnabled ? (
                                    <CheckCircle className="text-green-600" size={24} />
                                ) : (
                                    <AlertCircle className="text-yellow-600" size={24} />
                                )}
                                <div>
                                    <div className="font-bold text-gray-900">
                                        {config.paymentEnabled ? 'Payments Enabled' : 'Payments Not Configured'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {config.paymentEnabled
                                            ? 'Customers can checkout using Stripe'
                                            : 'Configure your Stripe keys to enable payments'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* API Keys Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Stripe API Keys</h2>

                            <div className="space-y-4">
                                {/* Publishable Key */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                                        Publishable Key
                                        <span className="text-xs text-gray-500 ml-2">(Safe to expose in frontend)</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="pk_live_..."
                                            value={formData.publishableKey}
                                            onChange={(e) => setFormData({ ...formData, publishableKey: e.target.value })}
                                        />
                                    ) : (
                                        <div className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 font-mono text-sm text-gray-700">
                                            {config.publishableKey || 'Not configured'}
                                        </div>
                                    )}
                                </div>

                                {/* Secret Key */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                                        Secret Key
                                        <span className="text-xs text-red-500 ml-2">(Keep confidential)</span>
                                    </label>
                                    <div className="relative">
                                        {editMode ? (
                                            <input
                                                type={showSecretKey ? 'text' : 'password'}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="sk_live_..."
                                                value={formData.secretKey}
                                                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                            />
                                        ) : (
                                            <div className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 bg-gray-50 font-mono text-sm text-gray-700">
                                                {config.secretKey ? (showSecretKey ? config.secretKey : maskSecretKey(config.secretKey)) : 'Not configured'}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setShowSecretKey(!showSecretKey)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showSecretKey ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {editMode && (
                                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Configuration
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <div className="text-sm font-bold text-blue-900 mb-2">📘 How to get Stripe Keys</div>
                                <div className="text-xs text-blue-700 space-y-1">
                                    <p>1. Log in to your Stripe Dashboard</p>
                                    <p>2. Go to Developers → API Keys</p>
                                    <p>3. Copy Publishable and Secret keys</p>
                                    <p>4. Paste them here and save</p>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="text-sm font-bold text-green-900 mb-2 flex items-center gap-1">
                                    <DollarSign size={16} /> Payment Flow
                                </div>
                                <div className="text-xs text-green-700 space-y-1">
                                    <p>✓ Customers checkout on your store</p>
                                    <p>✓ Payments processed via Stripe</p>
                                    <p>✓ Funds go directly to your account</p>
                                    <p>✓ View statements in this tab</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Statements Tab */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
                                    <p className="text-sm text-gray-500 mt-1">Recent transactions processed through Stripe</p>
                                </div>
                                <button
                                    onClick={fetchStatements}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {loadingStatements ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                            </div>
                        ) : statements.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p>No payment records found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Transaction ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {statements.map(stmt => (
                                            <tr key={stmt.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {new Date(stmt.created).toLocaleDateString()} {new Date(stmt.created).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                    ${stmt.amount.toFixed(2)} {stmt.currency}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stmt.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                                                        stmt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {stmt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{stmt.customerEmail}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-500">{stmt.id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
