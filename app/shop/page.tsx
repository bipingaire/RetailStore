'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Search, ShoppingBag, Star, ArrowRight, Check, Plus, Minus,
  Phone, Menu, Heart, User, ChevronDown, Clock, Zap, CheckCircle, Home, LayoutGrid
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
  salesCount: number;
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
  const [campaignPosters, setCampaignPosters] = useState<Record<string, string>>({});
  // Pagination: show 4 rows × 5 cols = 20 products per page
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
        if (Array.isArray(data)) {
          setCampaigns(data);
          // Load posters for each active campaign
          const posters: Record<string, string> = {};
          await Promise.all(data.map(async (c: any) => {
            try {
              const res = await apiClient.get(`/settings/campaign_poster_${c.id}`);
              if (res?.value) posters[c.id] = res.value;
            } catch { /* no poster for this campaign */ }
          }));
          setCampaignPosters(posters);
        }
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

        const normalizeCategory = (cat: string | null) => {
          if (!cat) return null;
          return cat.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        };

        // Map backend response to our Product type
        const mappedProducts = dataArray.map((p: any) => ({
          id: p.id,
          price: Number(p.price) || 0,
          name: p.name,
          imageUrl: p.imageUrl || p.image, // Handle both potential keys
          category: normalizeCategory(p.category),
          manufacturer: p.manufacturer || 'Unknown',
          salesCount: Number(p.salesCount) || 0
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

  // Reset visible count whenever filter or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchTerm]);

  const availableCategories = useMemo(() => {
    const catSales = new Map<string, number>();
    products.forEach((p) => {
      if (p.category) {
        catSales.set(p.category, (catSales.get(p.category) || 0) + p.salesCount);
      }
    });
    // Sort categories by total sales descending
    return Array.from(catSales.keys()).sort((a, b) => (catSales.get(b) || 0) - (catSales.get(a) || 0));
  }, [products]);

  const top5Categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);
  }, [products]);

  const top12PopularProducts = useMemo(() => {
    return [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 12);
  }, [products]);

  const categoryImages = useMemo(() => {
    const images = new Map<string, string>();
    // Sort products by sales descending so the top-selling product's image is used
    const sortedProducts = [...products].sort((a, b) => b.salesCount - a.salesCount);
    for (const p of sortedProducts) {
      if (p.category && p.imageUrl && !images.has(p.category)) {
        images.set(p.category, p.imageUrl);
      }
    }
    return images;
  }, [products]);

  const cleanName = (name?: string) =>
    (name || '')
      .replace(/\\(pos import\\)/gi, '')
      .replace(/\\s+/g, ' ')
      .trim();

  // --- MOBILE UI HELPERS ---
  const getCategoryEmoji = (cat: string): string => {
    const c = cat.toLowerCase();
    if (c.includes('dairy') || c.includes('milk') || c.includes('cheese')) return '🥛';
    if (c.includes('meat') || c.includes('beef') || c.includes('chicken') || c.includes('pork')) return '🥩';
    if (c.includes('veggie') || c.includes('vegetable') || c.includes('produce')) return '🥦';
    if (c.includes('fruit') || c.includes('berry')) return '🍎';
    if (c.includes('snack') || c.includes('chip') || c.includes('cracker')) return '🍪';
    if (c.includes('bever') || c.includes('drink') || c.includes('juice') || c.includes('soda')) return '🥤';
    if (c.includes('frozen')) return '🧊';
    if (c.includes('bread') || c.includes('bak') || c.includes('pastry')) return '🥖';
    if (c.includes('clean') || c.includes('wash') || c.includes('household') || c.includes('detergent')) return '🧹';
    if (c.includes('health') || c.includes('medic') || c.includes('vitamin')) return '💊';
    if (c.includes('personal') || c.includes('hygiene') || c.includes('care') || c.includes('soap')) return '🧴';
    if (c.includes('candy') || c.includes('sweet') || c.includes('chocolate')) return '🍬';
    if (c.includes('baby') || c.includes('infant')) return '👶';
    if (c.includes('pet')) return '🐾';
    if (c.includes('grain') || c.includes('rice') || c.includes('pasta') || c.includes('cereal')) return '🌾';
    if (c.includes('spice') || c.includes('sauce') || c.includes('condiment')) return '🧂';
    return '📦';
  };
  const catBgColors = ['#FFE5D0','#D4EDDA','#D1ECF1','#FCE4EC','#EDE7F6','#FFF3E0','#E8F5E9','#E3F2FD','#FFF8E1','#F3E5F5'];
  const getPromoForProduct = (productId: string) => promos.find(p => p.productIds.includes(productId)) || null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-400 font-medium">Loading Store...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20 md:pb-32">

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
              <div className="md:col-span-2 relative">
                <a href={mainBanner.link || '#'} className="block h-full min-h-[320px] md:min-h-0">
                  <div className="rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group h-full" style={{ backgroundColor: mainBanner.bgColor }}>
                    <div className="relative z-10 max-w-sm md:max-w-md">
                      {mainBanner.tag && (
                        <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 rounded-full uppercase tracking-wider mb-3 md:mb-4 inline-block">
                          {mainBanner.tag}
                        </span>
                      )}
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 md:mb-4 leading-tight">
                        {mainBanner.title}
                      </h2>
                      <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">{mainBanner.subtitle}</p>
                      <span className="inline-flex items-center gap-2 bg-green-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all transform group-hover:-translate-y-1 text-sm md:text-base">
                        {mainBanner.cta} <ArrowRight size={16} />
                      </span>
                    </div>
                    {mainBanner.imageUrl && (
                      <img src={mainBanner.imageUrl} className="absolute -right-6 -bottom-6 w-52 md:w-80 lg:w-96 opacity-30 md:opacity-100 md:bottom-10 md:right-10 transform group-hover:scale-110 transition-transform duration-700" alt={mainBanner.title} />
                    )}
                  </div>
                </a>
              </div>

              {/* Side Banners */}
              <div className="flex flex-col gap-6 h-full">
                {sideBanners.map(banner => (
                  <a key={banner.id} href={banner.link || '#'} className="flex-1 min-h-[140px] md:min-h-0 rounded-3xl p-5 md:p-6 relative overflow-hidden flex items-center group cursor-pointer hover:shadow-lg transition" style={{ backgroundColor: banner.bgColor }}>
                    <div className="relative z-10 w-2/3 sm:w-3/4 md:w-2/3">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2 leading-tight">{banner.title}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">{banner.subtitle}</p>
                      <span className="text-xs md:text-sm font-bold text-orange-600 underline inline-flex items-center gap-1">{banner.cta} <ArrowRight size={14} /></span>
                    </div>
                    {banner.imageUrl && (
                      <img src={banner.imageUrl} className="absolute -right-2 -bottom-2 md:right-2 md:bottom-2 w-20 md:w-24 lg:w-28 opacity-80 md:opacity-100 group-hover:rotate-12 transition-transform" alt={banner.title} />
                    )}
                  </a>
                ))}
              </div>

            </div>
          </div>
        );
      })()}

      {/* 3.5 - LIVE CAMPAIGN SECTIONS (Moved above Categories) */}
      {campaigns.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 space-y-10">
          {campaigns.map((campaign) => {
            // Filter out expired campaigns automatically
            if (campaign.endDate && new Date(campaign.endDate) < new Date()) {
              return null;
            }

            const campaignProducts = (campaign.products || []).map((cp: any) => cp.product).filter(Boolean);
            const accent = campaign.type === 'PROMOTION' ? 'from-amber-500' : campaign.type === 'FLASH_SALE' ? 'from-red-500' : 'from-emerald-500';
            const poster = campaignPosters[campaign.id];
            return (
              <div key={campaign.id} className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                {/* AI Poster (if published) */}
                {poster && (
                  <div className="w-full h-48 md:h-64 overflow-hidden">
                    <img src={poster} alt={campaign.name} className="w-full h-full object-cover" />
                  </div>
                )}
                {/* Campaign Header */}
                <div className={`bg-gradient-to-r ${accent} to-gray-900 px-6 py-4 flex items-center justify-between`}>
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
                <div className="p-4">
                  <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
                    {campaignProducts.map((prod: any) => {
                      const qty = cart[prod.id] || 0;
                      return (
                        <div key={prod.id} className="min-w-[140px] md:min-w-[180px] max-w-[140px] md:max-w-[180px] bg-gray-50 rounded-2xl p-3 md:p-4 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all flex-shrink-0 flex flex-col justify-between">
                          <div>
                            <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                            <img
                              src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3C/svg%3E"}
                              className="w-full h-full object-cover"
                              alt={prod.name}
                            />
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 line-clamp-1">{prod.category || 'Product'}</div>
                          <h4 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5em]">{cleanName(prod.name)}</h4>
                          <div className="text-sm md:text-base font-black text-green-700 mb-3">${Number(prod.price).toFixed(2)}</div>
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. CATEGORIES SECTION */}
      {!searchTerm && !selectedCategory && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Shop by Category</h2>
              <p className="text-sm text-gray-400 mt-0.5">Browse all product categories</p>
            </div>
            <Link
              href="/shop/categories"
              className="flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full transition-all"
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
            {availableCategories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex flex-col items-center gap-2 group outline-none"
              >
                <div
                  className="w-full aspect-square rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all overflow-hidden p-2 border border-gray-100"
                  style={{ backgroundColor: catBgColors[i % catBgColors.length] }}
                >
                  {categoryImages.get(cat) ? (
                    <img src={categoryImages.get(cat)!} alt={cat} className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply" />
                  ) : (
                    <span className="text-3xl md:text-4xl">{getCategoryEmoji(cat)}</span>
                  )}
                </div>
                <span className="text-[11px] md:text-xs font-semibold text-gray-700 text-center leading-tight w-full truncate px-1">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. TOP 12 MOST POPULAR PRODUCTS */}
      {!searchTerm && !selectedCategory && top12PopularProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
                <img src="/images/trending-stamp.png" alt="Trending" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                Trending Now
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Top 12 most popular products right now</p>
            </div>
            <Link
              href="/shop/categories"
              className="flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full transition-all"
            >
              Shop All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
            {top12PopularProducts.map((prod) => {
              const qty = cart[prod.id] || 0;
              const promo = getPromoForProduct(prod.id);
              return (
                <div key={prod.id} className="min-w-[160px] max-w-[160px] md:min-w-[200px] md:max-w-[200px] bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all flex flex-col flex-shrink-0 overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-2">
                    {promo && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded z-10">
                        {promo.discount_type === 'percentage' ? `SAVE ${Math.round(promo.discount_value)}%` : `SAVE $${promo.discount_value.toFixed(0)}`}
                      </div>
                    )}
                    <img src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"} className="w-full h-full object-contain" alt={prod.name} />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">{prod.category || 'Product'}</div>
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 flex-1 mb-2">{cleanName(prod.name)}</h4>
                    <div className="text-base font-black text-green-700 mb-3">${prod.price.toFixed(2)}</div>
                    {qty === 0 ? (
                      <button onClick={() => updateQty(prod.id, 1)} className="w-full bg-green-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors">
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm justify-center">
                        <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500"><Minus size={10} /></button>
                        <span className="text-xs font-bold w-4 text-center">{qty}</span>
                        <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600"><Plus size={10} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. FEATURED PRODUCTS */}
      {!searchTerm && !selectedCategory && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
                <img src="/images/trending-stamp.png" alt="Featured" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                Featured Products
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Handpicked items just for you</p>
            </div>
            <Link
              href="/shop/categories"
              className="flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full transition-all"
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
            {products.filter(p => p.imageUrl).slice(0, 10).map((prod) => {
              const qty = cart[prod.id] || 0;
              const promo = getPromoForProduct(prod.id);
              return (
                <div key={prod.id} className="min-w-[160px] max-w-[160px] md:min-w-[200px] md:max-w-[200px] bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all flex flex-col flex-shrink-0 overflow-hidden">
                  <div className="relative aspect-square bg-gray-50">
                    {promo && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded z-10">
                        {promo.discount_type === 'percentage' ? `SAVE ${Math.round(promo.discount_value)}%` : `SAVE $${promo.discount_value.toFixed(0)}`}
                      </div>
                    )}
                    <img src={prod.imageUrl!} className="w-full h-full object-cover" alt={prod.name} />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">{prod.category || 'Product'}</div>
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 flex-1 mb-2">{cleanName(prod.name)}</h4>
                    <div className="text-base font-black text-green-700 mb-3">${prod.price.toFixed(2)}</div>
                    {qty === 0 ? (
                      <button onClick={() => updateQty(prod.id, 1)} className="w-full bg-green-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors">
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm justify-center">
                        <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500"><Minus size={10} /></button>
                        <span className="text-xs font-bold w-4 text-center">{qty}</span>
                        <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600"><Plus size={10} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. POPULAR BY CATEGORY — one horizontal row per category, sorted by category sales */}
      {!searchTerm && !selectedCategory && availableCategories.map((cat) => {
        // Get products for category, sort by sales, take top 6
        const catProducts = products
          .filter(p => p.category === cat)
          .sort((a, b) => b.salesCount - a.salesCount);

        if (catProducts.length === 0) return null;
        return (
          <div key={cat} className="max-w-7xl mx-auto px-4 lg:px-8 mt-10">
            {/* Category section divider */}
            <div className="flex items-center justify-between py-3 border-b-2 border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                {categoryImages.get(cat) ? (
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 p-1">
                    <img src={categoryImages.get(cat)!} alt={cat} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
                  </div>
                ) : (
                  <span className="text-2xl">{getCategoryEmoji(cat)}</span>
                )}
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900 leading-tight">{cat}</h2>
                  <p className="text-xs text-gray-400">{catProducts.length} products available</p>
                </div>
              </div>
              <Link
                href={`/shop/categories?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 hover:underline transition-all"
              >
                See all {catProducts.length} items <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-1 px-1">
              {catProducts.slice(0, 6).map((prod) => {
                const qty = cart[prod.id] || 0;
                const promo = getPromoForProduct(prod.id);
                return (
                  <div key={prod.id} className="min-w-[160px] max-w-[160px] md:min-w-[190px] md:max-w-[190px] bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all flex flex-col flex-shrink-0 overflow-hidden group">
                    <div className="relative bg-gray-50" style={{paddingBottom:'100%'}}>
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        {promo && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-[9px] font-black px-1.5 py-0.5 rounded-sm z-10 uppercase tracking-wide">
                            {promo.discount_type === 'percentage' ? `Save ${Math.round(promo.discount_value)}%` : `Save $${promo.discount_value.toFixed(0)}`}
                          </div>
                        )}
                        <img
                          src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          alt={prod.name}
                        />
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-1 border-t border-gray-100">
                      <h4 className="text-xs text-gray-800 line-clamp-2 flex-1 mb-2 leading-snug">{cleanName(prod.name)}</h4>
                      <div className="mb-2">
                        <span className="text-base font-black text-gray-900">${prod.price.toFixed(2)}</span>
                      </div>
                      {qty === 0 ? (
                        <button onClick={() => updateQty(prod.id, 1)} className="w-full bg-green-600 text-white font-bold py-1.5 rounded-full text-[11px] hover:bg-green-700 transition-colors shadow-sm">
                          Add to cart
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2 py-1 justify-center">
                          <button onClick={() => updateQty(prod.id, -1)} className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"><Minus size={10} /></button>
                          <span className="text-xs font-bold w-5 text-center text-green-800">{qty}</span>
                          <button onClick={() => updateQty(prod.id, 1)} className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"><Plus size={10} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* See All Card at end of row */}
              {catProducts.length > 12 && (
                <Link
                  href={`/shop/categories?category=${encodeURIComponent(cat)}`}
                  className="min-w-[160px] md:min-w-[190px] flex-shrink-0 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-300 hover:bg-green-50 transition-all group p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <ArrowRight className="text-green-600" size={20} />
                  </div>
                  <span className="text-xs font-bold text-green-600 text-center">See all {catProducts.length} items</span>
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {/* 6. SEARCH / CATEGORY FILTERED VIEW */}
      {(searchTerm || selectedCategory) && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">
                {searchTerm ? `Results for "${searchTerm}"` : `${getCategoryEmoji(selectedCategory!)} ${selectedCategory}`}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">{filteredProducts.length} products found</p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-gray-500 hover:text-red-500 font-semibold bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Desktop category pill row */}
          {!searchTerm && (
            <div className="hidden md:flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === null ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
              >
                All
              </button>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
                >
                  {getCategoryEmoji(cat)} {cat}
                </button>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredProducts.slice(0, visibleCount).map((prod) => {
                  const qty = cart[prod.id] || 0;
                  const promo = getPromoForProduct(prod.id);
                  return (
                    <div key={prod.id} className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100 hover:border-green-100 hover:shadow-lg transition-all flex flex-col justify-between">
                      <div className="flex-1 flex flex-col">
                        <div className="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                          {promo && (
                            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded z-10">
                              {promo.discount_type === 'percentage' ? `SAVE ${Math.round(promo.discount_value)}%` : `SAVE $${promo.discount_value.toFixed(0)}`}
                            </div>
                          )}
                          <img
                            src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                            className="w-full h-full object-cover" alt={prod.name}
                          />
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">{prod.category || 'Product'}</div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5em] mb-2">{cleanName(prod.name)}</h4>
                        <div className="text-lg font-black text-green-700 mb-4">${prod.price.toFixed(2)}</div>
                      </div>
                      <div className="mt-auto">
                        {qty === 0 ? (
                          <button onClick={() => updateQty(prod.id, 1)} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm">
                            <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500"><Minus size={12} /></button>
                            <span className="text-xs font-bold w-5 text-center">{qty}</span>
                            <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600"><Plus size={12} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="flex flex-col items-center mt-10 gap-2">
                  <p className="text-sm text-gray-400 font-medium">
                    Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                  <button
                    onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    className="flex items-center gap-2 bg-green-600 text-white font-bold px-10 py-3 rounded-full hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-200"
                  >
                    Load More <ChevronDown size={18} />
                  </button>
                </div>
              )}

              {visibleCount >= filteredProducts.length && filteredProducts.length > PAGE_SIZE && (
                <div className="flex items-center justify-center mt-10 gap-2 text-sm text-gray-400 font-medium">
                  <CheckCircle size={16} className="text-green-500" />
                  All {filteredProducts.length} products loaded
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* MOBILE: Fixed Bottom Navigation (Daraz-style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex items-center justify-around py-1.5 z-50 md:hidden">
        <button
          onClick={() => { setSelectedCategory(null); setSearchTerm(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-green-600 transition-colors"
        >
          <Home size={22} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <Link
          href="/shop/categories"
          className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-green-600 transition-colors"
        >
          <LayoutGrid size={22} />
          <span className="text-[10px] font-semibold">Categories</span>
        </Link>

        <Link href="/shop/cart" className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-green-600 transition-colors relative">
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-2 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
          <span className="text-[10px] font-semibold">Cart</span>
        </Link>

        <Link href="/shop/account" className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-green-600 transition-colors">
          <User size={22} />
          <span className="text-[10px] font-semibold">Account</span>
        </Link>
      </nav>

      {/* FOOTER */}
      <ShopFooter />
    </div>
  );
}
