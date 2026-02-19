import { CampaignService } from './campaign.service';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    create(tenantId: string, body: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    findAll(tenantId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    update(tenantId: string, id: string, body: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    partialUpdate(tenantId: string, id: string, body: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        budget: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    delete(tenantId: string, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
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
        productId: string;
        discountType: string;
        startDate: Date;
        endDate: Date;
        batchId: string | null;
        title: string;
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
