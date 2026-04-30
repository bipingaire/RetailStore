'use client';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { ChevronLeft, Search, CheckCircle, Plus, Minus, ShoppingBag, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

type Product = {
  id: string;
  price: number;
  name: string;
  imageUrl: string | null;
  category: string | null;
};

interface Category {
  name: string;
  count: number;
  imageUrl?: string | null;
};

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

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'name_asc';

function CategoriesInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(searchParams.get('category'));
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // for debouncing
  const [cart, setCart] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<SortOption>('default');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('retail_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
    const handleStorage = () => {
      try {
        const current = localStorage.getItem('retail_cart');
        if (current) setCart(JSON.parse(current));
      } catch(e) {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      next[id] = (next[id] || 0) + delta;
      if (next[id] <= 0) delete next[id];
      localStorage.setItem('retail_cart', JSON.stringify(next));
      window.dispatchEvent(new Event('storage'));
      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  // Initial load: Categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await apiClient.get('/products/categories');
        if (Array.isArray(cats)) setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load products when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
    fetchProducts(1, true);
  }, [activeTab, searchTerm, sortBy]);

  async function fetchProducts(pageNum: number, isNewSearch = false) {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `/products?sellableOnly=true&page=${pageNum}&limit=24`;
      if (activeTab) url += `&category=${encodeURIComponent(activeTab)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      
      const res = await apiClient.get(url);
      const dataArray = res.data || [];
      const meta = res.meta || { total: dataArray.length, hasNextPage: false };

      const normalizeCategory = (cat: string | null) => {
        if (!cat) return 'Uncategorized';
        return cat.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      };

      const mappedProducts = dataArray.map((p: any) => ({
        id: p.id,
        price: Number(p.price) || 0,
        name: p.name,
        imageUrl: p.imageUrl || p.image,
        category: normalizeCategory(p.category),
      }));

      // Sort current page
      let sorted = [...mappedProducts];
      if (sortBy === 'price_asc') sorted.sort((a, b) => a.price - b.price);
      if (sortBy === 'price_desc') sorted.sort((a, b) => b.price - a.price);
      if (sortBy === 'name_asc') sorted.sort((a, b) => a.name.localeCompare(b.name));

      setProducts(prev => isNewSearch ? sorted : [...prev, ...sorted]);
      setHasMore(meta.hasNextPage);
      setTotalProducts(meta.total);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const productCard = (prod: Product, size: 'sm' | 'md' = 'sm') => {
    const qty = cart[prod.id] || 0;
    if (size === 'md') {
      return (
        <div key={prod.id} className="flex flex-col bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all overflow-hidden group">
          <div className="relative bg-gray-50" style={{paddingBottom:'100%'}}>
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <img
                src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                alt={prod.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="p-3 flex flex-col flex-1 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 uppercase font-semibold mb-1">{prod.category}</p>
            <h3 className="text-sm text-gray-800 line-clamp-2 flex-1 mb-3 leading-snug">{prod.name}</h3>
            <p className="text-lg font-black text-gray-900 mb-3">${prod.price.toFixed(2)}</p>
            {qty === 0 ? (
              <button onClick={() => updateQty(prod.id, 1)} className="w-full bg-green-600 text-white font-bold py-2 rounded-full text-sm hover:bg-green-700 transition-colors">
                Add to cart
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 justify-center">
                <button onClick={() => updateQty(prod.id, -1)} className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"><Minus size={12} /></button>
                <span className="text-sm font-bold w-6 text-center text-green-800">{qty}</span>
                <button onClick={() => updateQty(prod.id, 1)} className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"><Plus size={12} /></button>
              </div>
            )}
          </div>
        </div>
      );
    }
    // Mobile small card
    return (
      <div key={prod.id} className="flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-sm p-2">
        <div className="aspect-square bg-white rounded-lg mb-2 overflow-hidden flex items-center justify-center">
          <img src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"} alt={prod.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-[11px] font-semibold text-gray-800 line-clamp-2 leading-tight mb-1 flex-1">{prod.name}</h3>
        <span className="text-green-700 font-black text-sm mb-2">${prod.price.toFixed(2)}</span>
        <div className="mt-auto">
          {qty === 0 ? (
            <button onClick={() => updateQty(prod.id, 1)} className="w-full bg-green-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors">Add to Cart</button>
          ) : (
            <div className="flex items-center justify-between bg-white border border-green-200 rounded-lg px-2 py-1 shadow-sm">
              <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500"><Minus size={14} /></button>
              <span className="text-xs font-bold w-5 text-center">{qty}</span>
              <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600"><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ─────────────────────────────────────────────
          MOBILE LAYOUT (hidden on md+)
      ───────────────────────────────────────────── */}
      <div className="flex flex-col h-[100dvh] bg-white text-gray-900 md:hidden">
        {/* Mobile App Bar */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:text-black">
              <ChevronLeft size={24} />
            </button>
            <span className="text-lg font-semibold tracking-tight ml-2">Categories</span>
          </div>
          <Link href="/shop/cart" className="p-2 -mr-2 text-gray-600 hover:text-black relative">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Left Sidebar */}
          <div className="w-[100px] bg-gray-50 flex-shrink-0 overflow-y-auto hide-scrollbar border-r border-gray-100">
            <button onClick={() => setActiveTab(null)} className={`w-full py-4 flex flex-col items-center gap-1 transition-colors relative ${activeTab === null ? 'bg-white font-bold' : 'text-gray-500'}`}>
              {activeTab === null && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />}
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-[#FFE5D0]">🛒</div>
              <span className="text-[10px] text-center w-full px-1">All Products</span>
            </button>
            {categories.map((cat, i) => (
              <button key={cat.name} onClick={() => setActiveTab(cat.name)} className={`w-full py-4 flex flex-col items-center gap-1 transition-colors relative ${activeTab === cat.name ? 'bg-white font-bold' : 'text-gray-500'}`}>
                {activeTab === cat.name && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl overflow-hidden" style={{ backgroundColor: activeTab === cat.name || cat.imageUrl ? 'transparent' : catBgColors[i % catBgColors.length] }}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
                  ) : (
                    getCategoryEmoji(cat.name)
                  )}
                </div>
                <span className="text-[10px] text-center w-full px-1 leading-tight whitespace-normal break-words">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Mobile Products Grid */}
          <div className="flex-1 overflow-y-auto bg-white p-3 hide-scrollbar flex flex-col">
            <div className="relative mb-4 flex-shrink-0">
              <Search className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
              <input type="text" placeholder={`Search in ${activeTab || 'All Products'}...`} className="w-full bg-gray-100 rounded-xl py-2 pl-9 pr-3 text-[13px] font-medium outline-none focus:ring-1 focus:ring-green-500" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            
            <h2 className="font-bold text-gray-900 mb-3 px-1">
              {activeTab || 'All Products'} <span className="text-gray-400 font-normal text-sm ml-1">({totalProducts})</span>
            </h2>
            
            {loading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {products.map(prod => productCard(prod, 'sm'))}
                </div>
                {hasMore && (
                  <button onClick={loadMore} disabled={loadingMore} className="mt-4 mx-auto flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                    {loadingMore ? 'Loading...' : 'Load More'} <ChevronDown size={16} />
                  </button>
                )}
                {!hasMore && products.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50 text-xs text-gray-500 gap-2">
                    <CheckCircle size={16} />
                    End of list
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          DESKTOP LAYOUT (hidden on mobile, shown md+)
      ───────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col min-h-screen bg-gray-50">

        {/* Desktop Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
            <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft size={20} />
              <span className="font-semibold text-sm">Back to Store</span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search in ${activeTab || 'all products'}...`}
                className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-11 pr-5 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-4 top-3 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Cart */}
            <Link href="/shop/cart" className="relative flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
              <ShoppingBag size={18} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="bg-yellow-400 text-gray-900 text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center ml-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Desktop Body */}
        <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8 w-full flex-1">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-black text-gray-900 text-base">Categories</h2>
                <p className="text-xs text-gray-400 mt-0.5">{categories.length} departments</p>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-180px)] py-2">
                {/* All */}
                <button
                  onClick={() => setActiveTab(null)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all hover:bg-gray-50 ${activeTab === null ? 'bg-green-50 border-r-4 border-green-600' : ''}`}
                >
                  <span className="text-xl flex-shrink-0">🛒</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${activeTab === null ? 'text-green-700' : 'text-gray-800'}`}>All Products</p>
                    <p className="text-xs text-gray-400">{categories.reduce((acc, cat) => acc + cat.count, 0)} items</p>
                  </div>
                </button>

                {categories.map((cat, i) => {
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveTab(cat.name)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all hover:bg-gray-50 ${activeTab === cat.name ? 'bg-green-50 border-r-4 border-green-600' : ''}`}
                    >
                      {cat.imageUrl ? (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100 p-0.5">
                          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
                        </div>
                      ) : (
                        <span className="text-xl flex-shrink-0 w-8 text-center">{getCategoryEmoji(cat.name)}</span>
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${activeTab === cat.name ? 'text-green-700' : 'text-gray-800'}`}>{cat.name}</p>
                        <p className="text-xs text-gray-400">{cat.count} items</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb + Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Link href="/shop" className="hover:text-green-600">Home</Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">{activeTab || 'All Products'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    {activeTab ? (
                      <>
                        {categories.find(c => c.name === activeTab)?.imageUrl ? (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100 p-1">
                            <img src={categories.find(c => c.name === activeTab)?.imageUrl!} alt={activeTab} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
                          </div>
                        ) : (
                          <span className="text-3xl">{getCategoryEmoji(activeTab)}</span>
                        )}
                        {activeTab}
                      </>
                    ) : '🛒 All Products'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">{totalProducts} products{searchTerm ? ` matching "${searchTerm}"` : ''}</p>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <SlidersHorizontal size={16} />
                    <span className="font-medium">Sort by:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                  >
                    <option value="default">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A–Z</option>
                  </select>
                </div>
              </div>

              {/* Active filter pill */}
              {activeTab && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {categories.find(c => c.name === activeTab)?.imageUrl ? (
                      <div className="w-5 h-5 rounded flex items-center justify-center overflow-hidden bg-white/50">
                        <img src={categories.find(c => c.name === activeTab)?.imageUrl!} alt={activeTab} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                    ) : getCategoryEmoji(activeTab)} 
                    {activeTab}
                    <button onClick={() => setActiveTab(null)} className="ml-1 hover:text-green-600"><X size={12} /></button>
                  </span>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">Try a different category or search term</p>
                <button onClick={() => { setActiveTab(null); setSearchInput(''); }} className="bg-green-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-700 transition-colors text-sm">
                  View All Products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {products.map(prod => productCard(prod, 'md'))}
                </div>

                {hasMore && (
                  <div className="flex flex-col items-center mt-10 gap-2">
                    <p className="text-sm text-gray-400">Showing {products.length} of {totalProducts} products</p>
                    <button onClick={loadMore} disabled={loadingMore} className="flex items-center gap-2 bg-green-600 text-white font-bold px-10 py-3 rounded-full hover:bg-green-700 transition-all shadow-md text-sm disabled:opacity-50">
                      {loadingMore ? 'Loading...' : 'Load More'} <ChevronDown size={18} />
                    </button>
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="flex items-center justify-center mt-10 gap-2 text-sm text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    All {products.length} products loaded
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default function MobileCategoriesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    }>
      <CategoriesInner />
    </Suspense>
  );
}
