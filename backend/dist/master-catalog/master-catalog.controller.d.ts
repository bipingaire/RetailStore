import { MasterCatalogService } from './master-catalog.service';
export declare class MasterCatalogController {
    private masterCatalog;
    constructor(masterCatalog: MasterCatalogService);
    getSharedCatalog(category?: string, search?: string): Promise<{
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }[]>;
}
