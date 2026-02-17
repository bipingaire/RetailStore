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
const tenant_service_1 = require("../tenant/tenant.service");
let PurchaseOrderService = class PurchaseOrderService {
    constructor(tenantPrisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.tenantService = tenantService;
    }
    async createPurchaseOrder(subdomain, vendorId, items, notes) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
        const orderNumber = `PO-${Date.now()}`;
        return client.purchaseOrder.create({
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
                status: 'draft',
            },
            include: {
                vendor: true,
                items: { include: { product: true } },
            },
        });
    }
    async getPurchaseOrder(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.purchaseOrder.findUnique({
            where: { id },
            include: {
                vendor: true,
                items: { include: { product: true } },
            },
        });
    }
    async getAllPurchaseOrders(subdomain, status) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const where = status ? { status } : {};
        return client.purchaseOrder.findMany({
            where,
            include: { vendor: true, items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(subdomain, id, status) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.purchaseOrder.update({
            where: { id },
            data: { status },
        });
    }
    async sendPurchaseOrder(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.purchaseOrder.update({
            where: { id },
            data: {
                status: 'sent',
                sentAt: new Date(),
            },
        });
    }
    async receivePurchaseOrder(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const po = await client.purchaseOrder.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!po)
            throw new Error('Purchase order not found');
        await client.$transaction(async (tx) => {
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
                        description: `PO ${po.orderNumber}`,
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
        return this.getPurchaseOrder(subdomain, id);
    }
};
exports.PurchaseOrderService = PurchaseOrderService;
exports.PurchaseOrderService = PurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], PurchaseOrderService);
//# sourceMappingURL=purchase-order.service.js.map