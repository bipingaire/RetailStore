'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Search, ShoppingBag, Star, ArrowRight, Check, Plus, Minus,
  Phone, Menu, Heart, User, ChevronDown, Clock, Zap, CheckCircle
} from 'lucide-react';
import CountdownTimer from './components/countdown-timer';
import ShopFooter from './components/shop-footer';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

// --- TYPES ---
type Product = {
  id: string;
  price: number;
  name: string;
  imageUrl: string | null;
  category: string | null;
  manufacturer: string | null;
};

// Simplified promotion type - will be replaced when campaign API is ready
type Promotion = {
  id: string;
  discount_type: 'percentage' | 'fixed_price';
  discount_value: number;
  end_date: string;
  productIds: string[];
};

type Banner = {
  id: string;
  type: 'main' | 'side';
  tag?: string;
  title: string;
  subtitle: string;
  cta: string;
  bgColor: string;
  imageUrl: string;
  link?: string;
};

const DEFAULT_BANNERS: Banner[] = [
  { id: '1', type: 'main', tag: 'Weekend Deal', title: 'Fresh Organic Vegetables', subtitle: 'Get 20% off on all seasonal farm produce this week.', cta: 'Shop Now', bgColor: '#f0f9f4', imageUrl: 'https://cdn-icons-png.flaticon.com/512/766/766023.png', link: '' },
  { id: '2', type: 'side', title: 'Premium Honey', subtitle: '100% Pure & Raw', cta: 'Buy Now', bgColor: '#fff8e5', imageUrl: 'https://cdn-icons-png.flaticon.com/512/8065/8065363.png', link: '' },
  { id: '3', type: 'side', title: 'Daily Hygiene', subtitle: 'Soaps & Sanitizers', cta: '15% OFF', bgColor: '#eef5ff', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2954/2954888.png', link: '' },
];

export default function ShopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);

  // Live promotions from backend
  const [promos, setPromos] = useState<Promotion[]>([]);

  // --- FETCH LIVE PROMOTIONS ---
  useEffect(() => {
    async function loadPromos() {
      try {
        const data = await apiClient.get('/campaigns/promotions');
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            discount_type: p.discountType,
            discount_value: Number(p.discountValue),
            end_date: p.endDate,
            productIds: p.productId ? [p.productId] : [],
          }));
          setPromos(mapped);
        }
      } catch (_) {
        // Silently ignore — no promos shown if API is unavailable
      }
    }
    async function loadCampaigns() {
      try {
        const data = await apiClient.get('/campaigns/active');
        if (Array.isArray(data)) setCampaigns(data);
      } catch (_) { /* silent */ }
    }
    loadPromos();
    loadCampaigns();

    async function loadBanners() {
      try {
        const res = await apiClient.get('/settings/shop_banners');
        if (res?.value) {
          const parsed = JSON.parse(res.value);
          if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
        }
      } catch (_) { /* use defaults */ }
    }
    loadBanners();
  }, []);


  // --- CART LOGIC ---
  useEffect(() => {
    const savedCart = localStorage.getItem('retail_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    if (isCartLoaded) localStorage.setItem('retail_cart', JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  // --- FETCH PRODUCTS FROM BACKEND ---
  useEffect(() => {
    async function loadProducts() {
      try {
        const productsData = await apiClient.get('/products?sellableOnly=true');
        const dataArray = Array.isArray(productsData) ? productsData : [];

        // Map backend response to our Product type
        const mappedProducts = dataArray.map((p: any) => ({
          id: p.id,
          price: Number(p.price) || 0,
          name: p.name,
          imageUrl: p.imageUrl || p.image, // Handle both potential keys
          category: p.category,
          manufacturer: p.manufacturer || 'Unknown'
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // --- HELPERS ---
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

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? prod.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const cleanName = (name?: string) =>
    (name || '')
      .replace(/\\(pos import\\)/gi, '')
      .replace(/\\s+/g, ' ')
      .trim();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-400 font-medium">Loading Store...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-32">

      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 group">
            <div className="bg-green-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Indu<span className="text-green-600">Mart</span></span>
          </Link>

          {/* Central Search */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Phone */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Call to Order</div>
                <div className="text-sm font-bold text-gray-900">917 325 6396</div>
              </div>
            </div>

            {/* Cart Icon */}
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
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* 2. HERO BENTO GRID */}
      {!searchTerm && (() => {
        const mainBanner = banners.find(b => b.type === 'main') || banners[0];
        const sideBanners = banners.filter(b => b.type === 'side').slice(0, 2);
        return (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">

              {/* Main Hero Banner */}
              <div className="md:col-span-2">
                <a href={mainBanner.link || '#'} className="block h-full">
                  <div className="rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group h-full" style={{ backgroundColor: mainBanner.bgColor }}>
                    <div className="relative z-10 max-w-md">
                      {mainBanner.tag && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                          {mainBanner.tag}
                        </span>
                      )}
                      <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                        {mainBanner.title}
                      </h2>
                      <p className="text-gray-600 mb-8 text-lg">{mainBanner.subtitle}</p>
                      <span className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all transform group-hover:-translate-y-1">
                        {mainBanner.cta} <ArrowRight size={16} />
                      </span>
                    </div>
                    {mainBanner.imageUrl && (
                      <img src={mainBanner.imageUrl} className="absolute -right-10 -bottom-10 w-80 opacity-20 md:opacity-100 md:w-96 md:bottom-10 md:right-10 transform group-hover:scale-110 transition-transform duration-700" alt={mainBanner.title} />
                    )}
                  </div>
                </a>
              </div>

              {/* Side Banners */}
              <div className="flex flex-col gap-6 h-full">
                {sideBanners.map(banner => (
                  <a key={banner.id} href={banner.link || '#'} className="flex-1 rounded-3xl p-6 relative overflow-hidden flex items-center group cursor-pointer hover:shadow-lg transition" style={{ backgroundColor: banner.bgColor }}>
                    <div className="relative z-10 w-2/3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{banner.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{banner.subtitle}</p>
                      <span className="text-sm font-bold text-orange-600 underline inline-flex items-center gap-1">{banner.cta} <ArrowRight size={14} /></span>
                    </div>
                    {banner.imageUrl && (
                      <img src={banner.imageUrl} className="absolute right-2 bottom-2 w-24 group-hover:rotate-12 transition-transform" alt={banner.title} />
                    )}
                  </a>
                ))}
              </div>

            </div>
          </div>
        );
      })()}

      {/* 3. CATEGORY RAIL */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <h3 className="font-bold text-lg text-gray-900 mb-6">Shop by Category</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">

          <div
            onClick={() => setSelectedCategory(null)}
            className={`flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group transition-all ${selectedCategory === null ? 'scale-110' : ''}`}
          >
            <div className={`w-20 h-20 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-green-500 group-hover:shadow-md transition-all ${selectedCategory === null ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'}`}>
              <ShoppingBag className={`w-10 h-10 transition-colors ${selectedCategory === null ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'}`} />
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedCategory === null ? 'text-green-700 font-bold' : 'text-gray-700 group-hover:text-green-600'}`}>All Products</span>
          </div>

          {availableCategories.map((cat, i) => (
            <div
              key={i}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group transition-all ${selectedCategory === cat ? 'scale-110' : ''}`}
            >
              <div className={`w-20 h-20 rounded-full bg-white border shadow-sm flex items-center justify-center group-hover:border-green-500 group-hover:shadow-md transition-all ${selectedCategory === cat ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'}`}>
                <img
                  src={`https://cdn-icons-png.flaticon.com/512/${i === 0 ? '2909/2909859' : i === 1 ? '3194/3194766' : i === 2 ? '1046/1046774' : i === 3 ? '2395/2395796' : '706/706164'}.png`}
                  className={`w-10 h-10 transition-opacity ${selectedCategory === cat ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                  alt={cat}
                />
              </div>
              <span className={`text-sm font-medium transition-colors ${selectedCategory === cat ? 'text-green-700 font-bold' : 'text-gray-700 group-hover:text-green-600'}`}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3.5 - LIVE CAMPAIGN SECTIONS */}
      {campaigns.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 space-y-10">
          {campaigns.map((campaign) => {
            const campaignProducts = (campaign.products || [])
              .map((cp: any) => cp.product)
              .filter((p: any) => p && p.isSellable);
            if (campaignProducts.length === 0) return null;
            const accent = campaign.type === 'PROMOTION' ? 'from-amber-500' : campaign.type === 'FLASH_SALE' ? 'from-red-500' : 'from-emerald-500';
            return (
              <div key={campaign.id}>
                {/* Campaign Header */}
                <div className={`bg-gradient-to-r ${accent} to-gray-900 rounded-2xl px-6 py-4 mb-4 flex items-center justify-between`}>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1 block">{campaign.type || 'CAMPAIGN'}</span>
                    <h3 className="text-xl font-black text-white">{campaign.name}</h3>
                    {campaign.endDate && (
                      <p className="text-xs text-white/70 mt-0.5">
                        Ends {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {campaignProducts.length} Items
                  </span>
                </div>

                {/* Campaign Product Row */}
                <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
                  {campaignProducts.map((prod: any) => {
                    const qty = cart[prod.id] || 0;
                    return (
                      <div key={prod.id} className="min-w-[180px] max-w-[180px] bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all flex-shrink-0">
                        <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                          <img
                            src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3C/svg%3E"}
                            className="w-full h-full object-cover"
                            alt={prod.name}
                          />
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">{prod.category || 'Product'}</div>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mb-2">{cleanName(prod.name)}</h4>
                        <div className="text-base font-black text-green-700 mb-3">${Number(prod.price).toFixed(2)}</div>
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(prod.id, 1)}
                            className="w-full bg-green-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors"
                          >Add to Cart</button>
                        ) : (
                          <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm justify-center">
                            <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500"><Minus size={10} /></button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600"><Plus size={10} /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <h3 className="font-bold text-2xl text-gray-900 mb-6">
          {searchTerm ? `Results for "${searchTerm}"` : selectedCategory || 'All Products'}
        </h3>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((prod) => {
              const qty = cart[prod.id] || 0;
              return (
                <div key={prod.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-100 hover:shadow-lg transition-all">

                  <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      className="w-full h-full object-cover"
                      alt={prod.name}
                    />
                  </div>

                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                    {prod.category || 'Product'}
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5em] mb-2">
                    {cleanName(prod.name)}
                  </h4>

                  <div className="text-lg font-black text-green-700 mb-4">
                    ${prod.price.toFixed(2)}
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={() => updateQty(prod.id, 1)}
                      className="w-full bg-green-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm">
                      <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{qty}</span>
                      <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600">
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {totalItems > 0 && (
        <Link href="/shop/cart" className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all z-50 md:hidden">
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
        </Link>
      )}

      {/* FOOTER */}
      <ShopFooter />
    </div>
  );
}
