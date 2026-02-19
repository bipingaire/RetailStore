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
        tenantId: string;
        sku: string;
        productName: string;
        category: string | null;
        description: string | null;
        basePrice: import("src/generated/master-client/runtime/library").Decimal;
        imageUrl: string | null;
        aiEnrichedAt: Date | null;
        syncedAt: Date;
    }>;
    getSharedCatalog(filters?: {
        category?: string;
        search?: string;
    }): Promise<{
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
