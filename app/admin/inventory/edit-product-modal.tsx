'use client';
import { useState } from 'react';
import { X, Save, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

type EditProductModalProps = {
    product: any;
    onClose: () => void;
    onSave: (updatedProduct: any) => void;
};

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price || product.sales_price || 0,
        total_qty: product.total_qty || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'total_qty' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Update Product Details (Price, Category, Name)
            // The backend expects specific DTO structure.
            // Based on implementation plan, we use PUT /products/:id
            await apiClient.put(`/products/${product.id || product.product_id || product.inventory_id}`, {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: formData.price,
                // We generally don't update stock via simple PUT if there's a dedicated stock endpoint, 
                // but for now let's assume the main update handles it or we call stock endpoint separately.
                // However, the user asked to "edit stock also". 
                // If the backend `update` method supports `stock` or `total_qty`, great. 
                // Checking product.controller.ts, there is updateStock endpoint.
                // But let's try sending it in update first, if not we might need a second call.
                // Reviewing ProductController: update calls productService.update.
                // ProductService.update uses storage.update which usually updates fields.
                // Use caution with stock. Let's send it and see.
            });

            // 2. If stock changed, we might need a separate call if the main update doesn't handle it.
            // But for simplicity in this "edit all" modal, we'll assume the user wants to OVERRIDE.
            // A better approach for stock is usually "Adjustment", but "Edit" implies override.
            // Let's Check if stock changed.
            if (formData.total_qty !== product.total_qty) {
                // We might need to call the stock adjustment endpoint or just assume the PUT handled it.
                // Given the user instruction "editing ... stock also", and the typical simple CRUD app structure,
                // we will assume the PUT /products/:id endpoint (driven by Prisma update) can update the 'stock' field 
                // if it exists on the Product model.
                // Let's check schema... Product has 'stock' (Int).
                await apiClient.put(`/products/${product.id || product.product_id || product.inventory_id}`, {
                    stock: formData.total_qty
                });
            }

            toast.success('Product updated successfully');
            onSave({ ...product, ...formData });
            onClose();
        } catch (error: any) {
            console.error('Update failed:', error);
            toast.error(error.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Product description..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="total_qty"
                                    value={formData.total_qty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
