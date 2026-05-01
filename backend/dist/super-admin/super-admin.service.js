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
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const ai_service_1 = require("../ai/ai.service");
function standardizeCategory(cat) {
    if (!cat)
        return undefined;
    return cat.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
let SuperAdminService = class SuperAdminService {
    constructor(prisma, tenantPrisma, aiService) {
        this.prisma = prisma;
        this.tenantPrisma = tenantPrisma;
        this.aiService = aiService;
    }
    async broadcastUpdateToTenants(sku, data) {
        try {
            const tenants = await this.prisma.tenant.findMany({ where: { isActive: true } });
            const updateData = {};
            if (data.productName !== undefined)
                updateData.name = data.productName;
            if (data.category !== undefined)
                updateData.category = data.category;
            if (data.description !== undefined)
                updateData.description = data.description;
            if (data.imageUrl !== undefined)
                updateData.imageUrl = data.imageUrl;
            if (Object.keys(updateData).length === 0)
                return;
            await Promise.allSettled(tenants.map(async (tenant) => {
                try {
                    const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
                    await client.product.updateMany({
                        where: { sku },
                        data: updateData
                    });
                }
                catch (err) {
                    console.error(`Failed to broadcast update for SKU ${sku} to tenant ${tenant.storeName}:`, err);
                }
            }));
        }
        catch (error) {
            console.error('Failed to trigger broadcast updates:', error);
        }
    }
    async getGlobalProduct(id) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async getDashboardData() {
        const productsRaw = await this.prisma.sharedCatalog.findMany({
            orderBy: { syncedAt: 'desc' },
        });
        const products = productsRaw.sort((a, b) => {
            const aHasImage = !!a.imageUrl && a.imageUrl.trim() !== '';
            const bHasImage = !!b.imageUrl && b.imageUrl.trim() !== '';
            if (!aHasImage && bHasImage)
                return -1;
            if (aHasImage && !bHasImage)
                return 1;
            const aTime = a.syncedAt ? a.syncedAt.getTime() : 0;
            const bTime = b.syncedAt ? b.syncedAt.getTime() : 0;
            if (!aHasImage && !bHasImage) {
                return bTime - aTime;
            }
            else {
                return aTime - bTime;
            }
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
    async approveProduct(pendingId) {
        const item = await this.prisma.pendingProductAddition.findUnique({
            where: { id: pendingId },
        });
        if (!item)
            throw new common_1.NotFoundException('Pending item not found');
        const sku = item.upcEanCode || item.id;
        const product = await this.prisma.sharedCatalog.upsert({
            where: { sku },
            update: {},
            create: {
                sku,
                productName: item.productName,
                category: standardizeCategory(item.categoryName) || item.categoryName,
                description: item.descriptionText,
                basePrice: 0,
                imageUrl: item.imageUrl,
                tenantId: item.tenantId,
            }
        });
        await this.prisma.pendingProductAddition.update({
            where: { id: pendingId },
            data: {
                status: 'approved',
                suggestedMatchProductId: product.sku
            }
        });
        await this.broadcastUpdateToTenants(sku, {
            productName: item.productName,
            category: item.categoryName,
            description: item.descriptionText,
            imageUrl: item.imageUrl
        });
        return product;
    }
    async rejectProduct(pendingId) {
        return this.prisma.pendingProductAddition.update({
            where: { id: pendingId },
            data: { status: 'rejected' }
        });
    }
    async updateProduct(id, data) {
        const product = await this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: {
                productName: data.name,
                category: standardizeCategory(data.category) || data.category,
                description: data.description,
                imageUrl: data.image_url,
                syncedAt: new Date(),
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
    async uploadProductImage(id, imageUrl) {
        const product = await this.prisma.sharedCatalog.update({
            where: { sku: id },
            data: {
                imageUrl,
                syncedAt: new Date()
            }
        });
        await this.broadcastUpdateToTenants(id, { imageUrl });
        return product;
    }
    async enrichProduct(id) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found in Global Catalog');
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
    async getAiSuggestions(id) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.aiService.generateProductMetadata(product.productName, {
            currentCategory: product.category,
            currentDescription: product.description
        });
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_prisma_service_1.TenantPrismaService,
        ai_service_1.AiService])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map