'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Star, Heart, Share2, ShoppingBag, Package,
  CheckCircle, Plus, Minus, ArrowLeft, Truck,
  RotateCcw, ShieldCheck, ChevronRight, Tag
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    loadProduct();
    // Load existing cart qty
    try {
      const cart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
      setCartQty(cart[id] || 0);
    } catch {}
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    try {
      const data = await apiClient.get(`/products/${id}`);
      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          price: Number(data.price) || 0,
          stock: data.stock ?? data.current_stock_quantity ?? 0,
          imageUrl: data.imageUrl || data.image_url || null,
          category: data.category || 'General',
          description: data.description || null,
          sku: data.sku || null,
          barcode: data.barcode || null,
        });
        loadRelatedProducts(data.category, data.id);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function loadRelatedProducts(category: string, currentId: string) {
    if (!category) return;
    try {
      const res = await apiClient.get(`/products?sellableOnly=true&category=${encodeURIComponent(category)}&limit=8`);
      const arr = res?.data || (Array.isArray(res) ? res : []);
      const related = arr
        .filter((p: any) => p.id !== currentId)
        .slice(0, 4)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          imageUrl: p.imageUrl || p.image_url || null,
          category: p.category,
        }));
      setRelatedProducts(related);
    } catch (e) {
      console.error(e);
    }
  }

  const updateCart = (delta: number) => {
    const cart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
    const newQty = Math.max(0, (cart[id] || 0) + delta);
    if (newQty === 0) {
      delete cart[id];
    } else {
      cart[id] = newQty;
    }
    localStorage.setItem('retail_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setCartQty(newQty);

    if (delta > 0) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const cleanName = (name: string) =>
    name?.replace(/\(pos import\)/gi, '').replace(/\s+/g, ' ').trim() || '';

  const rating = 4.5;
  const reviewCount = 128;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">This product may have been removed or is no longer available.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition">
            <ArrowLeft size={18} /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const displayName = cleanName(product.name);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-1 text-sm text-gray-400 flex-1 ml-4">
            <Link href="/shop" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href={`/shop/categories?category=${encodeURIComponent(product.category)}`} className="hover:text-green-600 transition-colors">{product.category}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium line-clamp-1">{displayName}</span>
          </nav>

          <Link href="/shop/cart" className="relative flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition">
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartQty > 0 && (
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">

        {/* ─── MAIN PRODUCT SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

          {/* LEFT: Product Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square flex items-center justify-center p-8">
              <img
                src={product.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                alt={displayName}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Trust badges - mobile only */}
            <div className="flex gap-3 lg:hidden">
              <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 flex flex-col items-center gap-1 text-center shadow-sm">
                <Truck size={18} className="text-green-600" />
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Free Delivery over $50</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 flex flex-col items-center gap-1 text-center shadow-sm">
                <RotateCcw size={18} className="text-green-600" />
                <span className="text-[10px] font-bold text-gray-700 leading-tight">30-Day Returns</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 flex flex-col items-center gap-1 text-center shadow-sm">
                <ShieldCheck size={18} className="text-green-600" />
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">

            {/* Category Badge */}
            <div className="mb-3">
              <Link
                href={`/shop/categories?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <Tag size={11} />
                {product.category}
              </Link>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-3">
              {displayName}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    size={16}
                    className={i <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : i - 0.5 <= rating ? 'fill-yellow-200 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-600">{rating}</span>
              <span className="text-sm text-gray-400">({reviewCount} reviews)</span>
            </div>

            {/* ─── PRICE BLOCK ─── */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-700">
                      In Stock
                      {product.stock <= 10 && product.stock > 0 && (
                        <span className="text-orange-600 ml-1">— Only {product.stock} left!</span>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-red-600">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* ─── ABOUT THIS PRODUCT ─── */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-900 mb-2">About this product</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description || `${displayName} — a quality product in the ${product.category} category. Available at our store for your everyday needs.`}
              </p>
            </div>

            {/* ─── PRODUCT DETAILS TABLE ─── */}
            <div className="mb-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700">Product Details</h3>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="flex items-center px-4 py-3 gap-4">
                  <span className="text-sm text-gray-500 w-28 flex-shrink-0">Category</span>
                  <span className="text-sm font-semibold text-gray-900">{product.category}</span>
                </div>
                {product.barcode && (
                  <div className="flex items-center px-4 py-3 gap-4">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">Barcode</span>
                    <span className="text-sm font-semibold text-gray-900 font-mono">{product.barcode}</span>
                  </div>
                )}
                <div className="flex items-center px-4 py-3 gap-4">
                  <span className="text-sm text-gray-500 w-28 flex-shrink-0">Availability</span>
                  <span className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {inStock ? `${product.stock} units in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── QUANTITY + ADD TO CART ─── */}
            {inStock ? (
              <div className="space-y-3 mb-6">
                {cartQty === 0 ? (
                  <div className="flex gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3.5 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-5 font-black text-gray-900 text-lg min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-3.5 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => updateCart(quantity)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-base transition-all shadow-lg ${
                        addedToCart
                          ? 'bg-green-500 text-white scale-95 shadow-green-200'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200 hover:shadow-xl hover:-translate-y-0.5'
                      }`}
                    >
                      {addedToCart ? (
                        <>
                          <CheckCircle size={20} />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={20} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-green-50 border-2 border-green-200 rounded-xl px-5 py-4">
                    <span className="text-sm font-bold text-green-800 flex-1">In your cart</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateCart(-1)} className="w-9 h-9 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm">
                        <Minus size={14} />
                      </button>
                      <span className="font-black text-xl text-green-800 min-w-[2rem] text-center">{cartQty}</span>
                      <button onClick={() => updateCart(1)} className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-all shadow-sm">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                      isWishlisted
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500'
                    }`}
                  >
                    <Heart size={18} className={isWishlisted ? 'fill-red-500' : ''} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: displayName, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {/* Out of Stock notice */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-red-700 font-bold">Currently Out of Stock</p>
                  <p className="text-red-500 text-sm mt-1">Check back soon for availability</p>
                </div>
                {/* Wishlist + Share always visible */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                      isWishlisted
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500'
                    }`}
                  >
                    <Heart size={18} className={isWishlisted ? 'fill-red-500' : ''} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: displayName, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* ─── TRUST BADGES (desktop) ─── */}
            <div className="hidden lg:grid grid-cols-3 gap-3 mt-2">
              <div className="flex flex-col items-center gap-2 text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <Truck size={20} className="text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-700 leading-tight">Free Delivery over $50</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <RotateCcw size={20} className="text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-700 leading-tight">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <ShieldCheck size={20} className="text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-700 leading-tight">Quality Guaranteed</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── DESCRIPTION SECTION (full width) ─── */}
        {product.description && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-12">
            <h2 className="text-xl font-black text-gray-900 mb-4">Product Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* ─── RELATED PRODUCTS ─── */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">You May Also Like</h2>
              <Link
                href={`/shop/categories?category=${encodeURIComponent(product.category)}`}
                className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                See All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/shop/product/${rel.id}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-green-100 transition-all group"
                >
                  <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={rel.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3C/svg%3E"}
                      alt={rel.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">
                      {cleanName(rel.name)}
                    </p>
                    <p className="text-lg font-black text-gray-900">${rel.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Mobile sticky bottom bar */}
      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
          <div>
            <p className="text-xs text-gray-500 font-medium line-clamp-1">{displayName}</p>
            <p className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          {cartQty === 0 ? (
            <button
              onClick={() => updateCart(1)}
              className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 justify-between">
              <button onClick={() => updateCart(-1)} className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700">
                <Minus size={14} />
              </button>
              <span className="font-black text-green-800 text-lg">{cartQty}</span>
              <button onClick={() => updateCart(1)} className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="h-24 md:h-0" /> {/* Bottom spacing for mobile sticky bar */}
    </div>
  );
}
