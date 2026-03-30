'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Tag, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GlobalCategory {
    'category-id': string;
    'category-name': string;
    description: string | null;
    'is-active': boolean;
}

export default function SuperadminCategoriesPage() {
    const [categories, setCategories] = useState<GlobalCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('global-categories')
                .select('*')
                .order('category-name', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading global categories:', error);
            alert('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('global-categories')
                .insert([
                    { 'category-name': newName.trim(), description: newDesc.trim() || null }
                ]);

            if (error) throw error;

            setNewName('');
            setNewDesc('');
            await loadCategories();
        } catch (error: any) {
            console.error('Error adding category:', error);
            alert(`Failed to add category: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteCategory(id: string) {
        if (!confirm('Are you sure you want to delete this global category? Stores will no longer see it.')) return;

        try {
            const { error } = await supabase
                .from('global-categories')
                .delete()
                .eq('category-id', id);

            if (error) throw error;
            await loadCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/super-admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Tag className="text-blue-600" /> Global Categories
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        These categories are pushed to EVERY store tenant and enforce strict AI invoice parsing.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Category</h2>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g. Dairy"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <input
                                type="text"
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                                placeholder="e.g. Milk, cheese, butter"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving || !newName.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Add Category
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Active Global Categories ({categories.length})</h3>
                    </div>
                    {categories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No global categories defined yet.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {categories.map(cat => (
                                <li key={cat['category-id']} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-900">{cat['category-name']}</p>
                                        {cat.description && (
                                            <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCategory(cat['category-id'])}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Category"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
