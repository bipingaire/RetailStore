import { CampaignService } from './campaign.service';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    create(tenantId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    getActivePromotions(tenantId: string): Promise<({
        product: {
            id: string;
            name: string;
            category: string;
            price: import("src/generated/tenant-client/runtime/library").Decimal;
            imageUrl: string;
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
    getActiveCampaigns(tenantId: string): Promise<{
        products: any[];
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    update(tenantId: string, id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    partialUpdate(tenantId: string, id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    delete(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    generate(body: {
        products: any[];
    }): Promise<{
        post: string;
        image: string;
    }>;
    createPromotion(tenantId: string, body: any): Promise<{
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
    attachProduct(tenantId: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        campaignId: string;
        highlightLabel: string | null;
    }>;
}
