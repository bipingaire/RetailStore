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
const tenant_service_1 = require("../tenant/tenant.service");
let AuditService = class AuditService {
    constructor(tenantPrisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.tenantService = tenantService;
    }
    async startAuditSession(subdomain, userId, notes) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.auditSession.create({
            data: {
                userId,
                notes,
                status: 'in-progress',
            },
        });
    }
    async addAuditCount(subdomain, sessionId, productId, countedQuantity, reason) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const product = await client.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        const variance = countedQuantity - product.stock;
        return client.auditCount.create({
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
    async completeAuditSession(subdomain, sessionId) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const session = await client.auditSession.findUnique({
            where: { id: sessionId },
            include: { counts: true },
        });
        if (!session)
            throw new Error('Audit session not found');
        await client.$transaction(async (tx) => {
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
        return this.getAuditSession(subdomain, sessionId);
    }
    async getAuditSession(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.auditSession.findUnique({
            where: { id },
            include: {
                counts: { include: { product: true } },
                adjustments: { include: { product: true } },
            },
        });
    }
    async getAllAuditSessions(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.auditSession.findMany({
            include: { counts: true, adjustments: true },
            orderBy: { startedAt: 'desc' },
        });
    }
    async getVarianceReport(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const sessions = await client.auditSession.findMany({
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
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], AuditService);
//# sourceMappingURL=audit.service.js.map