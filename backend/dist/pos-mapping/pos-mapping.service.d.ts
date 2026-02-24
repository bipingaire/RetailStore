import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class PosMappingService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    findAll(subdomain: string): Promise<({
        product: {
            id: string;
            name: string;
            sku: string;
            imageUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
        tenantId: string;
    })[]>;
    updateMapping(subdomain: string, id: string, data: any): Promise<{
        product: {
            id: string;
            name: string;
            imageUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
        tenantId: string;
    }>;
    verifyMapping(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
        tenantId: string;
    }>;
}
