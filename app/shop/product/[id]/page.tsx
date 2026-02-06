'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { use } from 'react';
import {
    Star, Heart, Share2, ShoppingCart, Package,
    CheckCircle, Plus, Minus, ArrowLeft, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id]);

    async function loadProduct() {
        const { data, error } = await supabase
            .from('retail-store-inventory-item')
            .select(`
        id: inventory-id,
        price: selling-price-amount,
        current_stock_quantity: current-stock-quantity,
        global_products: global-product-master-catalog!global-product-id (
          name: product-name,
          image_url: image-url,
          category: category-name,
          manufacturer: manufacturer-name,
          description: description-text,
          package_size: package-size
        )
      `)
            .eq('inventory-id', id)
            .single();

        if (data) {
            setProduct(data);
            loadRelatedProducts(data.global_products?.category);
        }
        setLoading(false);
    }

    async function loadRelatedProducts(category: string) {
        if (!category) return;

        const { data } = await supabase
            .from('retail-store-inventory-item')
            .select(`
        id: inventory-id,
        price: selling-price-amount,
        global_products: global-product-master-catalog!global-product-id (name: product-name, image_url: image-url, category: category-name)
      `)
            .eq('global-product-master-catalog.category-name', category)
            .neq('inventory-id', id)
            .limit(4);

        if (data) setRelatedProducts(data.map((d: any) => ({
            ...d,
            price: Number(d.price ?? 0)
        })));
    }

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
        cart[id] = (cart[id] || 0) + quantity;
        localStorage.setItem('retail_cart', JSON.stringify(cart));

        // Show success message
        alert(`Added ${quantity} item(s) to cart!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                    <Link href="/shop" className="text-green-600 hover:underline">
                        Return to shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

                    {/* Product Image */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                            <img
                                src={product.global_products?.image_url || 'https://via.placeholder.com/600'}
                                alt={product.global_products?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Thumbnail Gallery Placeholder */}
                        <div className="flex gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-transparent hover:border-green-500 cursor-pointer">
                                    <img
                                        src={product.global_products?.image_url || 'https://via.placeholder.com/80'}
                                        alt={`View ${i}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full mb-2">
                                <Sparkles size={12} />
                                {product.global_products?.category || 'Product'}
                            </span>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">
                                {product.global_products?.name}
                            </h1>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />
                                    ))}
                                    <Star size={16} className="text-gray-300" />
                                </div>
                                <span className="text-sm text-gray-500">(24 reviews)</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-4xl font-black text-green-700 mb-2">${product.price?.toFixed(2)}</div>
                            <div className="flex items-center gap-2 text-sm">
                                {product.current_stock_quantity > 0 ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-600" />
                                        <span className="text-green-700 font-bold">In Stock ({product.current_stock_quantity} available)</span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-bold">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6 pb-6 border-b">
                            <h3 className="font-bold text-gray-900 mb-2">Product Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.global_products?.description ||
                                    `High-quality ${product.global_products?.name} from ${product.global_products?.manufacturer || 'premium brands'}. Perfect for your daily needs.`}
                            </p>
                        </div>

                        {/* Product Details */}
                        <div className="mb-8 space-y-2 text-sm">
                            {product.global_products?.manufacturer && (
                                <div className="flex">
                                    <span className="text-gray-500 w-32">Brand:</span>
                                    <span className="font-bold">{product.global_products.manufacturer}</span>
                                </div>
                            )}
                            {product.global_products?.package_size && (
                                <div className="flex">
                                    <span className="text-gray-500 w-32">Size:</span>
                                    <span className="font-bold">{product.global_products.package_size}</span>
                                </div>
                            )}
                            <div className="flex">
                                <span className="text-gray-500 w-32">Category:</span>
                                <span className="font-bold">{product.global_products?.category || 'General'}</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-100 rounded-l-lg"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="px-6 font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-gray-100 rounded-r-lg"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={addToCart}
                                disabled={product.current_stock_quantity === 0}
                                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>

                            <div className="flex gap-3">
                                <button className="flex-1 border-2 border-gray-200 py-3 rounded-lg font-boldtext-gray-700 hover:border-red-500 hover:text-red-500 transition flex items-center justify-center gap-2">
                                    <Heart size={20} />
                                    Wishlist
                                </button>
                                <button className="flex-1 border-2 border-gray-200 py-3 rounded-lg font-bold text-gray-700 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2">
                                    <Share2 size={20} />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-green-50 rounded-xl p-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span>Free delivery on orders over $50</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span>Easy returns within 30 days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span>100% quality guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/shop/product/${related.id}`}
                                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition group"
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                        <img
                                            src={related.global_products?.image_url || 'https://via.placeholder.com/200'}
                                            alt={related.global_products?.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2">
                                        {related.global_products?.name}
                                    </h3>
                                    <div className="text-lg font-black text-green-700">
                                        ${related.price?.toFixed(2)}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
