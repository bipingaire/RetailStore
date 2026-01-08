'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Package, MapPin, Search, Phone, Clock, Truck } from 'lucide-react';
import NearbyStoresModal from '@/components/nearby-stores-modal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CustomerProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNearbyStores, setShowNearbyStores] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    // Get product from master catalog by slug or ID
    const { data: productData } = await supabase
      .from('global-product-master-catalog')
      .select('*')
      .eq('product-id', slug)
      .single();

    if (productData) {
      setProduct(productData);

      // Get inventory for current store
      const tenantId = getTenantFromSubdomain();
      if (tenantId) {
        const { data: inventoryData } = await supabase
          .from('retail-store-inventory-item')
          .select('*')
          .eq('global-product-id', productData['product-id'])
          .eq('tenant-id', tenantId)
          .single();

        setInventory(inventoryData);
      }
    }

    setLoading(false);
  }

  function getTenantFromSubdomain(): string | null {
    // Extract tenant from subdomain or context
    // This would use your subdomain utilities
    return null; // Placeholder
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found</div>;
  }

  const stockQuantity = inventory?.['current-stock-quantity'] || 0;
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = stockQuantity > 0 && stockQuantity < 5;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          {product['image-url'] ? (
            <img
              src={product['image-url']}
              alt={product['product-name']}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-24 h-24 text-gray-300" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            {product['brand-name'] && (
              <p className="text-sm text-gray-600 mb-1">{product['brand-name']}</p>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {product['product-name']}
            </h1>
          </div>

          {/* Stock Status */}
          <div className="space-y-3">
            {isOutOfStock ? (
              <>
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="font-semibold">Out of Stock at This Location</span>
                </div>

                <button
                  onClick={() => setShowNearbyStores(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Find at Nearby Stores
                </button>
              </>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                <span className="font-semibold">Only {stockQuantity} left in stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="font-semibold">In Stock</span>
              </div>
            )}

            {!isOutOfStock && (
              <button className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
            )}
          </div>

          {/* Description */}
          {product['description-text'] && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product['description-text']}</p>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-2 text-sm">
            {product['category-name'] && (
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{product['category-name']}</span>
              </div>
            )}
            {product['package-size'] && (
              <div className="flex justify-between">
                <span className="text-gray-500">Size</span>
                <span className="font-medium">
                  {product['package-size']} {product['package-unit']}
                </span>
              </div>
            )}
            {product['upc-ean-code'] && (
              <div className="flex justify-between">
                <span className="text-gray-500">UPC</span>
                <span className="font-mono text-xs">{product['upc-ean-code']}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nearby Stores Modal */}
      {showNearbyStores && (
        <NearbyStoresModal
          productId={product['product-id']}
          productName={product['product-name']}
          onClose={() => setShowNearbyStores(false)}
        />
      )}
    </div>
  );
}