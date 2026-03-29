import { PosMappingService } from './pos-mapping.service';
export declare class PosMappingController {
    private readonly posMappingService;
    constructor(posMappingService: PosMappingService);
    findAll(tenantId: string): Promise<({
        product: {
            sku: string;
            imageUrl: string;
            name: string;
            id: string;
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
    })[]>;
    update(tenantId: string, id: string, body: any): Promise<{
        product: {
            imageUrl: string;
            name: string;
            id: string;
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    verify(tenantId: string, id: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
}
