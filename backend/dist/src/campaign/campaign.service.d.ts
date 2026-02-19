import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CampaignService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    createCampaign(subdomain: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    updateCampaign(subdomain: string, id: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    deleteCampaign(subdomain: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    listCampaigns(subdomain: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    createPromotion(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        discountType: string;
        startDate: Date;
        endDate: Date;
        batchId: string | null;
        title: string;
        discountValue: import("src/generated/tenant-client/runtime/library").Decimal;
    }>;
    addSegmentProduct(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        campaignId: string;
        highlightLabel: string | null;
    }>;
    generateCampaignContent(data: {
        products: any[];
    }): Promise<{
        post: string;
        image: string;
    }>;
}
