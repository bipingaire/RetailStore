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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
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
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
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
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
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
    getAuditSession(subdomain: string, id: string): Promise<{
        counts: ({
            product: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
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
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
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
        notes: string | null;
        startedAt: Date;
        completedAt: Date | null;
    })[]>;
    getVarianceReport(subdomain: string): Promise<({
        adjustments: ({
            product: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
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
}
