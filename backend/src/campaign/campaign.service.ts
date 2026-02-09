import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { CreateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignService {
    constructor(private prisma: TenantPrismaService) { }

    // Create new campaign
    async create(tenantId: string, dto: CreateCampaignDto) {
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

    // Get all campaigns
    async findAll(tenantId: string, status?: string) {
        return this.prisma.forTenant(tenantId).campaign.findMany({
            where: status ? { status } : {},
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get campaign by ID
    async findOne(tenantId: string, id: string) {
        const campaign = await this.prisma.forTenant(tenantId).campaign.findUnique({
            where: { id },
        });

        // Fetch product details
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

    // Push campaign to website (apply discounts)
    async pushToWebsite(tenantId: string, id: string) {
        const campaign = await this.prisma.forTenant(tenantId).campaign.findUnique({
            where: { id },
        });

        if (!campaign) throw new Error('Campaign not found');

        // Apply discount to all products in campaign
        await Promise.all(
            campaign.productIds.map(productId =>
                this.prisma.forTenant(tenantId).product.update({
                    where: { id: productId },
                    data: {
                        // Store original price in description or add discount field
                        // For now, reduce price by discount percentage
                        price: {
                            multiply: 1 - Number(campaign.discount) / 100,
                        },
                    },
                }),
            ),
        );

        // Mark campaign as pushed to website
        return this.prisma.forTenant(tenantId).campaign.update({
            where: { id },
            data: {
                pushedToWebsite: true,
                status: 'ACTIVE',
            },
        });
    }

    // Push campaign to social media
    async pushToSocial(tenantId: string, id: string) {
        const campaign = await this.findOne(tenantId, id);

        if (!campaign) throw new Error('Campaign not found');

        // Generate marketing content
        const content = await this.generateMarketingContent(campaign);

        // Mark as pushed (actual integration would happen here)
        return this.prisma.forTenant(tenantId).campaign.update({
            where: { id },
            data: {
                pushedToSocial: true,
                generatedContent: content,
            },
        });
    }

    // Generate AI-powered campaign suggestions
    async getSuggestions(tenantId: string) {
        const suggestions = [];

        // Get slow-moving products
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

        // Get near-expiry products
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

    // Generate marketing content for social media
    private async generateMarketingContent(campaign: any): Promise<string> {
        const productCount = campaign.productIds.length;
        const discount = campaign.discount;

        let content = `🎉 *${campaign.name}* 🎉\n\n`;

        if (campaign.type === 'FLASH_SALE') {
            content += `⚡ Flash Sale Alert! Get ${discount}% OFF on ${productCount} amazing products!\n`;
        } else if (campaign.type === 'EXPIRY_CLEARANCE') {
            content += `🔥 Clearance Sale! Save ${discount}% before they're gone!\n`;
        } else if (campaign.type === 'OVERSTOCK') {
            content += `💰 Massive Savings! ${discount}% OFF on selected items!\n`;
        }

        content += `\n📅 Hurry! Valid until ${new Date(campaign.endDate).toLocaleDateString()}\n`;
        content += `\n🛒 Shop now and save big! 💸`;

        return content;
    }
}
