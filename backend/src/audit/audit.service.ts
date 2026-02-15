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
    async submitBulkAudit(subdomain: string, userId: string, items: { productId: string; quantity: number }[], notes?: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.$transaction(async (tx) => {
            // 1. Create Session
            const session = await tx.auditSession.create({
                data: {
                    userId,
                    notes,
                    status: 'in-progress', // Will complete immediately, but good for tracking
                },
            });

            // 2. Process Items
            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) continue; // Skip invalid products

                const variance = item.quantity - product.stock;

                // Record Count
                await tx.auditCount.create({
                    data: {
                        auditSessionId: session.id,
                        productId: item.productId,
                        systemQuantity: product.stock,
                        countedQuantity: item.quantity,
                        variance,
                        varianceReason: variance !== 0 ? 'Bulk Audit Adjustment' : null,
                    },
                });

                // Update Inventory if variance
                if (variance !== 0) {
                    await tx.inventoryAdjustment.create({
                        data: {
                            auditSessionId: session.id,
                            productId: item.productId,
                            quantityChange: variance,
                            reason: 'Bulk Audit',
                        },
                    });

                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: item.quantity },
                    });
                }
            }

            // 3. Complete Session
            const completedSession = await tx.auditSession.update({
                where: { id: session.id },
                data: { status: 'completed', completedAt: new Date() },
                include: { counts: true }
            });

            return { success: true, varianceFound: completedSession.counts.filter(c => c.variance !== 0).length };
        });
    }
}
