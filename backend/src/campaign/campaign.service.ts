import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class CampaignService {
    constructor(
        private tenantService: TenantService,
        private tenantPrisma: TenantPrismaService,
    ) { }

    async createCampaign(subdomain: string, data: any) {
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

    async updateCampaign(subdomain: string, id: string, data: any) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
        if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
        if (data.budget !== undefined) updateData.budget = data.budget;

        return client.campaign.update({
            where: { id },
            data: updateData,
        });
    }

    async deleteCampaign(subdomain: string, id: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.campaign.delete({ where: { id } });
    }

    async listCampaigns(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.campaign.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async getActiveCampaigns(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const now = new Date();

        // Step 1: get active campaigns
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

        if (activeCampaigns.length === 0) return [];

        // Step 2: get all campaignProduct links for those campaigns with product details
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

        // Step 3: group links by campaignId and attach to campaigns
        const linksByCampaign: Record<string, any[]> = {};
        for (const link of links) {
            if (!linksByCampaign[link.campaignId]) linksByCampaign[link.campaignId] = [];
            linksByCampaign[link.campaignId].push(link);
        }

        return activeCampaigns.map(c => ({
            ...c,
            products: (linksByCampaign[c.id] || []),
        }));
    }

    async getActivePromotions(subdomain: string) {
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

    async createPromotion(subdomain: string, data: any) {
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

    async addSegmentProduct(subdomain: string, data: any) {
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

    async generateCampaignContent(data: { products: any[], campaignTitle?: string, campaignType?: string }) {
        const openaiKey = process.env.OPENAI_API_KEY;
        const productNames = data.products.map((p) => p.name || 'product').slice(0, 5).join(', ');
        const campaignTitle = data.campaignTitle || 'Flash Sale';
        const campaignType = (data.campaignType || 'FLASH_SALE').replace(/_/g, ' ');
        let captionPost = `🎉 ${campaignType} Alert! 🚀\n\nCheck out amazing deals on ${productNames}!\n\nGet the best prices this week only. Don't miss out! #Sale #Deals #${campaignTitle.replace(/\s+/g, '')}`;

        if (!openaiKey) {
            return {
                post: captionPost,
                image: `https://placehold.co/1024x1024/1a3c5e/ffffff?text=${encodeURIComponent(campaignTitle)}`,
            };
        }

        try {
            const OpenAI = require('openai').default || require('openai');
            const client = new OpenAI({ apiKey: openaiKey });

            // 1. Generate Advanced Copywriting Caption
            try {
                const chatResponse = await client.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an elite conversion copywriting expert specializing in high-performing retail social media advertisements. 
Your goal is to write a highly compelling, emotionally resonant, and action-oriented social media caption for a retail campaign.
Structure the caption with:
1. **A Killer Hook**: Scroll-stopping first line using bold claims, a relatable question, or immediate value.
2. **The Offer/Urgency**: Clarify the specific campaign (e.g. FLASH SALE, HOLIDAY MARKDOWN) and build strong FOMO.
3. **Product Highlights**: Emphasize benefits, value propositions, and sensory appeal of the featured products.
4. **Friction-Free Call To Action**: Tell the customer exactly how to claim the offer immediately.
5. **Formatting**: Use emojis strategically, keep line spacing clean, and include relevant high-reach hashtags. Keep total length under 180 words.`
                        },
                        {
                            role: 'user',
                            content: `Create an advanced promotional caption for the following retail campaign:
- Campaign Title: "${campaignTitle}"
- Campaign Type: "${campaignType}"
- Featured Products: ${productNames}

Emphasize immediate value, premium appeal, and strong urgency to buy right now.`
                        }
                    ],
                    temperature: 0.82,
                    max_tokens: 350
                });
                if (chatResponse.choices?.[0]?.message?.content) {
                    captionPost = chatResponse.choices[0].message.content.trim();
                }
            } catch (copyErr: any) {
                console.warn('Failed to generate advanced copy, falling back to default template:', copyErr?.message);
            }

            // 2. Generate Advanced Studio Backdrop Prompt for DALL-E 3
            const prompt = `A ultra-premium, commercial studio advertising poster backdrop for a retail "${campaignTitle}" campaign. Showcase products: ${productNames}. Staged elegantly on a floating sleek minimalist marble pedestal, surrounded by abstract high-end 3D geometric shapes, translucent glassmorphic panels, and warm volumetric studio lighting. The aesthetic is clean, luxurious, and highly photorealistic, with a sophisticated professional color palette (deep slate, rose gold accents, matte obsidian, and soft amber glow). Cinematic depth of field, sharp highlights, and realistic soft shadows. Strictly clean and polished background with perfect empty space for text overlay. Clean composition, absolutely NO people, NO distorted text or AI gibberish.`;

            const response = await client.images.generate({
                model: 'dall-e-3',
                prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
            });

            const imageUrl = response.data?.[0]?.url || '';
            if (!imageUrl) throw new Error('No image URL returned from DALL-E');

            // Download the image to persist it locally
            const fs = require('fs');
            const path = require('path');
            const crypto = require('crypto');
            
            // Use process.cwd() to target the project root reliably
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'campaigns');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `poster_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.png`;
            const filePath = path.join(uploadDir, fileName);

            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) throw new Error(`Failed to fetch DALL-E image: ${imageResponse.statusText}`);
            const arrayBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(filePath, buffer);

            const localImageUrl = `/uploads/campaigns/${fileName}`;

            return {
                post: captionPost,
                image: localImageUrl,
            };
        } catch (err: any) {
            console.error('DALL-E generation or save error:', err?.message);
            return {
                post: captionPost,
                image: `https://placehold.co/1024x1024/1a3c5e/ffffff?text=${encodeURIComponent(campaignTitle)}`,
            };
        }
    }
}
