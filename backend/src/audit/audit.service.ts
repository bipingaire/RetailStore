import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class AuditService {
    constructor(private readonly prisma: TenantPrismaService) { }

    async startAuditSession(userId: string, notes?: string) {
        return this.prisma.auditSession.create({
            data: {
                userId,
                notes,
                status: 'in-progress',
            },
        });
    }

    async addAuditCount(sessionId: string, productId: string, countedQuantity: number, reason?: string) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');

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

    async completeAuditSession(sessionId: string) {
        const session = await this.prisma.auditSession.findUnique({
            where: { id: sessionId },
            include: { counts: true },
        });

        if (!session) throw new Error('Audit session not found');

        await this.prisma.$transaction(async (tx) => {
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

        return this.getAuditSession(sessionId);
    }

    async getAuditSession(id: string) {
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
}
