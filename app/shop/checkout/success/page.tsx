'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const dynamic = 'force-dynamic';

function CheckoutSuccessPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams?.get('orderId');
    const supabase = createClientComponentClient();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            router.push('/shop');
            return;
        }
        fetchOrder();
    }, [orderId]);

    async function fetchOrder() {
        try {
            const { data: orderData, error } = await supabase
                .from('customer-order-header')
                .select(`
                    *,
                    items:order-line-item-detail(*),
                    tenant:retail-store-tenant(store-name, store-address, store-city),
                    invoice:customer-invoices(invoice-number)
                `)
                .eq('order-id', orderId)
                .single();

            if (error) throw error;
            setOrder(orderData);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }

    const generateReceipt = () => {
        if (!order) return;

        const doc = new jsPDF();
        const storeName = order.tenant?.['store-name'] || 'InduMart';
        const storeAddress = `${order.tenant?.['store-address'] || ''}, ${order.tenant?.['store-city'] || ''}`;
        const uniqueId = order.invoice?.[0]?.['invoice-number'] || order['order-id'];

        // Header - Store Info
        doc.setFontSize(22);
        doc.setTextColor(40, 167, 69); // Green
        doc.text(storeName, 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(storeAddress, 105, 26, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Payment Receipt', 105, 38, { align: 'center' });

        // Order/Invoice Info
        doc.setFontSize(10);
        doc.setTextColor(0);

        // Left Side
        doc.text(`Receipt ID: ${uniqueId}`, 14, 50);
        doc.text(`Date: ${new Date(order['created-at']).toLocaleDateString()} ${new Date(order['created-at']).toLocaleTimeString()}`, 14, 56);
        doc.text(`Payment: ${order['payment-method']?.toUpperCase()}`, 14, 62);

        // Right Side
        doc.text(`Customer: ${order['customer-name']}`, 140, 50);
        doc.text(`Email: ${order['customer-email']}`, 140, 56);
        if (order['customer-phone']) doc.text(`Phone: ${order['customer-phone']}`, 140, 62);

        // Items Table
        const tableBody = order.items.map((item: any) => [
            item['product-name'],
            item['inventory-id'].slice(0, 8),
            item['quantity-ordered'],
            `$${(item['unit-price-amount'] || 0).toFixed(2)}`,
            `$${(item['total-amount'] || 0).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 70,
            head: [['Product Name', 'Item ID', 'Qty', 'Unit Price', 'Total']],
            body: tableBody,
            foot: [
                ['', '', '', 'Subtotal:', `$${(order['total-amount-value'] || 0).toFixed(2)}`],
                ['', '', '', 'Tax:', `$${(order['tax-amount'] || 0).toFixed(2)}`],
                ['', '', '', 'Grand Total:', `$${(order['final-amount'] || 0).toFixed(2)}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [40, 167, 69], halign: 'center' },
            columnStyles: {
                0: { cellWidth: 80 },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            },
            footStyles: { halign: 'right', fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for shopping with us!', 105, finalY, { align: 'center' });

        doc.save(`${storeName.replace(/\s+/g, '_')}_Receipt_${uniqueId}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle className="text-emerald-600" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-emerald-100">Thank you for your purchase.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-gray-500 text-sm">Order ID</p>
                        <p className="font-mono font-bold text-gray-800 select-all">{order['order-id']}</p>
                    </div>

                    <div className="border-t border-b py-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-bold capitalize">{order['payment-method']?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="font-bold text-emerald-600 text-lg">${order['final-amount']?.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={generateReceipt}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
                        >
                            <Download size={20} />
                            Download Receipt
                        </button>

                        <Link
                            href="/shop"
                            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
            <CheckoutSuccessPageContent />
        </Suspense>
    );
}
