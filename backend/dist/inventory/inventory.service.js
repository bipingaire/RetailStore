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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMovement(tenantId, dto) {
        const movement = await this.prisma.forTenant(tenantId).stockMovement.create({
            data: {
                productId: dto.productId,
                movementType: dto.movementType,
                quantity: dto.quantity,
                reason: dto.reason,
                notes: dto.notes,
                createdBy: dto.createdBy,
                invoiceId: dto.invoiceId,
                saleId: dto.saleId,
            },
            include: {
                product: true,
            },
        });
        const product = await this.prisma.forTenant(tenantId).product.findUnique({
            where: { id: dto.productId },
        });
        if (product) {
            let newStock = product.stock;
            if (dto.movementType === 'IN') {
                newStock += dto.quantity;
            }
            else if (dto.movementType === 'OUT' || dto.movementType === 'LOSS') {
                newStock -= dto.quantity;
            }
            else if (dto.movementType === 'ADJUSTMENT') {
                newStock = dto.quantity;
            }
            await this.prisma.forTenant(tenantId).product.update({
                where: { id: dto.productId },
                data: {
                    stock: newStock,
                    lastRestockedAt: dto.movementType === 'IN' ? new Date() : product.lastRestockedAt,
                },
            });
        }
        return movement;
    }
    async getMovements(tenantId, productId, movementType) {
        return this.prisma.forTenant(tenantId).stockMovement.findMany({
            where: {
                ...(productId && { productId }),
                ...(movementType && { movementType }),
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async getHealthMetrics(tenantId) {
        const products = await this.prisma.forTenant(tenantId).product.findMany({
            where: { isActive: true },
        });
        const lowStock = products.filter(p => p.stock <= p.reorderLevel);
        const outOfStock = products.filter(p => p.stock === 0);
        const slowMoving = products.filter(p => p.slowMoving);
        const fastMoving = products.filter(p => p.fastMoving);
        const nearExpiry = products.filter(p => p.daysToExpiry !== null && p.daysToExpiry <= 15);
        return {
            totalProducts: products.length,
            lowStock: lowStock.length,
            outOfStock: outOfStock.length,
            slowMoving: slowMoving.length,
            fastMoving: fastMoving.length,
            nearExpiry: nearExpiry.length,
            lowStockProducts: lowStock.map(p => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                stock: p.stock,
                reorderLevel: p.reorderLevel,
            })),
            nearExpiryProducts: nearExpiry.map(p => ({
                id: p.id,
                name: p.name,
                daysToExpiry: p.daysToExpiry,
                expiryDate: p.expiryDate,
            })),
        };
    }
    async getLowStock(tenantId) {
        return this.prisma.forTenant(tenantId).product.findMany({
            where: {
                isActive: true,
                stock: {
                    lte: this.prisma.forTenant(tenantId).product.fields.reorderLevel,
                },
            },
            orderBy: { stock: 'asc' },
        });
    }
    async calculateHealthScore(tenantId, productId) {
        const product = await this.prisma.forTenant(tenantId).product.findUnique({
            where: { id: productId },
            include: {
                SaleItems: {
                    where: {
                        sale: {
                            createdAt: {
                                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                            },
                        },
                    },
                },
            },
        });
        if (!product)
            return 0;
        let score = 50;
        if (product.stock === 0) {
            score -= 30;
        }
        else if (product.stock <= product.reorderLevel) {
            score -= 15;
        }
        else if (product.stock > product.reorderLevel * 3) {
            score -= 10;
        }
        else {
            score += 15;
        }
        const salesLast30Days = product.SaleItems.length;
        if (salesLast30Days === 0) {
            score -= 20;
        }
        else if (salesLast30Days < 5) {
            score -= 10;
        }
        else if (salesLast30Days > 20) {
            score += 20;
        }
        else {
            score += 10;
        }
        if (product.daysToExpiry !== null) {
            if (product.daysToExpiry <= 7) {
                score -= 20;
            }
            else if (product.daysToExpiry <= 15) {
                score -= 10;
            }
            else if (product.daysToExpiry <= 30) {
                score -= 5;
            }
        }
        return Math.max(0, Math.min(100, score));
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map