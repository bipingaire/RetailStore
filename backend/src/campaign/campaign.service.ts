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

    async generateCampaignContent(data: { products: any[] }) {
        // Mock AI Generation
        const productNames = data.products.map((p) => p.name || 'our products').join(', ');

        return {
            post: `🎉 Flash Sale Alert! 🚀\n\nCheck out amazing deals on ${productNames}! \n\nGet 20% OFF this week only. Don't miss out! #Sale #Deals`,
            image: 'https://via.placeholder.com/600x400?text=Sale+Campaign',
        };
    }
}
