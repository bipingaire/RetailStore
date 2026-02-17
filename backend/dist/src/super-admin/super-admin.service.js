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
const ai_service_1 = require("../ai/ai.service");
let SuperAdminService = class SuperAdminService {
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
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
                category: item.categoryName,
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
        return product;
    }
    async rejectProduct(pendingId) {
        return this.prisma.pendingProductAddition.update({
            where: { id: pendingId },
            data: { status: 'rejected' }
        });
    }
    async updateProduct(id, data) {
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
    async enrichProduct(id) {
        const product = await this.prisma.sharedCatalog.findUnique({
            where: { sku: id },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found in Global Catalog');
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
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map