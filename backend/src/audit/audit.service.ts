import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class AuditService {
    constructor(
        private readonly tenantPrisma: TenantPrismaService,
        private readonly tenantService: TenantService,
    ) { }

    async startAuditSession(subdomain: string, userId: string, notes?: string) {
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

    async addAuditCount(subdomain: string, sessionId: string, productId: string, countedQuantity: number, reason?: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const product = await client.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');

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

    async completeAuditSession(subdomain: string, sessionId: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const session = await client.auditSession.findUnique({
            where: { id: sessionId },
            include: { counts: true },
        });

        if (!session) throw new Error('Audit session not found');

        await client.$transaction(async (tx) => {
            // Apply inventory adjustments
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

    async getAuditSession(subdomain: string, id: string) {
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

    async getAllAuditSessions(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.auditSession.findMany({
            include: { counts: true, adjustments: true },
            orderBy: { startedAt: 'desc' },
        });
    }

    async getVarianceReport(subdomain: string) {
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
}
