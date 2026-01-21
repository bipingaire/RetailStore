'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Search, ShoppingBag, Plus, Minus, Package, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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

export default function ShopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('retail_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isCartLoaded) localStorage.setItem('retail_cart', JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  // Fetch products and categories
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch products from FastAPI
        const productsData = await apiClient.request('/api/shop/products', {});
        setProducts(productsData);

        // Fetch categories
        const categoriesData = await apiClient.request('/api/shop/categories', {});
        setCategories(categoriesData.map((c: any) => c.name));
      } catch (err: any) {
        console.error('Error loading shop data:', err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const newQty = Math.max(0, current + delta);
      const copy = { ...prev };
      if (newQty === 0) delete copy[id];
      else copy[id] = newQty;
      return copy;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? prod.category === selectedCategory : true;
    return matchesSearch && matchesCategory && prod.in_stock;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-400 font-medium ml-4">Loading Store...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">
          <Link href="/shop" className="flex items-center gap-2 group">
            <div className="bg-green-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Retail<span className="text-green-600">Store</span>
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-gray-100 border-none rounded-full py-3 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 transition">
              <Search size={18} />
            </button>
          </div>

          {/* Cart */}
          <Link href="/shop/cart" className="relative group">
            <div className="w-12 h-12 bg-green-50 text-green-700 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Shop by Category</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === null
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const qty = cart[product.inventory_id] || 0;
            return (
              <div key={product.inventory_id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition">
                <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} className="w-full h-full object-cover" alt={product.product_name} />
                  ) : (
                    <Package size={48} className="text-gray-300" />
                  )}
                </div>
                <div className="text-xs text-gray-400 uppercase font-bold mb-1">{product.category || 'Product'}</div>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5em] mb-2">{product.product_name}</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-black text-green-600">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">{product.stock} in stock</span>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => updateQty(product.inventory_id, 1)}
                    className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 transition"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-white border-2 border-green-200 rounded-full px-2 py-1">
                    <button onClick={() => updateQty(product.inventory_id, -1)} className="p-1 text-gray-500 hover:text-red-500">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{qty}</span>
                    <button onClick={() => updateQty(product.inventory_id, 1)} className="p-1 text-gray-500 hover:text-green-600">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
