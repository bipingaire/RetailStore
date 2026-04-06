'use client';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Search, CheckCircle, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

type Product = {
  id: string;
  price: number;
  name: string;
  imageUrl: string | null;
  category: string | null;
};

// Reuse emojis and colors identical to shop page
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

export default function MobileCategoriesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null); // null means "All"
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('retail_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}

    // Listen to storage events to sync cart across tabs (optional but good)
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
      // Dispatch a storage event if needed elsewhere
      window.dispatchEvent(new Event('storage'));
      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const productsData = await apiClient.get('/products?sellableOnly=true');
        const dataArray = Array.isArray(productsData) ? productsData : [];
        const mappedProducts = dataArray.map((p: any) => ({
          id: p.id,
          price: Number(p.price) || 0,
          name: p.name,
          imageUrl: p.imageUrl || p.image,
          category: p.category || 'Uncategorized',
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

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category!));
    return Array.from(cats).sort();
  }, [products]);

  const displayedProducts = (activeTab === null 
    ? products 
    : products.filter(p => p.category === activeTab))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Reset search when changing category tab
  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white text-gray-900 md:max-w-md md:mx-auto md:border-x md:shadow-xl">
      {/* Top App Bar */}
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
        {/* Left Sidebar (Categories) */}
        <div className="w-[100px] bg-gray-50 flex-shrink-0 overflow-y-auto hide-scrollbar border-r border-gray-100">
          
          <button
            onClick={() => setActiveTab(null)}
            className={`w-full py-4 flex flex-col items-center gap-1 transition-colors relative ${activeTab === null ? 'bg-white font-bold' : 'text-gray-500'}`}
          >
            {activeTab === null && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-[#FFE5D0]`}>🛒</div>
            <span className="text-[10px] text-center w-full px-1">All Products</span>
          </button>

          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`w-full py-4 flex flex-col items-center gap-1 transition-colors relative ${activeTab === cat ? 'bg-white font-bold' : 'text-gray-500'}`}
            >
              {activeTab === cat && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl`}
                style={{ backgroundColor: activeTab === cat ? 'transparent' : catBgColors[i % catBgColors.length] }}
              >
                {getCategoryEmoji(cat)}
              </div>
              <span className="text-[10px] text-center w-full px-1 leading-tight whitespace-normal break-words underline-offset-2">{cat}</span>
            </button>
          ))}
        </div>

        {/* Right Content (Products Grid) */}
        <div className="flex-1 overflow-y-auto bg-white p-3 hide-scrollbar flex flex-col">
          <div className="relative mb-4 flex-shrink-0">
            <Search className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search in ${activeTab || 'All Products'}...`}
              className="w-full bg-gray-100 placeholder:text-gray-400 rounded-xl py-2 pl-9 pr-3 text-[13px] font-medium outline-none focus:ring-1 focus:ring-green-500 transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h2 className="font-bold text-gray-900 mb-3 px-1">{activeTab || 'All Products'} <span className="text-gray-400 font-normal text-sm ml-1">({displayedProducts.length})</span></h2>
          
          <div className="grid grid-cols-2 gap-3">
            {displayedProducts.map(prod => {
              const qty = cart[prod.id] || 0;
              return (
                <div 
                  key={prod.id} 
                  className="flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-sm p-2"
                >
                  <div className="aspect-square bg-white rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                    <img
                      src={prod.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-[11px] font-semibold text-gray-800 line-clamp-2 leading-tight mb-1 flex-1">{prod.name}</h3>
                  <span className="text-green-700 font-black text-sm mb-2">${prod.price.toFixed(2)}</span>
                  
                  <div className="mt-auto">
                    {qty === 0 ? (
                      <button
                        onClick={() => updateQty(prod.id, 1)}
                        className="w-full bg-green-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-white border border-green-200 rounded-lg px-2 py-1 shadow-sm">
                        <button onClick={() => updateQty(prod.id, -1)} className="p-1 text-gray-500 hover:text-red-500">
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{qty}</span>
                        <button onClick={() => updateQty(prod.id, 1)} className="p-1 text-gray-500 hover:text-green-600">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center py-10 opacity-50 text-xs text-gray-500 gap-2">
            <CheckCircle size={16} />
            End of list
          </div>
        </div>
      </div>
    </div>
  );
}
