'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Check, X, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function PendingProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadProducts() {
        try {
            const data = await apiClient.getProducts({ status: 'pending' });
            setProducts(data as any[]);
        } catch (error) {
            console.error('Failed to load pending products:', error);
            toast.error('Failed to load pending products');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleApprove(id: string) {
        try {
            await apiClient.updateProduct(id, { status: 'active' });
            toast.success('Product approved');
            loadProducts();
        } catch (error) {
            toast.error('Failed to approve product');
        }
    }

    async function handleReject(id: string) {
        if (!confirm('Are you sure you want to reject this product?')) return;
        try {
            await apiClient.updateProduct(id, { status: 'rejected' });
            toast.success('Product rejected');
            loadProducts();
        } catch (error) {
            toast.error('Failed to reject product');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                <div className="animate-spin text-white">
                    <Package size={48} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white">Pending Products</h1>
                    <p className="text-purple-200 mt-1">Review and approve product additions</p>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                    {products.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Check className="mx-auto mb-4 text-green-500" size={48} />
                            <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
                            <p>No products pending review.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-gray-700 text-sm border-b">
                                    <tr>
                                        <th className="py-4 px-6 text-left">Product</th>
                                        <th className="py-4 px-6 text-left">UPC</th>
                                        <th className="py-4 px-6 text-left">Category</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.product_id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-900">{product.product_name}</div>
                                                <div className="text-sm text-gray-500">{product.brand_name}</div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-mono text-sm">{product.upc_ean_code}</td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {product.category_name}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    onClick={() => handleApprove(product.product_id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium text-sm transition"
                                                >
                                                    <Check size={16} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(product.product_id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium text-sm transition"
                                                >
                                                    <X size={16} />
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
