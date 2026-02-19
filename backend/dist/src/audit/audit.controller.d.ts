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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    rejectSession(subdomain: string, id: string): Promise<{
        id: string;
        status: string;
        userId: string;
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    getSession(subdomain: string, id: string): Promise<{
        counts: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
    })[]>;
    getVariances(subdomain: string): Promise<({
        adjustments: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                barcode: string | null;
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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
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
