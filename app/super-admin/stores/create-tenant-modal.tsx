import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface CreateTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateTenantModal({ isOpen, onClose, onSuccess }: CreateTenantModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subdomain: '',
        store_name: '',
        admin_email: '',
        admin_password: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient.createTenant(formData);
            toast.success('Tenant created successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to create tenant', error);
            toast.error(error.message || 'Failed to create tenant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Provision New Tenant</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Downtown Market"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={formData.store_name}
                            onChange={e => setFormData({ ...formData, store_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subdomain</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                required
                                pattern="[a-z0-9-]+"
                                placeholder="downtown"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={formData.subdomain}
                                onChange={e => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                            />
                            <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 text-sm font-medium">
                                .retailos.com
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Lowercase alphanumeric only.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Admin Email</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@store.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={formData.admin_email}
                            onChange={e => setFormData({ ...formData, admin_email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Admin Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={formData.admin_password}
                            onChange={e => setFormData({ ...formData, admin_password: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Provision Store
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
