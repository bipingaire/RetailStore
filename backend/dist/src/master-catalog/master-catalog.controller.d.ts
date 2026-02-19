import { MasterCatalogService } from './master-catalog.service';
export declare class MasterCatalogController {
    private masterCatalog;
    constructor(masterCatalog: MasterCatalogService);
    getSharedCatalog(category?: string, search?: string): Promise<{
        tenantId: string;
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }[]>;
}
