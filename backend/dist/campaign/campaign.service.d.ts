import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class CampaignService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    createCampaign(subdomain: string, data: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        name: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    updateCampaign(subdomain: string, id: string, data: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        name: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    deleteCampaign(subdomain: string, id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        name: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    listCampaigns(subdomain: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        name: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    getActiveCampaigns(subdomain: string): Promise<{
        products: any[];
        id: string;
        status: string;
        createdAt: Date;
        name: string;
        type: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    getActivePromotions(subdomain: string): Promise<({
        product: {
            category: string;
            id: string;
            name: string;
            price: import("src/generated/tenant-client/runtime/library").Decimal;
            imageUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        startDate: Date;
        endDate: Date;
        batchId: string | null;
        title: string;
        discountType: string;
        discountValue: import("src/generated/tenant-client/runtime/library").Decimal;
    })[]>;
    createPromotion(subdomain: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        startDate: Date;
        endDate: Date;
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
