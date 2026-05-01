import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class AuditService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    startAuditSession(subdomain: string, userId: string, notes?: string): Promise<{
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    addAuditCount(subdomain: string, sessionId: string, productId: string, countedQuantity: number, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        systemQuantity: number;
        countedQuantity: number;
        variance: number;
        varianceReason: string | null;
        auditSessionId: string;
    }>;
    completeAuditSession(subdomain: string, sessionId: string): Promise<{
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
    rejectAuditSession(subdomain: string, sessionId: string): Promise<{
        id: string;
        status: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    getAuditSession(subdomain: string, id: string): Promise<{
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
    getAllAuditSessions(subdomain: string): Promise<({
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
    getVarianceReport(subdomain: string): Promise<({
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
    submitBulkAudit(subdomain: string, userId: string, items: {
        productId: string;
        quantity: number;
    }[], notes?: string): Promise<{
        success: boolean;
        varianceFound: number;
    }>;
}
