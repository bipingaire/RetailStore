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
exports.PurchaseOrderService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let PurchaseOrderService = class PurchaseOrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPurchaseOrder(vendorId, items, notes) {
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
        const orderNumber = `PO-${Date.now()}`;
        return this.prisma.purchaseOrder.create({
            data: {
                vendorId,
                orderNumber,
                totalAmount,
                notes,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitCost: item.unitCost,
                        totalCost: item.quantity * item.unitCost,
                    })),
                },
            },
            include: {
                vendor: true,
                items: { include: { product: true } },
            },
        });
    }
    async getPurchaseOrder(id) {
        return this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                vendor: true,
                items: { include: { product: true } },
            },
        });
    }
    async getAllPurchaseOrders(status) {
        const where = status ? { status } : {};
        return this.prisma.purchaseOrder.findMany({
            where,
            include: { vendor: true, items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status },
        });
    }
    async sendPurchaseOrder(id) {
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: {
                status: 'sent',
                sentAt: new Date(),
            },
        });
    }
    async receivePurchaseOrder(id) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!po)
            throw new Error('Purchase order not found');
        await this.prisma.$transaction(async (tx) => {
            for (const item of po.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'IN',
                        quantity: item.quantity,
                        reason: `PO ${po.orderNumber}`,
                        date: new Date(),
                    },
                });
            }
            await tx.purchaseOrder.update({
                where: { id },
                data: {
                    status: 'received',
                    receivedAt: new Date(),
                },
            });
        });
        return this.getPurchaseOrder(id);
    }
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], PurchaseOrderService);
//# sourceMappingURL=purchase-order.service.js.map