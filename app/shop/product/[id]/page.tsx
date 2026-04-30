'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { use } from 'react';
import {
    Star, Heart, Share2, ShoppingCart, CheckCircle,
    Plus, Minus, ArrowLeft, Sparkles, MessageCircle, Info, ThumbsUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // Reviews State
    const [reviews, setReviews] = useState<any[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('retail_user');
        if (storedUser) setUser(JSON.parse(storedUser));
        loadProduct();
        loadReviews();
    }, [id]);

    async function loadReviews() {
        try {
            const data = await apiClient.get(`/products/${id}/reviews`);
            if (data) {
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating || 0);
                setTotalReviews(data.totalCount || 0);
            }
        } catch (e) {
            console.error('Failed to load reviews:', e);
        }
    }

    async function submitReview(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return alert('Please login to submit a review');
        if (!newReview.comment) return alert('Please write a comment');
        
        setIsSubmittingReview(true);
        try {
            await apiClient.post(`/products/${id}/reviews`, {
                userId: user.id,
                userName: user.name || user.email.split('@')[0],
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            await loadReviews();
            alert('Review submitted successfully!');
        } catch (e) {
            alert('Failed to submit review. Try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    }

    async function loadProduct() {
        try {
            const data = await apiClient.get(`/products/${id}`);
            if (data) {
                const adaptedProduct = {
                    id: data.id,
                    price: data.price,
                    current_stock_quantity: data.stock,
                    global_products: {
                        name: data.name,
                        image_url: data.imageUrl,
                        category: data.category,
                        description: data.description,
                        package_size: null
                    }
                };
                setProduct(adaptedProduct);
                loadRelatedProducts(data.category);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    async function loadRelatedProducts(category: string) {
        if (!category) return;
        try {
            const allProducts = await apiClient.get('/products?sellableOnly=true');
            const related = allProducts
                .filter((p: any) => p.category === category && p.id !== id)
                .slice(0, 4)
                .map((p: any) => ({
                    id: p.id,
                    price: p.price || 0,
                    global_products: {
                        name: p.name,
                        image_url: p.imageUrl || p.image,
                        category: p.category
                    }
                }));
            if (related.length > 0) setRelatedProducts(related);
        } catch (e) {
            console.error(e);
        }
    }

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
        cart[id] = (cart[id] || 0) + quantity;
        localStorage.setItem('retail_cart', JSON.stringify(cart));
        alert(`Added ${quantity} item(s) to cart!`);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                <Link href="/shop" className="text-green-600 hover:underline">Return to shop</Link>
            </div>
        </div>
    );

    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0, 0]; // index 1-5
    reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating]++; });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold">
                        <ArrowLeft size={20} /> Back
                    </button>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Product Image */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <div className="aspect-square w-full max-w-md rounded-2xl overflow-hidden bg-white mb-6 relative">
                            <img
                                src={product.global_products?.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                                alt={product.global_products?.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full mb-3 border border-green-200">
                                <Sparkles size={12} />
                                {product.global_products?.category || 'Product'}
                            </span>
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight">
                                {product.global_products?.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={20} fill={i <= Math.round(averageRating) ? "#16a34a" : "none"} className={i <= Math.round(averageRating) ? "text-green-600" : "text-gray-300"} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-gray-500">{averageRating.toFixed(1)}/5 ({totalReviews} reviews)</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="text-5xl font-black text-green-700 mb-2">${product.price?.toFixed(2)}</div>
                            <div className="flex items-center gap-2 text-sm mt-3 bg-gray-50 p-3 rounded-xl w-fit border border-gray-100">
                                {product.current_stock_quantity > 0 ? (
                                    <>
                                        <CheckCircle size={18} className="text-green-600" />
                                        <span className="text-gray-800 font-bold">In Stock ({product.current_stock_quantity} available)</span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-bold">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <h3 className="font-black text-lg text-gray-900 mb-3 flex items-center gap-2"><Info size={20} className="text-green-600" /> Product Details</h3>
                            <p className="text-gray-600 leading-relaxed text-base">
                                {product.global_products?.description ||
                                    `High-quality ${product.global_products?.name}. Perfect for your daily needs.`}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white w-full sm:w-auto h-14">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gray-50 rounded-l-xl text-gray-500 hover:text-green-600 transition-colors">
                                    <Minus size={20} strokeWidth={3} />
                                </button>
                                <span className="px-6 font-black text-xl text-center w-16">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-gray-50 rounded-r-xl text-gray-500 hover:text-green-600 transition-colors">
                                    <Plus size={20} strokeWidth={3} />
                                </button>
                            </div>
                            <button
                                onClick={addToCart}
                                disabled={product.current_stock_quantity === 0}
                                className="flex-1 bg-green-600 text-white rounded-xl font-black text-lg hover:bg-green-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none h-14"
                            >
                                <ShoppingCart size={24} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ratings & Reviews Section - Match Design 3 */}
                <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100 mb-12">
                    <h2 className="text-2xl font-black text-gray-900 mb-8 pb-4 border-b">Ratings & Reviews</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Summary Column */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <div className="text-6xl font-black text-gray-900 mb-3">{averageRating.toFixed(1)}<span className="text-3xl text-gray-400">/5</span></div>
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={24} fill={i <= Math.round(averageRating) ? "#16a34a" : "none"} className={i <= Math.round(averageRating) ? "text-green-600" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-gray-500 font-medium">{totalReviews} Ratings & {reviews.length} Reviews</p>
                        </div>

                        {/* Progress Bars Column */}
                        <div className="lg:col-span-4 flex flex-col justify-center gap-3 border-r border-l border-transparent lg:border-gray-100 lg:px-8">
                            {[5, 4, 3, 2, 1].map(stars => {
                                const count = ratingCounts[stars] || 0;
                                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-12 text-sm font-bold text-gray-600">
                                            {stars} <Star size={12} fill="currentColor" />
                                        </div>
                                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <div className="w-8 text-right text-xs text-gray-400 font-medium">{count}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Review Action */}
                        <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start lg:pl-8">
                            <h3 className="text-lg font-black text-gray-900 mb-2">Review this product</h3>
                            <p className="text-sm text-gray-500 mb-6 text-center lg:text-left">Share your thoughts with other customers</p>
                            {!user ? (
                                <Link href="/shop/login" className="w-full bg-white border-2 border-gray-200 text-gray-900 font-bold py-3 rounded-xl hover:border-green-600 hover:text-green-600 transition-colors text-center">
                                    Login to Write Review
                                </Link>
                            ) : (
                                <form onSubmit={submitReview} className="w-full flex flex-col gap-3">
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl">
                                        <span className="text-sm font-bold text-gray-600 px-2">Your Rating:</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <button type="button" key={i} onClick={() => setNewReview({ ...newReview, rating: i })} className="p-1 hover:scale-110 transition-transform">
                                                    <Star size={24} fill={i <= newReview.rating ? "#16a34a" : "none"} className={i <= newReview.rating ? "text-green-600" : "text-gray-300"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        placeholder="Write your review here..."
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none h-24 text-sm"
                                        required
                                    />
                                    <button type="submit" disabled={isSubmittingReview} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
                                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900">Product Reviews</h3>
                            <select className="bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg px-4 py-2 outline-none">
                                <option>Most Recent</option>
                                <option>Highest Rating</option>
                                <option>Lowest Rating</option>
                            </select>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">No reviews yet. Be the first to review this product!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review, idx) => (
                                    <div key={review.id || idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-black text-lg">
                                                    {review.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{review.userName}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <Star key={i} size={12} fill={i <= review.rating ? "#16a34a" : "none"} className={i <= review.rating ? "text-green-600" : "text-gray-300"} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                                            <CheckCircle size={10} /> Verified Purchase
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed mt-3 pl-13">
                                            {review.comment}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 pl-13">
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-600 transition-colors">
                                                <ThumbsUp size={14} /> Helpful
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Sparkles className="text-green-600" /> You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/shop/product/${related.id}`}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-green-200 hover:shadow-lg transition-all group flex flex-col h-full"
                                >
                                    <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-2 flex items-center justify-center">
                                        <img
                                            src={related.global_products?.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3C/svg%3E"}
                                            alt={related.global_products?.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-2 flex-1">
                                        {related.global_products?.name}
                                    </h3>
                                    <div className="text-xl font-black text-green-700">
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
