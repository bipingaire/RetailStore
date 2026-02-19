'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, ShoppingBag, Package, Loader2, MapPin, Wallet } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams?.get('orderId');

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) { router.push('/shop'); return; }
        fetchOrder();
    }, [orderId]);

    async function fetchOrder() {
        try {
            const data = await apiClient.get(`/sales/${orderId}`);
            setOrder(data);
        } catch (err) {
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    }

    const generatePDF = async () => {
        if (!order) return;

        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        const green: [number, number, number] = [22, 163, 74];
        const gray: [number, number, number] = [107, 114, 128];

        // Header bar
        doc.setFillColor(...green);
        doc.rect(0, 0, 210, 32, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('InduMart', 105, 14, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Order Receipt', 105, 24, { align: 'center' });

        // Order meta
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Order #${order.saleNumber || order.id?.slice(0, 8).toUpperCase()}`, 14, 44);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 50);
        doc.text(`Status: ${order.status || 'COMPLETED'}`, 14, 56);
        const paymentMethodDisp = (order.paymentMethod || 'CASH').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
        doc.text(`Payment: ${paymentMethodDisp}`, 140, 44);
        if (order.notes) {
            const noteLines = doc.splitTextToSize(`Note: ${order.notes}`, 65);
            doc.text(noteLines, 140, 50);
        }

        // Items table
        const rows = (order.items || []).map((item: any) => [
            item.product?.name || item.productId?.slice(0, 8),
            item.quantity,
            `$${parseFloat(item.unitPrice).toFixed(2)}`,
            `$${parseFloat(item.subtotal).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Product', 'Qty', 'Unit Price', 'Subtotal']],
            body: rows,
            foot: [
                ['', '', 'Subtotal:', `$${parseFloat(order.subtotal ?? 0).toFixed(2)}`],
                ['', '', 'Tax:', `$${parseFloat(order.tax ?? 0).toFixed(2)}`],
                ['', '', 'Discount:', `-$${parseFloat(order.discount ?? 0).toFixed(2)}`],
                ['', '', 'TOTAL:', `$${parseFloat(order.total ?? 0).toFixed(2)}`],
            ],
            theme: 'grid',
            headStyles: { fillColor: green, halign: 'center', fontStyle: 'bold' },
            footStyles: { halign: 'right', fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' },
            columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 14;
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        doc.text('Thank you for shopping with InduMart!', 105, finalY, { align: 'center' });

        doc.save(`InduMart_Receipt_${order.saleNumber || order.id?.slice(0, 8)}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
            </div>
        );
    }

    const subtotal = parseFloat(order?.subtotal ?? 0);
    const tax = parseFloat(order?.tax ?? 0);
    const discount = parseFloat(order?.discount ?? 0);
    const total = parseFloat(order?.total ?? 0);
    const items: any[] = order?.items || [];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-xl mx-auto space-y-4">

                {/* Success Banner */}
                <div className="bg-emerald-600 rounded-2xl p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                        <CheckCircle className="text-emerald-600" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1">Order Confirmed!</h1>
                    <p className="text-emerald-100 text-sm">Your order has been placed successfully.</p>
                    <div className="mt-3 bg-emerald-700 rounded-xl px-4 py-2 inline-block">
                        <span className="text-emerald-200 text-xs">Order ID</span>
                        <p className="font-mono font-bold text-white text-sm">{order?.saleNumber || order?.id}</p>
                    </div>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Order meta row */}
                    <div className="grid grid-cols-2 gap-px bg-gray-100">
                        <div className="bg-white p-4">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Wallet size={12} /> Payment</p>
                            <p className="font-bold text-gray-800 capitalize text-sm">{(order?.paymentMethod || 'CASH').replace(/_/g, ' ').toLowerCase()}</p>
                        </div>
                        <div className="bg-white p-4">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Package size={12} /> Status</p>
                            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{order?.status || 'COMPLETED'}</span>
                        </div>
                    </div>

                    {/* Notes / delivery info */}
                    {order?.notes && (
                        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex gap-2 text-sm text-amber-800">
                            <MapPin size={16} className="shrink-0 mt-0.5" />
                            <span>{order.notes}</span>
                        </div>
                    )}

                    {/* Items */}
                    <div className="p-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Items Ordered</p>
                        <div className="space-y-3">
                            {items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            {item.product?.imageUrl
                                                ? <img src={item.product.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg" />
                                                : <ShoppingBag size={16} className="text-gray-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{item.product?.name || 'Product'}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">${parseFloat(item.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-100 p-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                        </div>
                        {tax > 0 && <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax</span><span>${tax.toFixed(2)}</span>
                        </div>}
                        {discount > 0 && <div className="flex justify-between text-sm text-gray-600">
                            <span>Discount</span><span>-${discount.toFixed(2)}</span>
                        </div>}
                        <div className="flex justify-between font-bold text-base text-gray-900 border-t pt-2">
                            <span>Total Paid</span>
                            <span className="text-emerald-600 text-lg">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 space-y-2 bg-gray-50 border-t">
                        <button
                            onClick={generatePDF}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                        >
                            <Download size={18} /> Download Receipt PDF
                        </button>
                        <Link
                            href="/shop"
                            className="block w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-center hover:bg-emerald-700 transition"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/shop/orders"
                            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition text-sm"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
