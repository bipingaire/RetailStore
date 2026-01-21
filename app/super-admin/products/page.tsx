'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Package, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
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
            setProducts(data);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white">Global Product Catalog</h1>
                        <p className="text-purple-200 mt-1">Manage all products across all stores</p>
                    </div>
                    <button className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition flex items-center gap-2">
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-white/50" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Brand</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">UPC</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.product_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} className="w-full h-full object-cover" alt={product.product_name} />
                                                    ) : (
                                                        <Package size={20} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-gray-900">{product.product_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{product.brand_name || '—'}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.category_name || '—'}</td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{product.upc_ean_code || '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                                <p>No products found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
