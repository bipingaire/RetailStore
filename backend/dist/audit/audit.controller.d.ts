import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    startSession(subdomain: string, body: {
        userId: string;
        notes?: string;
    }): Promise<{
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    addCount(subdomain: string, id: string, body: {
        productId: string;
        countedQuantity: number;
        reason?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        systemQuantity: number;
        countedQuantity: number;
        variance: number;
        varianceReason: string | null;
        auditSessionId: string;
    }>;
    completeSession(subdomain: string, id: string): Promise<{
        counts: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            systemQuantity: number;
            countedQuantity: number;
            variance: number;
            varianceReason: string | null;
            auditSessionId: string;
        })[];
        adjustments: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            notes: string | null;
            auditSessionId: string | null;
            quantityChange: number;
            reason: string;
        })[];
    } & {
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    rejectSession(subdomain: string, id: string): Promise<{
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    getSession(subdomain: string, id: string): Promise<{
        counts: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            systemQuantity: number;
            countedQuantity: number;
            variance: number;
            varianceReason: string | null;
            auditSessionId: string;
        })[];
        adjustments: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            notes: string | null;
            auditSessionId: string | null;
            quantityChange: number;
            reason: string;
        })[];
    } & {
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    getAllSessions(subdomain: string): Promise<({
        counts: {
            id: string;
            createdAt: Date;
            productId: string;
            systemQuantity: number;
            countedQuantity: number;
            variance: number;
            varianceReason: string | null;
            auditSessionId: string;
        }[];
        adjustments: {
            id: string;
            createdAt: Date;
            productId: string;
            notes: string | null;
            auditSessionId: string | null;
            quantityChange: number;
            reason: string;
        }[];
    } & {
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    })[]>;
    getVariances(subdomain: string): Promise<({
        adjustments: ({
            product: {
                category: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isSellable: boolean;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            notes: string | null;
            auditSessionId: string | null;
            quantityChange: number;
            reason: string;
        })[];
    } & {
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    })[]>;
    submitBulk(subdomain: string, body: {
        userId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
        notes?: string;
    }): Promise<{
        success: boolean;
        varianceFound: number;
    }>;
}
