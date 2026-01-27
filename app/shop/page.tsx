'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ShoppingBag, Heart, ArrowRight, Package, Croissant, Coffee, Candy, Beef, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  inventory_id: string;
  product_id: string;
  product_name: string;
  brand_name?: string;
  category?: string;
  image_url?: string;
  price: number;
  stock: number;
  in_stock: boolean;
};

// Category Mock Data (for UI matching - ensuring icons match reference)
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: ShoppingBag },
  { id: 'bakery', name: 'Bakery', icon: Croissant },
  { id: 'beverages', name: 'Beverages', icon: Coffee },
  { id: 'confectionery', name: 'Confectionery', icon: Candy },
  { id: 'food', name: 'Food & Beverage', icon: Beef },
  { id: 'snacks', name: 'Snacks', icon: UtensilsCrossed },
];

export default function ShopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const productsData = await apiClient.request('/api/shop/products', {});
        setProducts(productsData);
      } catch (err: any) {
        console.error('Error loading shop data:', err);
        // Don't show toast on initial load error to avoid clutter
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="pb-32">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">

          {/* Main Banner */}
          <div className="lg:col-span-2 relative bg-[#F0FDF4] rounded-3xl overflow-hidden p-8 lg:p-12 flex flex-col justify-center">
            <span className="inline-block bg-[#EF4444] text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
              WEEKEND DEAL
            </span>
            <h2 className="text-4xl lg:text-6xl font-black text-[#0F172A] leading-tight mb-4">
              Fresh Organic <br />
              <span className="text-[#16A34A]">Vegetables</span>
            </h2>
            <p className="text-gray-500 mb-8 text-lg max-w-md">
              Get 20% off on all seasonal farm produce this week.
            </p>
            <button className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3 px-8 rounded-full w-fit flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-green-600/20">
              Shop Now <ArrowRight size={18} />
            </button>

            {/* Decorative Emoji Placeholder (simulates image) */}
            <div className="absolute right-[-20px] bottom-[-40px] w-[300px] h-[300px] lg:w-[450px] lg:h-[450px]">
              <div className="w-full h-full flex items-center justify-center text-[200px] lg:text-[300px] drop-shadow-2xl filter saturate-150 animate-fade-in">
                🍒
              </div>
            </div>
          </div>

          {/* Right Column Banners */}
          <div className="flex flex-col gap-6 h-full">

            {/* Top Right */}
            <div className="flex-1 bg-[#FFFBEB] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Honey</h3>
              <p className="text-gray-500 text-sm mb-4">100% Pure & Raw</p>
              <button className="text-[#D97706] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Buy Now <ArrowRight size={14} />
              </button>
              <div className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-[80px] opacity-90">
                🍯
              </div>
            </div>

            {/* Bottom Right */}
            <div className="flex-1 bg-[#EFF6FF] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Daily Hygiene</h3>
              <p className="text-gray-500 text-sm mb-4">Soaps & Sanitizers</p>
              <span className="bg-[#3B82F6] text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
                15% OFF
              </span>
              <div className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-[80px] opacity-90">
                🧼
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
        <h3 className="text-xl font-bold text-gray-900 mb-8">Shop by Category</h3>
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex flex-col items-center gap-3 group min-w-[100px]"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-300
                ${selectedCategory === cat.id
                  ? 'border-[#16A34A] bg-green-50 text-green-600 scale-110 shadow-lg shadow-green-100'
                  : 'border-white bg-white hover:border-gray-200 hover:shadow-md'
                }`}>
                <cat.icon size={28} strokeWidth={1.5} />
              </div>
              <span className={`text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'text-[#16A34A]' : 'text-gray-600'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Featured Products</h3>
          <div className="flex gap-4 text-sm font-medium text-gray-500 hidden sm:flex">
            <button className="text-gray-900 font-bold">All</button>
            <button className="hover:text-gray-900 hover:font-bold transition-all">Best Sellers</button>
            <button className="hover:text-gray-900 hover:font-bold transition-all">New Arrivals</button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.inventory_id} className="group bg-white rounded-2xl border border-gray-100 hover:border-green-100 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 p-4 relative">
                {/* Out Of Stock Badge */}
                {product.stock === 0 && (
                  <span className="absolute top-4 left-4 z-10 bg-[#DC2626] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    OUT OF STOCK
                  </span>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-colors">
                  <Heart size={16} />
                </button>

                {/* Image Area */}
                <div className="aspect-[4/5] bg-gray-50 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.product_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <Package size={48} className="text-gray-200" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {product.category || 'Groceries'}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                    {product.product_name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-gray-900 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
