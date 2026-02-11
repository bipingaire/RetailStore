import { CampaignService } from './campaign.service';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    create(tenantId: string, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("dist/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        startDate: Date | null;
        endDate: Date | null;
        type: string;
        budget: import("dist/generated/tenant-client/runtime/library").Decimal | null;
    }[]>;
    generate(body: {
        products: any[];
    }): Promise<{
        post: string;
        image: string;
    }>;
}
