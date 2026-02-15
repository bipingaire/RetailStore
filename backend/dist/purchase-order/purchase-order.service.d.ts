import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class PurchaseOrderService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    createPurchaseOrder(subdomain: string, vendorId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>, notes?: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                category: string | null;
                description: string | null;
                sku: string;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        updatedAt: Date;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    getPurchaseOrder(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                category: string | null;
                description: string | null;
                sku: string;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        updatedAt: Date;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    getAllPurchaseOrders(subdomain: string, status?: string): Promise<({
        items: {
            id: string;
            productId: string;
            quantity: number;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        }[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        updatedAt: Date;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    })[]>;
    updateStatus(subdomain: string, id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        updatedAt: Date;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    sendPurchaseOrder(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        updatedAt: Date;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    receivePurchaseOrder(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                category: string | null;
                description: string | null;
                sku: string;
                price: import("dist/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("dist/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            unitCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("dist/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        vendorId: string;
        totalAmount: import("dist/generated/tenant-client/runtime/library").Decimal;
        updatedAt: Date;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
}
