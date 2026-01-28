'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Package, Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const data = await apiClient.getProducts({ search: searchTerm });
            setProducts(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = searchTerm
        ? products.filter(p => p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : products;

    if (loading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Global Product Catalog</h1>
                    <p className="text-slate-500 mt-1">Manage standard products synced across all tenant stores.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-900/20">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Filters Bar */}
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, brand, or UPC..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                        />
                    </div>
                    <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category & Brand</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">UPC / EAN</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.product_id} className="hover:bg-slate-50/50 transition bg-white">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                                {product.image_url ? (
                                                    <img src={product.image_url} className="w-full h-full object-cover" alt={product.product_name} />
                                                ) : (
                                                    <Package size={20} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{product.product_name}</div>
                                                <div className="text-xs text-slate-500">Global ID: {product.product_id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900 font-medium">{product.category_name || 'Uncategorized'}</div>
                                        <div className="text-xs text-slate-500">{product.brand_name || 'No Brand'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-600">
                                        {product.upc_ean_code || '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition" title="Edit Product">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="bg-white text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <Package size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                            Try adjusting your search terms or add a new global product to the catalog.
                        </p>
                        <button className="mt-6 text-blue-600 font-bold hover:underline">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
