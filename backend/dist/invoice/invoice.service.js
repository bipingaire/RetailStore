"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let InvoiceService = class InvoiceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadInvoice(vendorId, invoiceNumber, invoiceDate, totalAmount, fileUrl) {
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
    async getInvoice(id) {
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
    async getAllInvoices(status) {
        const where = status ? { status } : {};
        return this.prisma.vendorInvoice.findMany({
            where,
            include: {
                vendor: true,
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addInvoiceItems(invoiceId, items) {
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
    async commitInvoice(invoiceId) {
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
        await this.prisma.$transaction(async (tx) => {
            for (const item of invoice.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                        costPrice: item.unitCost,
                    },
                });
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
            await tx.vendorInvoice.update({
                where: { id: invoiceId },
                data: { status: 'committed' },
            });
        });
        return this.getInvoice(invoiceId);
    }
    async parseInvoiceOCR(fileUrl) {
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
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map