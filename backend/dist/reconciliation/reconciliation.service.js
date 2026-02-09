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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let ReconciliationService = class ReconciliationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createdBy) {
        return this.prisma.forTenant(tenantId).reconciliation.create({
            data: {
                status: 'IN_PROGRESS',
                createdBy,
            },
        });
    }
    async findAll(tenantId) {
        return this.prisma.forTenant(tenantId).reconciliation.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findOne(tenantId, id) {
        return this.prisma.forTenant(tenantId).reconciliation.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async updateItem(tenantId, reconciliationId, productId, physicalCount, reason, notes) {
        const product = await this.prisma.forTenant(tenantId).product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new Error('Product not found');
        const difference = physicalCount - product.stock;
        const existing = await this.prisma.forTenant(tenantId).reconciliationItem.findFirst({
            where: {
                reconciliationId,
                productId,
            },
        });
        if (existing) {
            return this.prisma.forTenant(tenantId).reconciliationItem.update({
                where: { id: existing.id },
                data: {
                    physicalCount,
                    difference,
                    reason,
                    notes,
                },
                include: { product: true },
            });
        }
        else {
            return this.prisma.forTenant(tenantId).reconciliationItem.create({
                data: {
                    reconciliationId,
                    productId,
                    systemStock: product.stock,
                    physicalCount,
                    difference,
                    reason,
                    notes,
                },
                include: { product: true },
            });
        }
    }
    async complete(tenantId, id) {
        const reconciliation = await this.findOne(tenantId, id);
        if (!reconciliation)
            throw new Error('Reconciliation not found');
        if (reconciliation.status === 'COMPLETED') {
            throw new Error('Reconciliation already completed');
        }
        for (const item of reconciliation.items) {
            if (item.difference !== 0) {
                await this.prisma.forTenant(tenantId).stockMovement.create({
                    data: {
                        productId: item.productId,
                        movementType: 'ADJUSTMENT',
                        quantity: item.physicalCount,
                        reason: item.reason || 'RECONCILIATION',
                        notes: `Reconciliation adjustment: ${item.difference} units`,
                        reconciliationId: id,
                    },
                });
                await this.prisma.forTenant(tenantId).product.update({
                    where: { id: item.productId },
                    data: {
                        stock: item.physicalCount,
                    },
                });
            }
        }
        return this.prisma.forTenant(tenantId).reconciliation.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                totalDiscrepancies: reconciliation.items.filter(i => i.difference !== 0).length,
            },
        });
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map