'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Plus, Trash2, Tag, Loader2, ArrowLeft, Percent, Globe, Package } from 'lucide-react';
import Link from 'next/link';

interface GlobalTaxRule {
    'tax-rule-id': string;
    state: string;
    'target-type': string;
    'target-value': string;
    'tax-rate': number;
    'is-active': boolean;
}

export default function SuperadminTaxesPage() {
    const [rules, setRules] = useState<GlobalTaxRule[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state
    const [newState, setNewState] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newRate, setNewRate] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [rulesRes, catRes] = await Promise.all([
                apiClient.get('/tax/rules'),
                apiClient.get('/categories/global')
            ]);

            // Map backend schema property names to what frontend currently uses
            const mappedRules = rulesRes.map((r: any) => ({
                'tax-rule-id': r.id,
                state: r.state,
                'target-type': r.targetType,
                'target-value': r.targetValue,
                'tax-rate': parseFloat(r.taxRate),
                'is-active': r.isActive
            }));
            
            const mappedCats = catRes.map((c: any) => ({
                'category-id': c.id,
                'category-name': c.name
            }));

            setRules(mappedRules || []);
            setCategories(mappedCats || []);
        } catch (error) {
            console.error('Error loading tax data:', error);
            alert('Failed to load tax rules');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddRule(e: React.FormEvent) {
        e.preventDefault();
        
        // Validation
        if (!newCategory) {
            alert('Please select a valid category.');
            return;
        }

        setIsSaving(true);
        try {
            await apiClient.post('/tax/rules', {
                state: newState.trim().toUpperCase(),
                targetType: 'CATEGORY',
                targetValue: newCategory,
                taxRate: parseFloat(newRate) || 0
            });

            setNewRate('');
            setNewCategory('');
            await loadData();
        } catch (error: any) {
            console.error('Error adding rule:', error);
            alert(`Failed to add rule: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteRule(id: string) {
        if (!confirm('Are you sure you want to delete this tax rule?')) return;

        try {
            await apiClient.delete(`/tax/rules/${id}`);
            await loadData();
        } catch (error: any) {
            console.error('Error deleting rule:', error);
            alert('Failed to delete tax rule');
        }
    }

    const getStateBadgeColor = (state: string) => {
        if (state === 'ALL') return 'bg-gray-100 text-gray-800';
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/super-admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Percent className="text-indigo-600" /> Global Tax Rules
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Define geographic and category-based tax rules enforced automatically across all tenant stores.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit sticky top-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Rule</h2>
                    <form onSubmit={handleAddRule} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State / Region</label>
                            <input
                                type="text"
                                value={newState}
                                onChange={e => setNewState(e.target.value)}
                                placeholder="e.g. NY, CA, TX"
                                className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Category</label>
                            <select
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="" disabled>Select a specific category...</option>
                                {categories.map(c => (
                                    <option key={c['category-id']} value={c['category-name']}>{c['category-name']}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.001"
                                    value={newRate}
                                    onChange={e => setNewRate(e.target.value)}
                                    placeholder="e.g. 8.875"
                                    className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Create Tax Rule
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Active Tax Rules ({rules.length})</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">State</th>
                                        <th className="px-6 py-3 font-medium">Rule Type</th>
                                        <th className="px-6 py-3 font-medium">Target</th>
                                        <th className="px-6 py-3 font-medium">Tax Rate</th>
                                        <th className="px-6 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rules.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No tax rules have been defined yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        rules.map(rule => (
                                            <tr key={rule['tax-rule-id']} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md border text-xs font-bold ${getStateBadgeColor(rule.state)}`}>
                                                        {rule.state}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        {rule['target-type'] === 'DEFAULT' ? <Globe size={14} className="text-emerald-500" /> : 
                                                         rule['target-type'] === 'CATEGORY' ? <Tag size={14} className="text-orange-500" /> : 
                                                         <Package size={14} className="text-purple-500" />}
                                                        {rule['target-type']}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-gray-700">
                                                    {rule['target-value']}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {Number(rule['tax-rate']).toFixed(3).replace(/\.?0+$/, '')}%
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteRule(rule['tax-rule-id'])}
                                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors inline-flex items-center"
                                                        title="Delete Rule"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
