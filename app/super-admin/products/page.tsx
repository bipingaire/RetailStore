'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, Plus, Edit, Image, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MasterCatalogPage() {
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
            const uniqueCategories = [...new Set(data.map(p => p['category-name']).filter(Boolean))];
            setCategories(uniqueCategories);
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = searchQuery === '' ||
            product['product-name'].toLowerCase().includes(searchQuery.toLowerCase()) ||
            product['brand-name']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product['upc-ean-code']?.includes(searchQuery);

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
                        <Link
                            key={product['product-id']}
                            href={`/superadmin/products/${product['product-id']}/enrich`}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                        >
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
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
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
