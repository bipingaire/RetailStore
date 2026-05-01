import { PrismaService } from '../prisma/prisma.service';
export declare class MasterCatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    syncProduct(tenantId: string, product: any): Promise<void>;
    upsertProduct(data: {
        sku: string;
        productName: string;
        category?: string;
        description?: string;
        basePrice: number;
        imageUrl?: string;
        tenantId: string;
    }): Promise<{
        category: string | null;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        tenantId: string;
        productName: string;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    getSharedCatalog(filters?: {
        category?: string;
        search?: string;
    }): Promise<{
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
