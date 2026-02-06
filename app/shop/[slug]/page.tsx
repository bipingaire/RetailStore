'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ... icons ...

export default function ShopHome({ params }: { params: { slug: string } }) {

  const [promos, setPromos] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Campaigns (replaces promotions)
      const { data: campaignData, error: campaignError } = await supabase
        .from('marketing-campaign-master')
        .select(`
          "campaign-id":id,
          "campaign-slug":slug,
          "campaign-type":segment_type,
          "is-promoted":is_promoted,
          "promotion-ends-at":promotion_ends_at,
          "discount-percentage":discount_percentage,
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
        .eq('is-active-flag', true);

      if (campaignError) console.error("Campaign Error:", campaignError);

      // 2. Fetch Inventory
      const { data: prodData, error: prodError } = await supabase
        .from('retail-store-inventory-item')
        .select(`
          "inventory-id":id,
          "selling-price-amount":price,
          global_products:"global-product-master-catalog"!"global-product-id" (
            "product-name":name,
            "image-url":image_url,
            "category-name":category
          )
        `)
        .eq('is-active-flag', true)
        .limit(20);

      if (prodError) console.error("Product Error:", prodError);

      // Normalize Promos (Deals) from Campaigns
      const normalizedPromos: Promotion[] = (campaignData as any[] || [])
        .filter(c => c.is_promoted && c.segment_products?.length > 0)
        .map(c => ({
          id: c.id,
          discount_type: 'percentage',
          discount_value: c.discount_percentage || 20,
          end_date: c.promotion_ends_at || new Date(Date.now() + 7 * 86400000).toISOString(),
          fulfillment_restriction: 'all',
          store_inventory: c.segment_products[0]?.store_inventory ? {
            price: Number(c.segment_products[0].store_inventory.price ?? 0),
            global_products: {
              name: c.segment_products[0].store_inventory.global_products?.name || 'Item',
              image_url: c.segment_products[0].store_inventory.global_products?.image_url || '',
              upc_ean: c.segment_products[0].store_inventory.global_products?.upc_ean || ''
            }
          } : { price: 0, global_products: { name: 'N/A', image_url: '', upc_ean: '' } }
        }));

      const normalizedProducts: Product[] = (prodData as any[] || []).map((prod) => ({
        id: prod.id,
        price: Number(prod.price ?? 0),
        global_products: {
          name: prod.global_products?.name || 'Unnamed',
          image_url: prod.global_products?.image_url || '',
          category: prod.global_products?.category || 'Item'
        }
      }));

      setPromos(normalizedPromos);
      setProducts(normalizedProducts);
      setLoading(false);
    }
    loadData();
  }, []);

  // Helper to calculate discounted price for display
  const getDealPrice = (p: Promotion) => {
    const original = p.store_inventory.price || 0;
    if (p.discount_type === 'fixed_price') return p.discount_value.toFixed(2);
    return (original - (original * (p.discount_value / 100))).toFixed(2);
  };
  const formatPrice = (value?: number) =>
    typeof value === 'number' ? value.toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-gray-400 text-sm">Loading Store...</p>
      </div>
    );
  }

  const heroPromo = promos[0];
  const featuredCategories = Array.from(
    new Set(
      products
        .map((item) => item.global_products.category)
        .filter((category): category is string => Boolean(category))
    )
  ).slice(0, 6);
  const curatedProducts = products.slice(0, 4);
  const heroImage =
    heroPromo?.store_inventory.global_products.image_url ||
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80';
  const perks = [
    {
      title: 'Trusted Retailer',
      description: 'Verified suppliers & transparent sourcing.',
      icon: ShieldCheck,
    },
    {
      title: 'Same-Day Pickup',
      description: 'Ready in 2 hours for local stores.',
      icon: Truck,
    },
    {
      title: 'Curated Finds',
      description: 'Fresh arrivals every single morning.',
      icon: Sparkles,
    },
    {
      title: 'Loyalty Rewards',
      description: 'Earn perks with every order.',
      icon: Gift,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50/60 via-white to-slate-50 min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 space-y-12 pt-6">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white px-6 py-10 md:px-10 md:py-14 shadow-xl">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Seasonal feature"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          </div>
          <div className="relative grid gap-8 md:grid-cols-[1.1fr_.9fr] items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                <MapPin size={14} />
                Neighborhood market
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-amber-200 text-sm font-medium">
                  <Zap size={16} />
                  New flash deals drop daily · Handpicked favorites
                </div>
                <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                  Discover weekly finds, curated by retailers you trust.
                </h1>
                <p className="text-white/80 text-base md:text-lg max-w-xl">
                  Browse seasonal drops, reserve limited-run items, and pick up in-store all from a single, cozy shopping dashboard.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5">
                  <ShoppingBag size={16} />
                  Start shopping
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-semibold text-white border border-white/30 backdrop-blur transition hover:bg-white/10">
                  <Flame size={16} />
                  Explore flash deals
                </button>
              </div>
              <div className="grid gap-4 pt-4 text-white/80 sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-black">{products.length || 0}+</p>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Items in stock
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black">{promos.length || 0}</p>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Live flash deals
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black">
                    {heroPromo ? `$${getDealPrice(heroPromo)}` : '$14'}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Feature price today
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-5 space-y-4 text-slate-900">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-500">
                <Sparkles size={14} />
                Featured deal
              </div>
              {heroPromo ? (
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <img
                      src={
                        heroPromo.store_inventory.global_products.image_url ||
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={heroPromo.store_inventory.global_products.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                      <Clock size={12} />
                      <CountdownTimer targetDate={heroPromo.end_date} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-tight">
                      {heroPromo.store_inventory.global_products.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {heroPromo.fulfillment_restriction === 'store_only'
                        ? 'Available for in-store pickup only'
                        : 'Available for pickup or delivery'}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-slate-900">
                      ${getDealPrice(heroPromo)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ${heroPromo.store_inventory.price}
                    </span>
                  </div>
                  <button className="w-full rounded-2xl bg-slate-900 text-white py-3 text-sm font-semibold flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Reserve this deal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-amber-100 to-pink-50 flex flex-col items-center justify-center text-center text-sm text-slate-500">
                    <Sparkles className="text-amber-400" />
                    Sneak peek of upcoming promos
                  </div>
                  <p className="text-base text-slate-600">
                    Flash deals refresh soon. Stay tuned for curated steals from your favorite aisles.
                  </p>
                  <button className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold">
                    Notify me first
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* QUICK PERKS */}
        <section className="grid gap-4 md:grid-cols-4">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="rounded-3xl border border-white/60 bg-white/80 px-4 py-5 shadow-sm shadow-slate-200 flex items-start gap-3"
              >
                <span className="rounded-2xl bg-slate-900/90 text-white p-2">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {perk.title}
                  </p>
                  <p className="text-xs text-slate-500">{perk.description}</p>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* FLASH DEALS */}
      {promos.length > 0 && (
        <section className="mt-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="rounded-[32px] bg-slate-900 text-white p-6 md:p-8 shadow-2xl border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                    <Flame size={14} />
                    Flash Saves
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold mt-2">
                    Limited-time steals expiring soon
                  </h2>
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-white/70">
                  Offers refresh throughout the day
                </span>
              </div>
              <div className="flex overflow-x-auto gap-5 pb-4 snap-x hide-scrollbar">
                {promos.map((promo) => (
                  <div
                    key={promo.id}
                    className="min-w-[85%] md:min-w-[420px] bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-5 relative snap-center border border-white/10 shadow-xl"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 uppercase tracking-wide">
                      <Clock size={12} />
                      Ends in <CountdownTimer targetDate={promo.end_date} />
                    </div>
                    {promo.fulfillment_restriction === 'store_only' && (
                      <div className="absolute top-5 right-5 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                        <MapPin size={10} />
                        In-store only
                      </div>
                    )}
                    <div className="mt-4 flex gap-4">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white/10 border border-white/10">
                        <img
                          src={
                            promo.store_inventory.global_products.image_url ||
                            'https://via.placeholder.com/150?text=Deal'
                          }
                          alt={promo.store_inventory.global_products.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70 uppercase tracking-wide">
                          {promo.discount_type === 'percentage'
                            ? `Save ${promo.discount_value}%`
                            : 'Special price drop'}
                        </p>
                        <h3 className="text-xl font-semibold truncate">
                          {promo.store_inventory.global_products.name}
                        </h3>
                        <div className="mt-2 flex items-baseline gap-3">
                          <span className="text-3xl font-bold text-amber-300">
                            ${getDealPrice(promo)}
                          </span>
                          <span className="text-sm text-white/60 line-through">
                            ${promo.store_inventory.price}
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 rounded-2xl bg-white text-slate-900 py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                            <Plus size={16} />
                            Add to cart
                          </button>
                          <button className="rounded-2xl border border-white/30 px-4 text-sm font-semibold flex items-center gap-2">
                            <Heart size={16} />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY CHIPS */}
      <section className="mt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Shop by craving
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Browse collections curated for you
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">
              <Star size={16} />
              View all categories
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {featuredCategories.length > 0 ? (
              featuredCategories.map((category) => (
                <button
                  key={category}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:-translate-y-0.5 transition"
                >
                  {category}
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Categories will show once inventory is synced.</p>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Fresh arrivals
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Just stocked shelves
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
              Sort by newest
              <ArrowRightIcon />
            </button>
          </div>
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 text-center py-14 px-6 text-slate-400">
              <p className="text-lg font-semibold">No products yet</p>
              <p className="text-sm">
                Scan an invoice via the Admin Panel to seed your storefront.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group rounded-[28px] border border-slate-100 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-50">
                    {prod.global_products.image_url ? (
                      <img
                        src={prod.global_products.image_url}
                        alt={prod.global_products.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs font-semibold uppercase tracking-widest text-slate-300">
                        No image
                      </div>
                    )}
                    <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
                      {prod.global_products.category || 'Item'}
                    </div>
                    <button className="absolute bottom-4 right-4 rounded-full bg-white text-slate-900 p-3 shadow-xl">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {prod.global_products.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-slate-900">
                        ${formatPrice(prod.price)}
                      </span>
                      <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                        <ShoppingBag size={14} />
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CURATED SHELVES */}
      {curatedProducts.length > 0 && (
        <section className="mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="rounded-[32px] bg-slate-900 text-white p-8 md:p-12 grid gap-8 md:grid-cols-2 overflow-hidden relative shadow-2xl">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                  Curated shelves
                </p>
                <h2 className="text-3xl font-semibold">
                  Editor picks for the weekend dash
                </h2>
                <p className="text-white/70">
                  A rotating mix of local favorites and seasonal must-haves. Save them for later or snag them now before the next drop arrives.
                </p>
                <div className="flex gap-2 text-sm text-white/70">
                  <ShieldCheck size={16} />
                  Only available while inventory lasts
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-xl">
                  <Heart size={16} />
                  Save entire list
                </button>
              </div>
              <div className="grid gap-4">
                {curatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white/20">
                      {prod.global_products.image_url ? (
                        <img
                          src={prod.global_products.image_url}
                          alt={prod.global_products.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] uppercase tracking-widest text-white/70">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                        {prod.global_products.category || 'Item'}
                      </p>
                      <h3 className="text-base font-semibold truncate">
                        {prod.global_products.name}
                      </h3>
                    </div>
                    <span className="text-lg font-semibold">
                      ${formatPrice(prod.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);