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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let CampaignService = class CampaignService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        return this.prisma.forTenant(tenantId).campaign.create({
            data: {
                name: dto.name,
                description: dto.description,
                type: dto.type,
                discount: dto.discount,
                startDate: dto.startDate,
                endDate: dto.endDate,
                productIds: dto.productIds,
                socialPlatforms: dto.socialPlatforms || [],
            },
        });
    }
    async findAll(tenantId, status) {
        return this.prisma.forTenant(tenantId).campaign.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(tenantId, id) {
        const campaign = await this.prisma.forTenant(tenantId).campaign.findUnique({
            where: { id },
        });
        if (campaign && campaign.productIds.length > 0) {
            const products = await this.prisma.forTenant(tenantId).product.findMany({
                where: {
                    id: { in: campaign.productIds },
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    stock: true,
                    imageUrl: true,
                },
            });
            return {
                ...campaign,
                products,
            };
        }
        return campaign;
    }
    async pushToWebsite(tenantId, id) {
        const campaign = await this.prisma.forTenant(tenantId).campaign.findUnique({
            where: { id },
        });
        if (!campaign)
            throw new Error('Campaign not found');
        await Promise.all(campaign.productIds.map(productId => this.prisma.forTenant(tenantId).product.update({
            where: { id: productId },
            data: {
                price: {
                    multiply: 1 - Number(campaign.discount) / 100,
                },
            },
        })));
        return this.prisma.forTenant(tenantId).campaign.update({
            where: { id },
            data: {
                pushedToWebsite: true,
                status: 'ACTIVE',
            },
        });
    }
    async pushToSocial(tenantId, id) {
        const campaign = await this.findOne(tenantId, id);
        if (!campaign)
            throw new Error('Campaign not found');
        const content = await this.generateMarketingContent(campaign);
        return this.prisma.forTenant(tenantId).campaign.update({
            where: { id },
            data: {
                pushedToSocial: true,
                generatedContent: content,
            },
        });
    }
    async getSuggestions(tenantId) {
        const suggestions = [];
        const slowMoving = await this.prisma.forTenant(tenantId).product.findMany({
            where: { slowMoving: true, isActive: true },
            take: 10,
        });
        if (slowMoving.length > 0) {
            suggestions.push({
                type: 'OVERSTOCK',
                name: 'Clearance Sale - Slow Moving Items',
                description: `${slowMoving.length} slow-moving products could benefit from a discount campaign`,
                suggestedDiscount: 20,
                productIds: slowMoving.map(p => p.id),
                products: slowMoving,
            });
        }
        const nearExpiry = await this.prisma.forTenant(tenantId).product.findMany({
            where: {
                daysToExpiry: { lte: 15 },
                isActive: true,
            },
            take: 10,
        });
        if (nearExpiry.length > 0) {
            suggestions.push({
                type: 'EXPIRY_CLEARANCE',
                name: 'Urgent: Near-Expiry Clearance',
                description: `${nearExpiry.length} products expiring soon - clear them fast!`,
                suggestedDiscount: 30,
                productIds: nearExpiry.map(p => p.id),
                products: nearExpiry,
            });
        }
        return suggestions;
    }
    async generateMarketingContent(campaign) {
        const productCount = campaign.productIds.length;
        const discount = campaign.discount;
        let content = `🎉 *${campaign.name}* 🎉\n\n`;
        if (campaign.type === 'FLASH_SALE') {
            content += `⚡ Flash Sale Alert! Get ${discount}% OFF on ${productCount} amazing products!\n`;
        }
        else if (campaign.type === 'EXPIRY_CLEARANCE') {
            content += `🔥 Clearance Sale! Save ${discount}% before they're gone!\n`;
        }
        else if (campaign.type === 'OVERSTOCK') {
            content += `💰 Massive Savings! ${discount}% OFF on selected items!\n`;
        }
        content += `\n📅 Hurry! Valid until ${new Date(campaign.endDate).toLocaleDateString()}\n`;
        content += `\n🛒 Shop now and save big! 💸`;
        return content;
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map