'use client';
import { useState, useMemo } from 'react';
import { Search, Tag, Package, Plus, Barcode, ChevronDown, LayoutGrid } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  total_qty?: number;
  stock?: number;
  category?: string | null;
  image?: string | null;
  imageUrl?: string | null;
}

interface ProductGridProps {
  products: ProductItem[];
  categories: { name: string; count: number }[];
  onAddToCart: (product: ProductItem) => void;
  onBarcodeSearch: (code: string) => void;
  loading?: boolean;
}

export default function ProductGrid({
  products,
  categories,
  onAddToCart,
  onBarcodeSearch,
  loading = false,
}: ProductGridProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        !selectedCategory ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    onBarcodeSearch(barcodeInput.trim());
    setBarcodeInput('');
  };

  // Display top 10 categories by default when collapsed, or all when expanded
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 10);

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
      {/* Search & Category Controls Header */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3 shadow-sm">
        {/* Row 1: Search, Barcode & Category Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search product by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Standard Form Category Select Dropdown */}
          <div className="relative min-w-[160px] max-w-[220px]">
            <Tag className="absolute left-3 top-2.5 text-indigo-500 pointer-events-none" size={18} />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full pl-9 pr-8 py-2 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600 focus:bg-white transition-all cursor-pointer truncate appearance-none"
            >
              <option value="">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-3 text-indigo-400 pointer-events-none" size={14} />
          </div>

          {/* Barcode Quick Lookup */}
          <form onSubmit={handleBarcodeSubmit} className="relative w-44">
            <Barcode className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              data-barcode-input="true"
              placeholder="Scan Barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </form>
        </div>

        {/* Row 2: Standard Multi-Line Wrapped Category Pills (No horizontal scrolling slider) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items ({products.length})
          </button>
          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
          {categories.length > 10 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-100"
            >
              {showAllCategories ? 'Show Less' : `+${categories.length - 10} More`}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading Product Catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
            <Package size={36} className="text-slate-300" />
            <p className="text-sm font-medium">No products match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => {
              const stock = product.stock ?? product.total_qty ?? 0;
              const isOut = stock <= 0;
              const isLow = stock > 0 && stock <= 5;
              const img = product.imageUrl || product.image;

              return (
                <button
                  key={product.id}
                  onClick={() => onAddToCart(product)}
                  className={`group relative bg-white border border-slate-200 rounded-2xl p-3 text-left flex flex-col justify-between transition-all hover:shadow-md hover:border-indigo-300 active:scale-[0.98] ${
                    isOut ? 'opacity-60 bg-slate-50' : ''
                  }`}
                >
                  <div>
                    {/* Image / Icon */}
                    <div className="w-full h-24 bg-slate-100 rounded-xl mb-2 overflow-hidden flex items-center justify-center relative">
                      {img ? (
                        <img src={img} alt={product.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Package size={28} className="text-slate-300" />
                      )}
                      {/* Stock badge */}
                      <span
                        className={`absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isOut
                            ? 'bg-red-500 text-white'
                            : isLow
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-900/70 text-white backdrop-blur-sm'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : `${stock} left`}
                      </span>
                    </div>

                    {/* Name & Category */}
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{product.category || 'General'}</p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-sm font-black text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Plus size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
