'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useBarcodeScanner } from '@/lib/hooks/use-barcode-scanner';
import ProductGrid, { ProductItem } from '@/components/admin-ui/pos/product-grid';
import CartPanel, { CartLineItem, CustomerData } from '@/components/admin-ui/pos/cart-panel';
import CustomerModal from '@/components/admin-ui/pos/customer-modal';
import PaymentModal from '@/components/admin-ui/pos/payment-modal';
import ReceiptModal from '@/components/admin-ui/pos/receipt-modal';
import { toast } from 'sonner';

export default function POSTerminalPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart state
  const [cartItems, setCartItems] = useState<CartLineItem[]>([]);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [discountPct, setDiscountPct] = useState<number>(0);
  const [taxPct, setTaxPct] = useState<number>(0);

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Completed sale result for receipt
  const [lastSale, setLastSale] = useState<{
    saleNumber: string;
    date: Date;
    items: CartLineItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountTendered?: number;
    customer?: CustomerData | null;
  } | null>(null);

  // Pagination & Filter state
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load products & categories with backend pagination
  const loadCatalog = useCallback(async (pPage = page, pSearch = search, pCat = selectedCategory) => {
    setLoading(true);
    try {
      let url = `/products?sellableOnly=true&page=${pPage}&limit=${limit}`;
      if (pSearch) url += `&search=${encodeURIComponent(pSearch)}`;
      if (pCat) url += `&category=${encodeURIComponent(pCat)}`;

      const [prodsData, catsData] = await Promise.all([
        apiClient.get(url),
        apiClient.get('/products/categories'),
      ]);

      if (prodsData && prodsData.meta) {
        setProducts(prodsData.data || []);
        setTotalProducts(prodsData.meta.total || 0);
        setTotalPages(prodsData.meta.totalPages || 1);
      } else {
        const arr = Array.isArray(prodsData) ? prodsData : prodsData.data || [];
        setProducts(arr);
        setTotalProducts(arr.length);
        setTotalPages(Math.max(1, Math.ceil(arr.length / limit)));
      }

      setCategories(catsData || []);
    } catch (err: any) {
      console.error('Failed to load catalog for POS', err);
      toast.error('Failed to load products for POS');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadCatalog(page, search, selectedCategory);
  }, [page, search, selectedCategory, loadCatalog]);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string | null) => {
    setSelectedCategory(newCategory);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Audio feedback helper for barcode scanning
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch { /* silent */ }
  };

  // Add Product to Cart
  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + 1;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          subtotal: current.price * newQty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}-${Math.random()}`,
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          subtotal: Number(product.price),
        },
      ];
    });
  };

  // Handle Barcode Scan / Manual Search Code
  const handleBarcodeLookup = async (code: string) => {
    try {
      const product = await apiClient.get(`/products/barcode/${encodeURIComponent(code)}`);
      if (product) {
        playBeep();
        handleAddToCart({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          stock: product.stock,
          category: product.category,
        });
        toast.success(`Scanned: ${product.name}`);
      }
    } catch {
      toast.error(`Barcode "${code}" not found in catalog`);
    }
  };

  // Hook for Hardware USB Barcode Scanner
  useBarcodeScanner({
    onScan: (code) => {
      handleBarcodeLookup(code);
    },
    enabled: !isPaymentModalOpen && !isReceiptModalOpen && !isCustomerModalOpen,
  });

  // Quantity Controls
  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: item.price * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartLineItem[]
    );
  };

  // Remove Line Item
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
    setDiscountPct(0);
    setTaxPct(0);
    setCustomer(null);
  };

  // Custom Item
  const handleAddCustomItem = (name: string, price: number) => {
    const customId = `custom-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        id: customId,
        productId: customId,
        name,
        price,
        quantity: 1,
        subtotal: price,
      },
    ]);
  };

  // Complete Checkout API Call
  const handleCompleteSale = async (paymentMethod: 'CASH' | 'CARD' | 'STRIPE', amountTendered?: number) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    const discountAmount = (subtotal * discountPct) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (taxableAmount * taxPct) / 100;
    const total = Math.max(0, taxableAmount + taxAmount);

    const salePayload = {
      customerId: customer?.id || null,
      customerName: customer?.name || undefined,
      customerPhone: customer?.phone || undefined,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.productId.startsWith('custom-') ? undefined : item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.subtotal,
      })),
    };

    try {
      const createdSale = await apiClient.post('/sales', salePayload);
      toast.success('Sale transaction recorded!');

      setLastSale({
        saleNumber: createdSale.saleNumber || `SALE-${Date.now()}`,
        date: new Date(),
        items: [...cartItems],
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        total,
        paymentMethod,
        amountTendered,
        customer,
      });

      setIsPaymentModalOpen(false);
      setIsReceiptModalOpen(true);

      // Refresh product stock
      loadCatalog();
    } catch (err: any) {
      console.error('Failed to complete sale', err);
      toast.error(err.message || 'Failed to complete transaction');
    }
  };

  const handleCloseReceipt = () => {
    setIsReceiptModalOpen(false);
    handleClearCart();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Left Column: Product Catalog Grid (60% width) */}
      <div className="w-[60%] h-full flex flex-col">
        <ProductGrid
          products={products}
          categories={categories}
          onAddToCart={handleAddToCart}
          onBarcodeSearch={handleBarcodeLookup}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalProducts={totalProducts}
          limit={limit}
          onPageChange={handlePageChange}
          search={search}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Right Column: Checkout Cart Panel (40% width) */}
      <div className="w-[40%] h-full flex flex-col border-l border-slate-200">
        <CartPanel
          items={cartItems}
          customer={customer}
          discountPct={discountPct}
          taxPct={taxPct}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onAddCustomItem={handleAddCustomItem}
          onSetDiscountPct={setDiscountPct}
          onSetTaxPct={setTaxPct}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={setCustomer}
        selectedCustomer={customer}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={Math.max(
          0,
          cartItems.reduce((a, b) => a + b.subtotal, 0) * (1 - discountPct / 100) * (1 + taxPct / 100)
        )}
        subtotalAmount={cartItems.reduce((a, b) => a + b.subtotal, 0)}
        taxAmount={
          (Math.max(0, cartItems.reduce((a, b) => a + b.subtotal, 0) * (1 - discountPct / 100)) * taxPct) / 100
        }
        discountAmount={(cartItems.reduce((a, b) => a + b.subtotal, 0) * discountPct) / 100}
        items={cartItems}
        customer={customer}
        onCompleteSale={handleCompleteSale}
      />

      {lastSale && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={handleCloseReceipt}
          saleNumber={lastSale.saleNumber}
          date={lastSale.date}
          items={lastSale.items}
          subtotal={lastSale.subtotal}
          discount={lastSale.discount}
          tax={lastSale.tax}
          total={lastSale.total}
          paymentMethod={lastSale.paymentMethod}
          amountTendered={lastSale.amountTendered}
          customer={lastSale.customer}
        />
      )}
    </div>
  );
}
