import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { Prisma } from '../generated/tenant-client';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: TenantPrismaService) { }

    async uploadInvoice(
        vendorId: string,
        invoiceNumber: string,
        invoiceDate: Date,
        totalAmount: number,
        fileUrl?: string,
    ) {
        return this.prisma.vendorInvoice.create({
            data: {
                vendorId,
                invoiceNumber,
                invoiceDate,
                totalAmount,
                fileUrl,
                status: 'pending',
            },
        });
    }

    async getInvoice(id: string) {
        return this.prisma.vendorInvoice.findUnique({
            where: { id },
            include: {
                vendor: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async getAllInvoices(status?: string) {
        const where: Prisma.VendorInvoiceWhereInput = status ? { status } : {};

        return this.prisma.vendorInvoice.findMany({
            where,
            include: {
                vendor: true,
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async addInvoiceItems(invoiceId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>) {
        const createItems = items.map(item => ({
            invoiceId,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            totalCost: item.quantity * item.unitCost,
        }));

        return this.prisma.vendorInvoiceItem.createMany({
            data: createItems,
        });
    }

    async commitInvoice(invoiceId: string) {
        // Get invoice with all items
        const invoice = await this.prisma.vendorInvoice.findUnique({
            where: { id: invoiceId },
            include: { items: true },
        });

        if (!invoice) {
            throw new Error('Invoice not found');
        }

        if (invoice.status === 'committed') {
            throw new Error('Invoice already committed');
        }

        // Update inventory quantities in a transaction
        await this.prisma.$transaction(async (tx) => {
            // Update each product's stock
            for (const item of invoice.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                        costPrice: item.unitCost, // Update cost price to latest
                    },
                });

                // Create stock movement record
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'IN',
                        quantity: item.quantity,
                        reason: `Invoice ${invoice.invoiceNumber}`,
                        date: new Date(),
                    },
                });
            }

            // Update invoice status
            await tx.vendorInvoice.update({
                where: { id: invoiceId },
                data: { status: 'committed' },
            });
        });

        return this.getInvoice(invoiceId);
    }

    async parseInvoiceOCR(fileUrl: string) {
        // TODO: Integrate with OCR service (Mindee, Veryfi, etc.)
        // For now, return mock data
        return {
            vendorName: 'Mock Vendor',
            invoiceNumber: `INV-${Date.now()}`,
            invoiceDate: new Date(),
            items: [
                {
                    description: 'Sample Product',
                    quantity: 10,
                    unitPrice: 25.00,
                    totalPrice: 250.00,
                },
            ],
            totalAmount: 250.00,
        };
    }
}
