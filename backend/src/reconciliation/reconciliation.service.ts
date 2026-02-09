import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class ReconciliationService {
    constructor(private prisma: TenantPrismaService) { }

    // Start new reconciliation
    async create(tenantId: string, createdBy?: string) {
        return this.prisma.forTenant(tenantId).reconciliation.create({
            data: {
                status: 'IN_PROGRESS',
                createdBy,
            },
        });
    }

    // Get all reconciliations
    async findAll(tenantId: string) {
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

    // Get reconciliation by ID
    async findOne(tenantId: string, id: string) {
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

    // Add/Update item count in reconciliation
    async updateItem(
        tenantId: string,
        reconciliationId: string,
        productId: string,
        physicalCount: number,
        reason?: string,
        notes?: string,
    ) {
        // Get current system stock
        const product = await this.prisma.forTenant(tenantId).product.findUnique({
            where: { id: productId },
        });

        if (!product) throw new Error('Product not found');

        const difference = physicalCount - product.stock;

        // Check if item already exists
        const existing = await this.prisma.forTenant(tenantId).reconciliationItem.findFirst({
            where: {
                reconciliationId,
                productId,
            },
        });

        if (existing) {
            // Update existing
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
        } else {
            // Create new
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

    // Complete reconciliation and adjust inventory
    async complete(tenantId: string, id: string) {
        const reconciliation = await this.findOne(tenantId, id);

        if (!reconciliation) throw new Error('Reconciliation not found');
        if (reconciliation.status === 'COMPLETED') {
            throw new Error('Reconciliation already completed');
        }

        // Create stock movements for each discrepancy
        for (const item of reconciliation.items) {
            if (item.difference !== 0) {
                // Create stock movement
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

                // Update product stock
                await this.prisma.forTenant(tenantId).product.update({
                    where: { id: item.productId },
                    data: {
                        stock: item.physicalCount,
                    },
                });
            }
        }

        // Mark reconciliation as completed
        return this.prisma.forTenant(tenantId).reconciliation.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                totalDiscrepancies: reconciliation.items.filter(i => i.difference !== 0).length,
            },
        });
    }
}
