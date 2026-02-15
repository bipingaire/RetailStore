import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CampaignService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    createCampaign(subdomain: string, data: any): Promise<{
        id: string;
        startDate: Date | null;
        endDate: Date | null;
        createdAt: Date;
        status: string;
        name: string;
        type: string;
        budget: import("dist/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    listCampaigns(subdomain: string): Promise<{
        id: string;
        startDate: Date | null;
        endDate: Date | null;
        createdAt: Date;
        status: string;
        name: string;
        type: string;
        budget: import("dist/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    generateCampaignContent(data: {
        products: any[];
    }): Promise<{
        post: string;
        image: string;
    }>;
}
