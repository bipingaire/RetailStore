import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { CreateStockMovementDto } from './dto/stock-movement.dto';

@Injectable()
export class InventoryService {
    constructor(private prisma: TenantPrismaService) { }

    // Record stock movement
    async createMovement(tenantId: string, dto: CreateStockMovementDto) {
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

        // Update product stock
        const product = await this.prisma.forTenant(tenantId).product.findUnique({
            where: { id: dto.productId },
        });

        if (product) {
            let newStock = product.stock;
            if (dto.movementType === 'IN') {
                newStock += dto.quantity;
            } else if (dto.movementType === 'OUT' || dto.movementType === 'LOSS') {
                newStock -= dto.quantity;
            } else if (dto.movementType === 'ADJUSTMENT') {
                newStock = dto.quantity; // Set to exact count
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

    // Get movement history
    async getMovements(tenantId: string, productId?: string, movementType?: string) {
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

    // Get inventory health metrics
    async getHealthMetrics(tenantId: string) {
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

    // Get low stock products
    async getLowStock(tenantId: string) {
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

    // Calculate inventory health score for a product
    async calculateHealthScore(tenantId: string, productId: string): Promise<number> {
        const product = await this.prisma.forTenant(tenantId).product.findUnique({
            where: { id: productId },
            include: {
                SaleItems: {
                    where: {
                        sale: {
                            createdAt: {
                                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                            },
                        },
                    },
                },
            },
        });

        if (!product) return 0;

        let score = 50; // Base score

        // Stock level score (0-30 points)
        if (product.stock === 0) {
            score -= 30;
        } else if (product.stock <= product.reorderLevel) {
            score -= 15;
        } else if (product.stock > product.reorderLevel * 3) {
            score -= 10; // Overstocked
        } else {
            score += 15; // Good stock level
        }

        // Sales velocity score (0-30 points)
        const salesLast30Days = product.SaleItems.length;
        if (salesLast30Days === 0) {
            score -= 20; // Not selling
        } else if (salesLast30Days < 5) {
            score -= 10; // Slow moving
        } else if (salesLast30Days > 20) {
            score += 20; // Fast moving
        } else {
            score += 10; // Average
        }

        // Expiry score (0-20 points)
        if (product.daysToExpiry !== null) {
            if (product.daysToExpiry <= 7) {
                score -= 20;
            } else if (product.daysToExpiry <= 15) {
                score -= 10;
            } else if (product.daysToExpiry <= 30) {
                score -= 5;
            }
        }

        return Math.max(0, Math.min(100, score));
    }
}
