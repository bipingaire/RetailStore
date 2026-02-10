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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startAuditSession(userId, notes) {
        return this.prisma.auditSession.create({
            data: {
                userId,
                notes,
                status: 'in-progress',
            },
        });
    }
    async addAuditCount(sessionId, productId, countedQuantity, reason) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        const variance = countedQuantity - product.stock;
        return this.prisma.auditCount.create({
            data: {
                auditSessionId: sessionId,
                productId,
                systemQuantity: product.stock,
                countedQuantity,
                variance,
                varianceReason: reason,
            },
        });
    }
    async completeAuditSession(sessionId) {
        const session = await this.prisma.auditSession.findUnique({
            where: { id: sessionId },
            include: { counts: true },
        });
        if (!session)
            throw new Error('Audit session not found');
        await this.prisma.$transaction(async (tx) => {
            for (const count of session.counts) {
                if (count.variance !== 0) {
                    await tx.inventoryAdjustment.create({
                        data: {
                            auditSessionId: sessionId,
                            productId: count.productId,
                            quantityChange: count.variance,
                            reason: count.varianceReason || 'Audit adjustment',
                        },
                    });
                    await tx.product.update({
                        where: { id: count.productId },
                        data: { stock: count.countedQuantity },
                    });
                }
            }
            await tx.auditSession.update({
                where: { id: sessionId },
                data: { status: 'completed', completedAt: new Date() },
            });
        });
        return this.getAuditSession(sessionId);
    }
    async getAuditSession(id) {
        return this.prisma.auditSession.findUnique({
            where: { id },
            include: {
                counts: { include: { product: true } },
                adjustments: { include: { product: true } },
            },
        });
    }
    async getAllAuditSessions() {
        return this.prisma.auditSession.findMany({
            include: { counts: true, adjustments: true },
            orderBy: { startedAt: 'desc' },
        });
    }
    async getVarianceReport() {
        const sessions = await this.prisma.auditSession.findMany({
            where: { status: 'completed' },
            include: { adjustments: { include: { product: true } } },
            orderBy: { completedAt: 'desc' },
            take: 10,
        });
        return sessions;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map