import { PrismaService } from '../prisma/prisma.service';
export declare class MasterCatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    syncProduct(tenantId: string, product: any): Promise<void>;
    getSharedCatalog(filters?: {
        category?: string;
        search?: string;
    }): Promise<{
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
