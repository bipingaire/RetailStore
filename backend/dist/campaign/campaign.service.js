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
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let CampaignService = class CampaignService {
    constructor(tenantService, tenantPrisma) {
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
    }
    async createCampaign(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaign.create({
            data: {
                name: data.name,
                type: data.type || 'SOCIAL',
                status: data.status || 'DRAFT',
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                budget: data.budget,
            },
        });
    }
    async updateCampaign(subdomain, id, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.startDate !== undefined)
            updateData.startDate = new Date(data.startDate);
        if (data.endDate !== undefined)
            updateData.endDate = new Date(data.endDate);
        if (data.budget !== undefined)
            updateData.budget = data.budget;
        return client.campaign.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteCampaign(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaign.delete({ where: { id } });
    }
    async listCampaigns(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaign.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getActiveCampaigns(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const now = new Date();
        const activeCampaigns = await client.campaign.findMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    { startDate: null },
                    { startDate: { lte: now } },
                ],
                AND: [
                    {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: now } },
                        ]
                    }
                ]
            },
            orderBy: { createdAt: 'desc' },
        });
        if (activeCampaigns.length === 0)
            return [];
        const campaignIds = activeCampaigns.map(c => c.id);
        const links = await client.campaignProduct.findMany({
            where: { campaignId: { in: campaignIds } },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        imageUrl: true,
                        category: true,
                        isSellable: true,
                        stock: true,
                    }
                }
            }
        });
        const linksByCampaign = {};
        for (const link of links) {
            if (!linksByCampaign[link.campaignId])
                linksByCampaign[link.campaignId] = [];
            linksByCampaign[link.campaignId].push(link);
        }
        return activeCampaigns.map(c => ({
            ...c,
            products: (linksByCampaign[c.id] || []),
        }));
    }
    async getActivePromotions(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const now = new Date();
        return client.promotion.findMany({
            where: {
                startDate: { lte: now },
                endDate: { gte: now },
            },
            include: {
                product: {
                    select: { id: true, name: true, price: true, imageUrl: true, category: true },
                },
            },
            orderBy: { endDate: 'asc' },
        });
    }
    async createPromotion(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.promotion.create({
            data: {
                productId: data.store_inventory_id,
                batchId: data.batch_id,
                title: data.title,
                discountType: data.discount_type,
                discountValue: data.discount_value,
                startDate: new Date(),
                endDate: new Date(data.end_date),
            }
        });
    }
    async addSegmentProduct(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.campaignProduct.upsert({
            where: {
                campaignId_productId: {
                    campaignId: data.segment_id,
                    productId: data.store_inventory_id
                }
            },
            update: {
                highlightLabel: data.highlight_label
            },
            create: {
                campaignId: data.segment_id,
                productId: data.store_inventory_id,
                highlightLabel: data.highlight_label
            }
        });
    }
    async generateCampaignContent(data) {
        const openaiKey = process.env.OPENAI_API_KEY;
        const productNames = data.products.map((p) => p.name || 'product').slice(0, 5).join(', ');
        const campaignTitle = data.campaignTitle || 'Flash Sale';
        const campaignType = (data.campaignType || 'FLASH_SALE').replace(/_/g, ' ');
        const captionPost = `🎉 ${campaignType} Alert! 🚀\n\nCheck out amazing deals on ${productNames}!\n\nGet the best prices this week only. Don't miss out! #Sale #Deals #${campaignTitle.replace(/\s+/g, '')}`;
        if (!openaiKey) {
            return {
                post: captionPost,
                image: `https://placehold.co/1024x1024/1a3c5e/ffffff?text=${encodeURIComponent(campaignTitle)}`,
            };
        }
        try {
            const OpenAI = require('openai').default || require('openai');
            const client = new OpenAI({ apiKey: openaiKey });
            const prompt = `A vibrant, professional retail promotional poster for a "${campaignTitle}" campaign. Products featured: ${productNames}. Campaign type: ${campaignType}. Style: modern, colorful, eye-catching store advertisement with bold text areas, product showcase layout, bright background with sale badges. High quality commercial marketing photography style. No people, no text overlay.`;
            const response = await client.images.generate({
                model: 'dall-e-3',
                prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
            });
            const imageUrl = response.data?.[0]?.url || '';
            if (!imageUrl)
                throw new Error('No image URL returned from DALL-E');
            const fs = require('fs');
            const path = require('path');
            const crypto = require('crypto');
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'campaigns');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `poster_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.png`;
            const filePath = path.join(uploadDir, fileName);
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok)
                throw new Error(`Failed to fetch DALL-E image: ${imageResponse.statusText}`);
            const arrayBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(filePath, buffer);
            const localImageUrl = `/uploads/campaigns/${fileName}`;
            return {
                post: captionPost,
                image: localImageUrl,
            };
        }
        catch (err) {
            console.error('DALL-E generation or save error:', err?.message);
            return {
                post: captionPost,
                image: `https://placehold.co/1024x1024/1a3c5e/ffffff?text=${encodeURIComponent(campaignTitle)}`,
            };
        }
    }
};
exports.CampaignService = CampaignService;
exports.CampaignService = CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService])
], CampaignService);
//# sourceMappingURL=campaign.service.js.map