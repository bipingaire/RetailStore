'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ShoppingBag, Minus, Plus, Package, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        async function loadProduct() {
            try {
                const inventoryItem = await apiClient.getInventoryItem(id as string);

                // Also fetch product details if needed, but inventory item usually has what we need
                // or the API returns a joined object. Assuming joined object from previous `shop.py` 
                // actually `getInventoryItem` fetches raw inventory. 
                // Let's use the shop API which is better suited.

                const products = await apiClient.request('/api/shop/products', {});
                const found = (products as any[]).find(p => p.inventory_id === id);

                if (found) {
                    setProduct(found);
                } else {
                    // Fallback to direct inventory fetch if shop list doesn't have it (unlikely)
                    setProduct(inventoryItem);
                }
            } catch (error) {
                console.error('Error loading product:', error);
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    const addToCart = () => {
        setAdding(true);
        try {
            const savedCart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
            const current = savedCart[id as string] || 0;
            savedCart[id as string] = current + qty;
            localStorage.setItem('retail_cart', JSON.stringify(savedCart));

            toast.success('Added to cart');

            // Reset qty
            setQty(1);
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Package size={64} className="text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                <p className="text-gray-500 mb-6">This product may be out of stock or removed.</p>
                <Link href="/shop" className="text-green-600 font-bold hover:underline">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium mb-8 transition">
                    <ArrowLeft size={20} />
                    Back to Shop
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="bg-gray-50 rounded-3xl aspect-square flex items-center justify-center p-8 overflow-hidden">
                        {product.image_url ? (
                            <img src={product.image_url} className="w-full h-full object-contain mix-blend-multiply" alt={product.product_name} />
                        ) : (
                            <Package size={120} className="text-gray-300" />
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <div className="mb-2">
                            <span className="text-green-600 font-bold uppercase tracking-wider text-sm">{product.category || 'Product'}</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{product.product_name}</h1>

                        {product.brand_name && (
                            <p className="text-xl text-gray-500 mb-6">{product.brand_name}</p>
                        )}

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-black text-gray-900">${product.price?.toFixed(2)}</span>
                            {product.in_stock ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                                    In Stock ({product.stock})
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description || "No description available for this product. High quality and verified item from our inventory."}
                        </p>

                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="p-3 hover:bg-gray-50 text-gray-600 transition"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                                        className="p-3 hover:bg-gray-50 text-gray-600 transition"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={addToCart}
                                    disabled={!product.in_stock || adding}
                                    className="flex-1 bg-green-600 text-white py-3.5 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag size={24} />
                                    {adding ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
