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
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    updateCampaign(subdomain: string, id: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    deleteCampaign(subdomain: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    listCampaigns(subdomain: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    getActiveCampaigns(subdomain: string): Promise<{
        products: any[];
        name: string;
        id: string;
        createdAt: Date;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    getActivePromotions(subdomain: string): Promise<({
        product: {
            category: string;
            imageUrl: string;
            name: string;
            id: string;
            price: import("src/generated/tenant-client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        productId: string;
        batchId: string | null;
        title: string;
        discountType: string;
        discountValue: import("src/generated/tenant-client/runtime/library").Decimal;
    })[]>;
    createPromotion(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        productId: string;
        batchId: string | null;
        title: string;
        discountType: string;
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
        campaignTitle?: string;
        campaignType?: string;
    }): Promise<{
        post: string;
        image: string;
    }>;
}
