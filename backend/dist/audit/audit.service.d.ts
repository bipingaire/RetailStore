import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class AuditService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    startAuditSession(subdomain: string, userId: string, notes?: string): Promise<{
        id: string;
        userId: string;
        startedAt: Date;
        completedAt: Date | null;
        status: string;
        notes: string | null;
    }>;
    addAuditCount(subdomain: string, sessionId: string, productId: string, countedQuantity: number, reason?: string): Promise<{
        id: string;
        systemQuantity: number;
        countedQuantity: number;
        variance: number;
        varianceReason: string | null;
        createdAt: Date;
        auditSessionId: string;
        productId: string;
    }>;
    completeAuditSession(subdomain: string, sessionId: string): Promise<{
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
    getAuditSession(subdomain: string, id: string): Promise<{
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
    getAllAuditSessions(subdomain: string): Promise<({
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
    getVarianceReport(subdomain: string): Promise<({
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
    submitBulkAudit(subdomain: string, userId: string, items: {
        productId: string;
        quantity: number;
    }[], notes?: string): Promise<{
        success: boolean;
        varianceFound: number;
    }>;
}
