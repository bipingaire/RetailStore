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
exports.SaleService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let SaleService = class SaleService {
    constructor(tenantService, tenantPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
    }
    async createSale(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    saleNumber: `SALE-${Date.now()}`,
                    userId: data.userId,
                    customerId: data.customerId,
                    subtotal: data.subtotal,
                    tax: data.tax,
                    discount: data.discount,
                    total: data.total,
                    status: 'COMPLETED',
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            subtotal: item.subtotal,
                        }))
                    }
                },
                include: { items: true }
            });
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'SALE',
                        quantity: -item.quantity,
                        description: `Sale ${sale.saleNumber}`
                    }
                });
            }
            return sale;
        });
    }
    async findAll(subdomain, options) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.sale.findMany({ include: { items: true } });
    }
    async findOne(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const sale = await client.sale.findUnique({ where: { id }, include: { items: true } });
        if (!sale)
            throw new common_1.NotFoundException('Sale not found');
        return sale;
    }
    async getSalesStats(subdomain) {
        return { totalSales: 0, totalRevenue: 0 };
    }
    async cancelSale(subdomain, id, userId) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.sale.update({ where: { id }, data: { status: 'CANCELLED' } });
    }
    async syncSalesFromImage(tenantId, imageUrl) {
        return { success: true, count: 0, raw: [] };
    }
};
exports.SaleService = SaleService;
exports.SaleService = SaleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService])
], SaleService);
//# sourceMappingURL=sale.service.js.map