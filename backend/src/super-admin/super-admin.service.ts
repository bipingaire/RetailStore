
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { AiService } from '../ai/ai.service';

@Injectable()
export class SuperAdminService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService
    ) { }

    async getDashboardData() {
        const products = await this.prisma.sharedCatalog.findMany({
            orderBy: { syncedAt: 'desc' },
            take: 100,
        });

        const tenants = await this.prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                TenantSubscriptions: true,
            }
        });

        const pendingItems = await this.prisma.pendingProductAddition.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' },
            include: {
                tenant: {
                    select: { storeName: true }
                }
            }
        });

        const subscriptions = await this.prisma.tenantSubscription.findMany();
        const transactions = await this.prisma.billingTransaction.findMany({
            orderBy: { transactionDate: 'desc' },
            take: 20,
            include: {
                tenant: { select: { storeName: true } }
            }
        });

        const websiteConfig = await this.prisma.masterWebsiteConfig.findFirst();

        return {
            products,
            tenants: tenants.map(t => ({
                ...t,
                subscriptionTier: t.TenantSubscriptions[0]?.planType || 'free',
            })),
            pendingItems,
            revenueData: {
                subscriptions,
                transactions,
            },
            websiteConfig,
        };
    }

    async approveProduct(pendingId: string) {
        const item = await this.prisma.pendingProductAddition.findUnique({
            where: { id: pendingId },
        });

        if (!item) throw new NotFoundException('Pending item not found');

        // Add to Global Catalog
        // Use SKU as UUID or extracted code? We'll use UUID for now as SharedCatalog ID is SKU string.
        // Assuming UPC/EAN is the SKU for simplicity or generate one.
        const sku = item.upcEanCode || item.id;

        const product = await this.prisma.sharedCatalog.upsert({
            where: { sku },
            update: {},
            create: {
                sku,
                productName: item.productName,
                category: item.categoryName,
                description: item.descriptionText,
                basePrice: 0, // Defaultor retrieval needed?
                imageUrl: item.imageUrl,
                tenantId: item.tenantId,
            }
        });

        // Mark as approved
        await this.prisma.pendingProductAddition.update({
            where: { id: pendingId },
            data: {
                status: 'approved',
                suggestedMatchProductId: product.sku
            }
        });

        return product;
    }

    async rejectProduct(pendingId: string) {
        return this.prisma.pendingProductAddition.update({
            where: { id: pendingId },
            data: { status: 'rejected' }
        });
    }

    async updateProduct(id: string, data: any) {
        return this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: {
                productName: data.name,
                category: data.category,
                description: data.description,
                imageUrl: data.image_url,
            }
        });
    }

    async enrichProduct(id: string) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });

        if (!product) throw new NotFoundException('Product not found in Global Catalog');

        // Parallel execution for speed
        const [description, imageUrl] = await Promise.all([
            this.aiService.generateProductDescription(product.productName, product.category),
            this.aiService.generateProductImage(product.productName, product.category)
        ]);

        return this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: {
                description: description || product.description,
                imageUrl: imageUrl || product.imageUrl,
                aiEnrichedAt: new Date(),
            }
        });
    }
}
