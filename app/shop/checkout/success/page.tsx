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

        // Add logo image
        const logoImg = new Image();
        logoImg.src = '/indumart-logo.png';

        // Add logo (centered)
        const logoWidth = 15;
        const logoHeight = 15;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logoImg, 'PNG', logoX, 12, logoWidth, logoHeight);

        // InduMart Title (green)
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 139, 34); // Green
        doc.text('InduMart', pageWidth / 2, 32, { align: 'center' });

        // Payment Receipt Title
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Black
        doc.text('Payment Receipt', pageWidth / 2, 40, { align: 'center' });

        // Left side - Receipt Details
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const leftX = 14;
        let yPos = 50;
        doc.text(`Receipt ID: ${orderDetails.orderId}`, leftX, yPos);
        yPos += 5;
        doc.text(`Date: ${orderDetails.orderDate}`, leftX, yPos);
        yPos += 5;
        doc.text('Payment: CASH', leftX, yPos);

        // Right side - Customer Details
        const rightX = 120;
        yPos = 50;
        doc.text('Customer: Walk-in Customer', rightX, yPos);
        yPos += 5;
        doc.text('Email: -', rightX, yPos);
        yPos += 5;
        doc.text('Phone: -', rightX, yPos);

        // Products Table with GREEN header
        console.log('Order details for PDF:', orderDetails);
        console.log('Items array:', orderDetails.items);

        if (!orderDetails.items || orderDetails.items.length === 0) {
            console.error('No items found in order!');
            doc.setFontSize(10);
            doc.text('No items in this order', 14, 70);
            doc.save(`Receipt-${orderDetails.orderId}.pdf`);
            return;
        }

        const tableData = orderDetails.items.map((item, index) => [
            item.name,
            `ITEM-${String(index + 1).padStart(3, '0')}`,
            item.quantity.toString(),
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Product Name', 'Item ID', 'Qty', 'Unit Price', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [34, 139, 34], // Green
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center',
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 9
            },
            columnStyles: {
                0: { cellWidth: 70, halign: 'left' },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 30, halign: 'right' }
            },
            styles: {
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            }
        });

        // Get the final Y position after table
        const finalY = (doc as any).lastAutoTable.finalY || 75;

        // Summary section (right-aligned)
        const summaryX = 150;
        const labelX = 120;
        let summaryY = finalY + 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        // Subtotal
        doc.text('Subtotal:', labelX, summaryY);
        doc.text(`$${orderDetails.total.toFixed(2)}`, summaryX, summaryY, { align: 'right' });
        summaryY += 5;

        // Tax
        doc.text('Tax:', labelX, summaryY);
        doc.text('$0.00', summaryX, summaryY, { align: 'right' });
        summaryY += 6;

        // Grand Total (bold)
        doc.setFont('helvetica', 'bold');
        doc.text('Grand Total:', labelX, summaryY);
        doc.text(`$${orderDetails.total.toFixed(2)}`, summaryX, summaryY, { align: 'right' });

        // Footer
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        const footerY = doc.internal.pageSize.getHeight() - 15;
        doc.text('(Free Pickup - No Delivery Charges)', pageWidth / 2, footerY, { align: 'center' });
        doc.text('Thank you for shopping with InduMart!', pageWidth / 2, footerY + 5, { align: 'center' });

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
                    {/* Header with Logo */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <img src="/indumart-logo.png" alt="InduMart" className="h-10 w-10 object-contain" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                            <p className="text-xs text-gray-500">InduMart - Your Trusted Store</p>
                        </div>
                    </div>

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
                    <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                            <span>Total Paid (Free Pickup)</span>
                            <span>${orderDetails.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
