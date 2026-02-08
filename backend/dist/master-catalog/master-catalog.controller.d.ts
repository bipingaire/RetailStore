import { MasterCatalogService } from './master-catalog.service';
export declare class MasterCatalogController {
    private masterCatalog;
    constructor(masterCatalog: MasterCatalogService);
    getSharedCatalog(category?: string, search?: string): Promise<{
        sku: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        syncedAt: Date;
        tenantId: string;
    }[]>;
}
