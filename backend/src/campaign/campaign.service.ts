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

    async listCampaigns(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.campaign.findMany({
            orderBy: { createdAt: 'desc' },
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
