'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, ShoppingBag, FileText } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const [orderDetails, setOrderDetails] = useState<{
        items: OrderItem[];
        subtotal: number;
        tax: number;
        deliveryCharges: number;
        total: number;
        orderDate: string;
        orderId: string;
    } | null>(null);

    useEffect(() => {
        // Retrieve order details from sessionStorage
        const savedOrder = sessionStorage.getItem('last_order');
        if (savedOrder) {
            setOrderDetails(JSON.parse(savedOrder));
        }
    }, []);

    const generatePDF = () => {
        if (!orderDetails) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Company/Store Header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYMENT RECEIPT', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('InduMart', pageWidth / 2, 28, { align: 'center' });
        doc.text('Your Trusted Retail Store', pageWidth / 2, 33, { align: 'center' });

        // Order Information
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Order Details:', 14, 45);

        doc.setFont('helvetica', 'normal');
        doc.text(`Order ID: ${orderDetails.orderId}`, 14, 52);
        doc.text(`Date: ${orderDetails.orderDate}`, 14, 58);
        doc.text(`Payment Status: PAID`, 14, 64);

        // Products Table
        const tableData = orderDetails.items.map(item => [
            item.name,
            item.quantity.toString(),
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 75,
            head: [['Product', 'Qty', 'Unit Price', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [37, 99, 235], // Blue
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { halign: 'center', cellWidth: 25 },
                2: { halign: 'right', cellWidth: 35 },
                3: { halign: 'right', cellWidth: 40 }
            },
            styles: {
                fontSize: 10,
                cellPadding: 5
            }
        });

        // Get the final Y position after table
        const finalY = (doc as any).lastAutoTable.finalY || 75;

        // Price Breakdown
        const summaryStartY = finalY + 10;
        const rightAlign = pageWidth - 14;
        const labelX = pageWidth - 70;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Subtotal
        doc.text('Subtotal:', labelX, summaryStartY);
        doc.text(`$${orderDetails.subtotal.toFixed(2)}`, rightAlign, summaryStartY, { align: 'right' });

        // Tax
        doc.text('Tax (13%):', labelX, summaryStartY + 6);
        doc.text(`$${orderDetails.tax.toFixed(2)}`, rightAlign, summaryStartY + 6, { align: 'right' });

        // Delivery
        doc.text('Delivery Charges:', labelX, summaryStartY + 12);
        doc.text(`$${orderDetails.deliveryCharges.toFixed(2)}`, rightAlign, summaryStartY + 12, { align: 'right' });

        // Total line
        doc.setLineWidth(0.5);
        doc.line(labelX, summaryStartY + 16, rightAlign, summaryStartY + 16);

        // Grand Total
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('TOTAL:', labelX, summaryStartY + 22);
        doc.text(`$${orderDetails.total.toFixed(2)}`, rightAlign, summaryStartY + 22, { align: 'right' });

        // Footer
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        const footerY = doc.internal.pageSize.getHeight() - 20;
        doc.text('Thank you for your purchase!', pageWidth / 2, footerY, { align: 'center' });
        doc.text('For inquiries, contact: support@indumart.com', pageWidth / 2, footerY + 5, { align: 'center' });

        // Save the PDF
        doc.save(`Receipt-${orderDetails.orderId}.pdf`);
    };

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Message */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="text-green-600" size={48} />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">
                        Your order has been placed successfully
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-sm text-gray-600">Order ID</div>
                        <div className="text-lg font-bold text-gray-900">{orderDetails.orderId}</div>
                    </div>

                    {/* Download Receipt Button */}
                    <button
                        onClick={generatePDF}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mb-4"
                    >
                        <Download size={20} />
                        Download Receipt (PDF)
                    </button>

                    <Link
                        href="/shop"
                        className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Order Summary
                    </h2>

                    {/* Products Table */}
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 text-gray-600 font-semibold">Product</th>
                                    <th className="text-right py-2 text-gray-600 font-semibold">Qty</th>
                                    <th className="text-right py-2 text-gray-600 font-semibold">Unit Price</th>
                                    <th className="text-right py-2 text-gray-600 font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-3 font-semibold text-gray-900">{item.name}</td>
                                        <td className="py-3 text-right text-gray-700">{item.quantity}</td>
                                        <td className="py-3 text-right text-gray-700">${item.price.toFixed(2)}</td>
                                        <td className="py-3 text-right font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${orderDetails.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax (13%)</span>
                            <span>${orderDetails.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery Charges</span>
                            <span>${orderDetails.deliveryCharges.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                            <span>Total Paid</span>
                            <span>${orderDetails.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
