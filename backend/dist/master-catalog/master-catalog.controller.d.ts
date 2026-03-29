import { MasterCatalogService } from './master-catalog.service';
export declare class MasterCatalogController {
    private masterCatalog;
    constructor(masterCatalog: MasterCatalogService);
    getSharedCatalog(category?: string, search?: string): Promise<{
        sku: string;
        productName: string;
        category: string;
        description: string;
        basePrice: number;
        imageUrl: string;
    }[]>;
}
