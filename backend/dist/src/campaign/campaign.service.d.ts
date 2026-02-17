import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CampaignService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    createCampaign(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    updateCampaign(subdomain: string, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    deleteCampaign(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    listCampaigns(subdomain: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    generateCampaignContent(data: {
        products: any[];
    }): Promise<{
        post: string;
        image: string;
    }>;
}
