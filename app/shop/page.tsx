'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Search, ShoppingBag, Star, ArrowRight, Check, Plus, Minus,
  Phone, Menu, Heart, User, ChevronDown, Clock, Zap
} from 'lucide-react';
import CountdownTimer from './components/countdown-timer';
import Link from 'next/link';

// --- TYPES ---
type Product = {
  id: string;
  price: number;
  global_products: {
    name: string;
    image_url: string;
    category: string;
    manufacturer: string;
  };
};

type InventoryItem = {
  price: number;
  global_products: {
    name: string;
    image_url: string;
    upc_ean: string;
  };
};

type Promotion = {
  id: string;
  discount_type: 'percentage' | 'fixed_price';
  discount_value: number;
  end_date: string;
  fulfillment_restriction: 'all' | 'store_only';
  store_inventory: InventoryItem | InventoryItem[];
};

type Segment = {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  badge_label?: string;
  badge_color?: string;
  tagline?: string;
  segment_type?: string;
  sort_order?: number;
  is_promoted?: boolean;
  promotion_ends_at?: string;
  discount_percentage?: number;
  featured_on_website?: boolean;
  segment_products: {
    highlight_label?: string;
    store_inventory: Product | null;
  }[];
};

export default function ShopHome() {

  const [promos, setPromos] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);

  // --- AUTHENTICATION CHECK ---
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);

  // --- DATA LOADING & CART LOGIC (Kept same as before) ---
  useEffect(() => {
    const savedCart = localStorage.getItem('retail_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    setIsCartLoaded(true);

    // Check for pending cart item from redirect
    const pendingItem = sessionStorage.getItem('pending_cart_item');
    if (pendingItem && user) {
      const productId = pendingItem;
      setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
      sessionStorage.removeItem('pending_cart_item');
      // Redirect to cart after adding
      setTimeout(() => {
        window.location.href = '/shop/cart';
      }, 500);
    }
  }, [user]);

  useEffect(() => {
    if (isCartLoaded) localStorage.setItem('retail_cart', JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Campaigns (replaces product_segments AND promotions)
      const { data: campaignData, error: campaignError } = await supabase
        .from('marketing-campaign-master')
        .select(`
          "campaign-id":id,
          "campaign-slug":slug,
          "title-text":title,
          "subtitle-text":subtitle,
          "badge-label":badge_label,
          "badge-color":badge_color,
          "tagline-text":tagline,
          "campaign-type":segment_type,
          "sort-order":sort_order,
          "is-promoted":is_promoted,
          "promotion-ends-at":promotion_ends_at,
          "discount-percentage":discount_percentage,
          "featured-on-website":featured_on_website,
          segment_products:"campaign-product-segment-group"!"campaign-id" (
             store_inventory:"retail-store-inventory-item"!"inventory-id" (
                "inventory-id":id,
                "selling-price-amount":price,
                global_products:"global-product-master-catalog"!"global-product-id" (
                   "product-name":name,
                   "image-url":image_url,
                   "category-name":category,
                   "manufacturer-name":manufacturer,
                   "upc-ean-code":upc_ean
                )
             )
          )
        `)
        .eq('is-active-flag', true)
        .order('sort-order', { ascending: true });

      if (campaignError) console.error("Campaign load error:", campaignError);

      // 2. Fetch General Inventory (for featured products grid)
      const { data: prodData, error: prodError } = await supabase
        .from('retail-store-inventory-item')
        .select(`
          "inventory-id":id,
          "selling-price-amount":price,
          global_products:"global-product-master-catalog"!"global-product-id" (
            "product-name":name,
            "image-url":image_url,
            "category-name":category,
            "manufacturer-name":manufacturer
          )
        `)
        .eq('is-active-flag', true)
        .limit(50);

      if (prodError) console.error("Inventory load error:", prodError);

      // 3. POS Pricing overrides (optional)
      let posPriceMap: Record<string, number> = {};
      const productIds = (prodData as any[] | null)?.map((p) => p.id).filter(Boolean) || [];
      // Note: pos_mappings table might also need schema check, assuming it exists for now or skipping
      // Skipping complicated POS mapping check to focus on core schema fix first

      // 4. Normalize Campaigns to Segments
      const normalizedSegments = (campaignData as any[] | null)?.map((seg) => ({
        ...seg,
        // Map snake_case to camelCase if needed, but we aliased in select
        // Handle segment_products structure
        segment_products: seg.segment_products?.map((sp: any) => ({
          ...sp,
          store_inventory: sp.store_inventory ? {
            ...sp.store_inventory,
            price: Number(sp.store_inventory.price ?? 0)
          } : null
        })) || []
      })) || [];

      // 5. Derive "Promotions" from Promoted Campaigns for "Deal of the Week" section
      // We map the promoted campaigns into the 'Promotion' shape expected by the UI
      const derivedPromos: Promotion[] = normalizedSegments
        .filter(s => s.is_promoted && s.segment_products.length > 0)
        .map(s => ({
          id: s.id,
          discount_type: 'percentage', // Schema uses percentage
          discount_value: s.discount_percentage || 20, // Default 20% if missing
          end_date: s.promotion_ends_at || new Date(Date.now() + 86400000 * 7).toISOString(),
          fulfillment_restriction: 'all',
          store_inventory: s.segment_products.map((sp: any) => sp.store_inventory).filter(Boolean)
        }));

      const normalizedProducts = (prodData as any[] | null)?.map((p) => ({
        ...p,
        price: Number(p.price ?? 0)
      })) || [];

      setPromos(derivedPromos);
      setSegments(normalizedSegments);
      setProducts(normalizedProducts);
      setLoading(false);
    }
    loadData();
  }, []);

  // --- HELPERS ---
  const getInventoryItem = (p: Promotion): (InventoryItem & { id?: string }) => {
    return Array.isArray(p.store_inventory) ? p.store_inventory[0] : p.store_inventory;
  };

  const getDealPrice = (p: Promotion) => {
    const item = getInventoryItem(p);
    const original = item?.price || 0;
    if (p.discount_type === 'fixed_price') return p.discount_value.toFixed(2);
    return (original - (original * (p.discount_value / 100))).toFixed(2);
  };

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
  const estimatedTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find(p => p.id === id);
    if (prod) return sum + (prod.price * qty);
    return sum;
  }, 0);

  const filteredProducts = products.filter((prod: any) => {
    const prodItem = Array.isArray(prod) ? prod[0] : prod;
    return prodItem?.global_products?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const promoLookup = useMemo(() => {
    const map: Record<string, Promotion> = {};
    promos.forEach((p) => {
      const item = getInventoryItem(p);
      if (item?.id) map[item.id] = p;
    });
    return map;
  }, [promos]);

  const getPromoAdjustedPrice = (price: number, promo?: Promotion) => {
    if (!promo) return price;
    if (promo.discount_type === 'fixed_price') return promo.discount_value;
    return price - price * (promo.discount_value / 100);
  };

  const cleanName = (name?: string) =>
    (name || '')
      .replace(/\(pos import\)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  const segmentAnchorMap = useMemo(() => {
    const map: Record<string, string> = {};
    segments.forEach((seg) => {
      const key = seg.slug || seg.id;
      map[key] = `#segment-${key}`;
    });
    return map;
  }, [segments]);

  const segmentDefaultAnchor =
    segmentAnchorMap['flash-sale'] ||
    segmentAnchorMap['ending-soon'] ||
    segmentAnchorMap['festive-picks'] ||
    segmentAnchorMap['mondays-only'] ||
    '#segments';

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
            {/* Phone (Requested Feature) */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Call to Order</div>
                <div className="text-sm font-bold text-gray-900">917 325 6396</div>
              </div>
            </div>

            {/* Cart Icon (kept dynamic, no label text) */}
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

        {/* Mobile Search Bar (Visible only on small screens) */}
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
      {!searchTerm && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">

            {/* Main Hero Banner */}
            <Link href={segmentDefaultAnchor} className="md:col-span-2">
              <div className="bg-[#f0f9f4] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group h-full">
                <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                <div className="relative z-10 max-w-md">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Weekend Deal
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                    Fresh Organic <br /><span className="text-green-600">Vegetables</span>
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">Get 20% off on all seasonal farm produce this week.</p>
                  <span className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 transition-all transform group-hover:-translate-y-1">
                    Shop Now <ArrowRight size={16} />
                  </span>
                </div>
                {/* Decorative Image */}
                <img src="https://cdn-icons-png.flaticon.com/512/766/766023.png" className="absolute -right-10 -bottom-10 w-80 opacity-20 md:opacity-100 md:w-96 md:bottom-10 md:right-10 transform group-hover:scale-110 transition-transform duration-700" alt="Veg" />
              </div>
            </Link>

            {/* Side Banners (The "Big Clips") */}
            <div className="flex flex-col gap-6 h-full">

              {/* Top Side Banner */}
              <Link href={segmentAnchorMap['festive-picks'] || segmentDefaultAnchor} className="flex-1">
                <div className="bg-[#fff8e5] rounded-3xl p-6 relative overflow-hidden flex items-center group cursor-pointer hover:shadow-lg transition h-full">
                  <div className="relative z-10 w-2/3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Honey</h3>
                    <p className="text-sm text-gray-600 mb-3">100% Pure & Raw</p>
                    <span className="text-sm font-bold text-orange-600 underline inline-flex items-center gap-1">Buy Now <ArrowRight size={14} /></span>
                  </div>
                  <img src="https://cdn-icons-png.flaticon.com/512/8065/8065363.png" className="absolute right-2 bottom-2 w-24 group-hover:rotate-12 transition-transform" />
                </div>
              </Link>

              {/* Bottom Side Banner */}
              <Link href={segmentAnchorMap['ending-soon'] || segmentDefaultAnchor} className="flex-1">
                <div className="bg-[#eef5ff] rounded-3xl p-6 relative overflow-hidden flex items-center group cursor-pointer hover:shadow-lg transition h-full">
                  <div className="relative z-10 w-2/3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Hygiene</h3>
                    <p className="text-sm text-gray-600 mb-3">Soaps & Sanitizers</p>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold inline-flex items-center gap-1">15% OFF <ArrowRight size={12} /></span>
                  </div>
                  <img src="https://cdn-icons-png.flaticon.com/512/2954/2954888.png" className="absolute right-2 bottom-2 w-24 group-hover:scale-110 transition-transform" />
                </div>
              </Link>

            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY RAIL */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
        <h3 className="font-bold text-lg text-gray-900 mb-6">Shop by Category</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {['Vegetables', 'Fruits', 'Meat', 'Fish', 'Beverages', 'Snacks', 'Pet Care', 'Bakery', 'Dairy'].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group">
              <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-green-500 group-hover:shadow-md transition-all">
                {/* Placeholder Icons based on index to vary visuals */}
                <img
                  src={`https://cdn-icons-png.flaticon.com/512/${i === 0 ? '2909/2909859' : i === 1 ? '3194/3194766' : i === 2 ? '1046/1046774' : i === 3 ? '2395/2395796' : '706/706164'
                    }.png`}
                  className="w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity"
                  alt={cat}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3.25 FEATURED DEALS FROM CAMPAIGNS (NEW) */}
      {!searchTerm && (() => {
        // Get promoted campaigns
        const promotedSegments = segments.filter(seg => seg.is_promoted || seg.featured_on_website);
        if (promotedSegments.length === 0) return null;

        return (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full -mr-32 -mt-32 opacity-30"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-3">
                      <Zap size={18} className="fill-white" />
                      Featured Deals
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">
                      {promotedSegments[0]?.title || 'Special Campaign'}
                    </h2>
                    {promotedSegments[0]?.subtitle && (
                      <p className="text-gray-600 mt-2">{promotedSegments[0].subtitle}</p>
                    )}
                  </div>

                  {/* Countdown Timer */}
                  {promotedSegments[0]?.promotion_ends_at && (
                    <div className="hidden md:flex gap-3">
                      {[
                        { label: 'Days', value: Math.floor((new Date(promotedSegments[0].promotion_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) },
                        { label: 'Hours', value: Math.floor(((new Date(promotedSegments[0].promotion_ends_at).getTime() - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) },
                        { label: 'Mins', value: Math.floor(((new Date(promotedSegments[0].promotion_ends_at).getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60)) },
                      ].map((time, idx) => (
                        <div key={idx} className="text-center">
                          <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl shadow-md text-red-600">
                            {Math.max(0, time.value)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 font-bold uppercase">{time.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {promotedSegments[0]?.segment_products?.slice(0, 4).map((sp: any, idx: number) => {
                    const prodItem = sp.store_inventory as Product;
                    if (!prodItem) return null;

                    const promo = promoLookup[prodItem.id];
                    const discount = promotedSegments[0].discount_percentage || (promo?.discount_value) || 20;
                    const originalPrice = prodItem.price;
                    const salePrice = originalPrice * (1 - discount / 100);
                    const qty = cart[prodItem.id] || 0;

                    return (
                      <div key={`${prodItem.id}-${idx}`} className="bg-white rounded-2xl p-4 border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all relative group">
                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                          {discount}% OFF
                        </div>

                        {/* Product Image */}
                        <div className="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                          <img
                            src={prodItem.global_products.image_url || 'https://via.placeholder.com/200'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            alt={prodItem.global_products.name}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">
                          {prodItem.global_products.category || 'Featured'}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5em] mb-2">
                          {cleanName(prodItem.global_products.name)}
                        </h4>

                        {/* Pricing */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-black text-red-600">${salePrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                        </div>

                        {/* Add to Cart */}
                        {qty === 0 ? (
                          <button
                            onClick={() => updateQty(prodItem.id, 1)}
                            className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors shadow-md"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-white border-2 border-red-200 rounded-full px-2 py-1 shadow-sm">
                            <button onClick={() => updateQty(prodItem.id, -1)} className="p-1 text-gray-500 hover:text-red-500">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{qty}</span>
                            <button onClick={() => updateQty(prodItem.id, 1)} className="p-1 text-gray-500 hover:text-red-600">
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3.5 SEGMENTED PICKS FROM ADMIN */}
      {segments.length > 0 && !searchTerm && (
        <div id="segments" className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 space-y-10">
          {segments.map((segment) => {
            const items = segment.segment_products?.filter((sp) => sp.store_inventory) || [];
            if (items.length === 0) return null;

            return (
              <section
                key={segment.id}
                id={`segment-${segment.slug || segment.id}`}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${segment.badge_color || '#ecfdf3'}`, color: '#0f172a' }}>
                      <Zap size={14} /> {segment.badge_label || 'Curated'}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mt-2">{segment.title}</h3>
                    {segment.subtitle && <p className="text-sm text-gray-500 mt-1">{segment.subtitle}</p>}
                  </div>
                  {segment.tagline && <div className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">{segment.tagline}</div>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {items.map((sp, idx) => {
                    const prodItem = sp.store_inventory as Product;
                    const promo = promoLookup[prodItem.id];
                    const finalPrice = getPromoAdjustedPrice(prodItem.price, promo);
                    const hasPromo = Boolean(promo);

                    return (
                      <div key={`${prodItem.id}-${idx}`} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-green-100 hover:shadow-md transition-all relative">
                        {hasPromo && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {promo?.discount_type === 'fixed_price' ? 'Price Drop' : `${promo?.discount_value}% OFF`}
                          </div>
                        )}
                        {sp.highlight_label && (
                          <div className="absolute top-3 right-3 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-700">
                            {sp.highlight_label}
                          </div>
                        )}
                        <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          <img
                            src={prodItem.global_products.image_url || 'https://via.placeholder.com/240?text=Product'}
                            className="w-full h-full object-cover"
                            alt={prodItem.global_products.name}
                          />
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                          {prodItem.global_products.category || 'Assorted'}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5em]">{cleanName(prodItem.global_products.name)}</h4>
                        <div className="flex items-center justify-between mt-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-green-700">${finalPrice.toFixed(2)}</span>
                            {hasPromo && <span className="text-xs text-gray-400 line-through">${prodItem.price.toFixed(2)}</span>}
                          </div>
                          {promo && (
                            <span className="text-[10px] text-red-600 font-bold">
                              {promo.discount_type === 'fixed_price' ? 'Deal' : `${promo.discount_value}% off`}
                            </span>
                          )}
                        </div>
                        {(() => {
                          const qty = cart[prodItem.id] || 0;
                          return qty === 0 ? (
                            <button
                              onClick={() => updateQty(prodItem.id, 1)}
                              className="w-full bg-green-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                            >
                              Add to cart
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-2 py-1 shadow-sm">
                              <button onClick={() => updateQty(prodItem.id, -1)} className="p-1 text-gray-500 hover:text-red-500">
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold w-5 text-center">{qty}</span>
                              <button onClick={() => updateQty(prodItem.id, 1)} className="p-1 text-gray-500 hover:text-green-600">
                                <Plus size={12} />
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* 4. DEAL OF THE WEEK (Special Section) */}
      {promos.length > 0 && !searchTerm && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

              {/* Timer & Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs mb-4 bg-white px-3 py-1 rounded-full shadow-sm">
                  <Clock size={14} /> Limited Time Offer
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Deal of the Week</h2>
                <div className="flex justify-center md:justify-start gap-4 mb-8">
                  <div className="text-center">
                    <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shadow-sm text-red-600">02</div>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shadow-sm text-red-600">14</div>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl shadow-sm text-red-600">45</div>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Mins</div>
                  </div>
                </div>
                <Link href="/shop/deals" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                  View All Deals
                </Link>
              </div>

              {/* Promo Cards */}
              <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-4 hide-scrollbar">
                {promos.slice(0, 3).map(promo => {
                  const item = getInventoryItem(promo);
                  if (!item) return null;
                  const qty = cart[item.id || ''] || 0;

                  return (
                    <div key={promo.id} className="min-w-[200px] bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="w-24 h-24 mb-3">
                        <img src={item.global_products.image_url} className="w-full h-full object-contain" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.global_products.name}</h4>
                      <div className="flex items-center gap-2 mt-2 mb-3">
                        <span className="text-lg font-black text-red-600">${getDealPrice(promo)}</span>
                        <span className="text-xs text-gray-400 line-through">${item.price}</span>
                      </div>
                      {/* Add Button Logic */}
                      {qty === 0 ? (
                        <button
                          onClick={() => updateQty(item.id!, 1)}
                          className="w-full bg-gray-100 hover:bg-green-600 hover:text-white text-gray-700 font-bold py-2 rounded-lg text-xs transition-colors"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-3 w-full">
                          <button onClick={() => updateQty(item.id!, -1)} className="bg-gray-200 p-1 rounded hover:bg-gray-300"><Minus size={14} /></button>
                          <span className="font-bold text-sm">{qty}</span>
                          <button onClick={() => updateQty(item.id!, 1)} className="bg-gray-200 p-1 rounded hover:bg-gray-300"><Plus size={14} /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <div className="flex gap-2">
            <button className="text-sm font-bold text-gray-400 hover:text-green-600">All</button>
            <button className="text-sm font-bold text-gray-400 hover:text-green-600">Best Sellers</button>
            <button className="text-sm font-bold text-gray-400 hover:text-green-600">New Arrivals</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((prod: any) => {
            const prodItem = Array.isArray(prod) ? prod[0] : prod;
            if (!prodItem?.global_products) return null;
            const qty = cart[prodItem.id] || 0;

            return (
              <div key={prodItem.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:border-green-100 transition-all group relative">

                {/* Discount Badge Mock */}
                <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                  NEW
                </div>

                {/* Wishlist */}
                <button className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors z-10">
                  <Heart size={18} />
                </button>

                {/* Image */}
                <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={prodItem.global_products.image_url || 'https://via.placeholder.com/150'}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Quick Add Overlay on Desktop */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {qty === 0 && (
                      <button
                        onClick={() => updateQty(prodItem.id, 1)}
                        className="bg-white text-gray-900 shadow-md text-xs font-bold px-4 py-2 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Quick Add
                      </button>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wide">
                    {prodItem.global_products.category || 'Grocery'}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 min-h-[2.5em]">
                    {cleanName(prodItem.global_products.name)}
                  </h3>

                  {/* Rating Mock */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4].map(i => <Star key={i} size={10} fill="currentColor" />)}
                      <Star size={10} className="text-gray-300" />
                    </div>
                    <span className="text-[10px] text-gray-400">(4)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-green-700">${prodItem.price}</span>
                    </div>

                    {/* Compact Add/Qty Button */}
                    {qty === 0 ? (
                      <button
                        onClick={() => updateQty(prodItem.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-1 py-0.5 shadow-sm">
                        <button onClick={() => updateQty(prodItem.id, -1)} className="p-1 text-gray-500 hover:text-red-500"><Minus size={12} /></button>
                        <span className="text-xs font-bold w-3 text-center">{qty}</span>
                        <button onClick={() => updateQty(prodItem.id, 1)} className="p-1 text-gray-500 hover:text-green-600"><Plus size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING CART BAR (Bottom Right) */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Link href="/shop/cart">
            <div className="bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform border-2 border-white/10">
              <div className="relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Total</span>
                <span className="font-bold text-lg">${estimatedTotal.toFixed(2)}</span>
              </div>
              <ArrowRight size={18} className="text-green-400" />
            </div>
          </Link>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 mt-20 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-black text-gray-900 mb-4">
              <ShoppingBag className="text-green-600" /> InduMart
            </div>
            <p className="text-sm text-gray-500 mb-4">Fresh products delivered to your door.</p>
            <div className="text-sm text-gray-900 font-bold">123 Market Street, NY</div>
            <div className="text-sm text-gray-500">support@indumart.com</div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>My Profile</li>
              <li>Order History</li>
              <li>Wishlist</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Shipping Info</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Newsletter</h4>
            <div className="flex">
              <input type="text" placeholder="Email address" className="bg-gray-50 border border-gray-200 rounded-l-lg px-4 py-2 text-sm w-full outline-none focus:border-green-500" />
              <button className="bg-green-600 text-white px-4 py-2 rounded-r-lg font-bold text-sm">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          &copy; 2024 RetailRevive Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}