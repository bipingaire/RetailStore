import { PosMappingService } from './pos-mapping.service';
export declare class PosMappingController {
    private readonly posMappingService;
    constructor(posMappingService: PosMappingService);
    findAll(tenantId: string): Promise<({
        product: {
            name: string;
            id: string;
            sku: string;
            imageUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
    })[]>;
    update(tenantId: string, id: string, body: any): Promise<{
        product: {
            name: string;
            id: string;
            imageUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
    verify(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        posItemName: string;
        matchedInventoryId: string;
        lastSoldPrice: import("src/generated/tenant-client/runtime/library").Decimal;
        confidenceScore: import("src/generated/tenant-client/runtime/library").Decimal | null;
    }>;
}
