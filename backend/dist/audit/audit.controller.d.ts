import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    startSession(subdomain: string, body: {
        userId: string;
        notes?: string;
    }): Promise<{
        id: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: string;
        notes: string | null;
    }>;
    addCount(subdomain: string, id: string, body: {
        productId: string;
        countedQuantity: number;
        reason?: string;
    }): Promise<{
        id: string;
        systemQuantity: number;
        countedQuantity: number;
        variance: number;
        varianceReason: string | null;
        createdAt: Date;
        auditSessionId: string;
        productId: string;
    }>;
    completeSession(subdomain: string, id: string): Promise<{
        counts: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            systemQuantity: number;
            countedQuantity: number;
            variance: number;
            varianceReason: string | null;
            createdAt: Date;
            auditSessionId: string;
            productId: string;
        })[];
        adjustments: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            auditSessionId: string | null;
            productId: string;
            quantityChange: number;
            reason: string;
        })[];
    } & {
        id: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: string;
        notes: string | null;
    }>;
    getSession(subdomain: string, id: string): Promise<{
        counts: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            systemQuantity: number;
            countedQuantity: number;
            variance: number;
            varianceReason: string | null;
            createdAt: Date;
            auditSessionId: string;
            productId: string;
        })[];
        adjustments: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            auditSessionId: string | null;
            productId: string;
            quantityChange: number;
            reason: string;
        })[];
    } & {
        id: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: string;
        notes: string | null;
    }>;
    getAllSessions(subdomain: string): Promise<({
        counts: {
            id: string;
            systemQuantity: number;
            countedQuantity: number;
            variance: number;
            varianceReason: string | null;
            createdAt: Date;
            auditSessionId: string;
            productId: string;
        }[];
        adjustments: {
            id: string;
            notes: string | null;
            createdAt: Date;
            auditSessionId: string | null;
            productId: string;
            quantityChange: number;
            reason: string;
        }[];
    } & {
        id: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: string;
        notes: string | null;
    })[]>;
    getVariances(subdomain: string): Promise<({
        adjustments: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                updatedAt: Date;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            auditSessionId: string | null;
            productId: string;
            quantityChange: number;
            reason: string;
        })[];
    } & {
        id: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: string;
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
