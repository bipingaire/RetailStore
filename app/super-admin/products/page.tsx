'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Package, Plus, Edit, Image, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MasterCatalogPage() {
    const supabase = createClientComponentClient();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    async function loadProducts() {
        const { data, error } = await supabase
            .from('global-product-master-catalog')
            .select('*')
            .order('created-at', { ascending: false });

        if (error) {
            toast.error('Failed to load products');
            console.error(error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    }

    async function loadCategories() {
        const { data } = await supabase
            .from('global-product-master-catalog')
            .select('category-name')
            .not('category-name', 'is', null);

        if (data) {
            const uniqueCategories = [...new Set(data.map((p: any) => p['category-name']).filter(Boolean))];
            setCategories(uniqueCategories);
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = searchQuery === '' ||
            (product['product-name'] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product['brand-name'] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product['upc-ean-code'] || '').includes(searchQuery);

        const matchesCategory = filterCategory === 'all' ||
            product['category-name'] === filterCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading products...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Master Product Catalog</h1>
                    <p className="text-gray-600 mt-1">{products.length} products • Available to all stores</p>
                </div>
                <Link
                    href="/superadmin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, brand, or UPC..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-white rounded-xl border border-gray-200">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No products found</p>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div
                            key={product['product-id']}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group relative"
                        >
                            <Link href={`/superadmin/products/${product['product-id']}/edit`} legacyBehavior>
                                <a className="peer block aspect-square bg-gray-100 relative overflow-hidden">
                                    {product['image-url'] ? (
                                        <img
                                            src={product['image-url']}
                                            alt={product['product-name']}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-16 h-16 text-gray-300" />
                                        </div>
                                    )}
                                    {product['enriched-by-superadmin'] && (
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                            Enriched
                                        </div>
                                    )}
                                </a>
                            </Link>

                            {/* UPLOAD OVERLAY */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <label className="cursor-pointer bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg flex items-center gap-2 backdrop-blur-sm text-xs font-bold shadow-sm">
                                    <Image className="w-4 h-4" />
                                    <span>Upload</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const toastId = toast.loading("Uploading image...");
                                            try {
                                                const fileName = `${product['product-id']}-${Date.now()}.jpg`;
                                                const { data: uploadData, error: uploadError } = await supabase.storage
                                                    .from('product-images')
                                                    .upload(fileName, file);

                                                if (uploadError) throw uploadError;

                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('product-images')
                                                    .getPublicUrl(fileName);

                                                const { error: updateError } = await supabase
                                                    .from('global-product-master-catalog')
                                                    .update({ 'image-url': publicUrl })
                                                    .eq('product-id', product['product-id']);

                                                if (updateError) throw updateError;

                                                toast.success("Image updated!", { id: toastId });

                                                // Refresh local state without full reload
                                                setProducts(prev => prev.map(p =>
                                                    p['product-id'] === product['product-id']
                                                        ? { ...p, 'image-url': publicUrl }
                                                        : p
                                                ));

                                            } catch (err: any) {
                                                console.error(err);
                                                toast.error("Upload failed: " + err.message, { id: toastId });
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {product['product-name']}
                                </h3>
                                {product['brand-name'] && (
                                    <p className="text-sm text-gray-600 mb-2">{product['brand-name']}</p>
                                )}
                                {product['category-name'] && (
                                    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {product['category-name']}
                                    </span>
                                )}
                                {product['upc-ean-code'] && (
                                    <p className="text-xs text-gray-400 mt-2">UPC: {product['upc-ean-code']}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
