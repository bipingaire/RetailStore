
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SuperAdminService {
    constructor(
        private prisma: PrismaService,
        private tenantPrisma: TenantPrismaService,
        private aiService: AiService
    ) { }

    private async broadcastUpdateToTenants(sku: string, data: { productName?: string; category?: string; description?: string; imageUrl?: string; brandName?: string }) {
        try {
            // Get all active tenants map to their database URL
            const tenants = await this.prisma.tenant.findMany({ where: { isActive: true } });
            
            // Map SharedCatalog fields to Tenant Product fields
            const updateData: any = {};
            if (data.productName !== undefined) updateData.name = data.productName;
            if (data.category !== undefined) updateData.category = data.category;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
            
            if (Object.keys(updateData).length === 0) return;

            // Update each active tenant's product ledger if they carry the item
            await Promise.allSettled(tenants.map(async (tenant) => {
                try {
                    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
                    await client.product.updateMany({
                        where: { sku },
                        data: updateData
                    });
                } catch (err) {
                    console.error(`Failed to broadcast update for SKU ${sku} to tenant ${tenant.storeName}:`, err);
                }
            }));
        } catch (error) {
            console.error('Failed to trigger broadcast updates:', error);
        }
    }

    async getGlobalProduct(id: string) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async getDashboardData() {
        const products = await this.prisma.sharedCatalog.findMany({
            // @ts-ignore: Prisma supports nulls: 'last' but exact generated typings may reject the object form here
            orderBy: { syncedAt: { sort: 'desc', nulls: 'last' } },
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

        // Broadcast the new enriched data down to any tenants who already blindly created it
        await this.broadcastUpdateToTenants(sku, {
            productName: item.productName,
            category: item.categoryName,
            description: item.descriptionText,
            imageUrl: item.imageUrl
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
        const product = await this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: {
                productName: data.name,
                category: data.category,
                description: data.description,
                imageUrl: data.image_url,
                // Assuming schema supports brandName, otherwise this will cause Prisma errors.
                // Looking at pending-item schema mapping, brandName might differ or be missing, so keeping it safe
                ...(data.brandName ? { brandName: data.brandName } : {})
            }
        });

        await this.broadcastUpdateToTenants(id, {
            productName: product.productName,
            category: product.category,
            description: product.description,
            imageUrl: product.imageUrl
        });

        return product;
    }

    async uploadProductImage(id: string, imageUrl: string) {
        const product = await this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: { imageUrl }
        });

        await this.broadcastUpdateToTenants(id, { imageUrl });
        
        return product;
    }

    async enrichProduct(id: string) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });

        if (!product) throw new NotFoundException('Product not found in Global Catalog');

        const description = await this.aiService.generateProductDescription(product.productName, product.category);

        const updated = await this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: {
                description: description || product.description,
                aiEnrichedAt: new Date(),
            }
        });

        await this.broadcastUpdateToTenants(id, {
            description: updated.description,
        });

        return updated;
    }

    async getAiSuggestions(id: string) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });

        if (!product) throw new NotFoundException('Product not found');

        return this.aiService.generateProductMetadata(product.productName, {
            currentCategory: product.category,
            currentDescription: product.description
        });
    }
}
