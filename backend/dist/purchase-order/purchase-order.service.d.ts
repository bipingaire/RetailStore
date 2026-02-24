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
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                category: string | null;
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
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    getPurchaseOrder(subdomain: string, id: string): Promise<{
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                category: string | null;
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
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    getAllPurchaseOrders(subdomain: string, status?: string): Promise<({
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
        items: {
            id: string;
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    })[]>;
    updateStatus(subdomain: string, id: string, status: string): Promise<{
        id: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    sendPurchaseOrder(subdomain: string, id: string): Promise<{
        id: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    receivePurchaseOrder(subdomain: string, id: string): Promise<{
        vendor: {
            id: string;
            name: string;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            isActive: boolean;
        };
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                sku: string;
                category: string | null;
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
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        notes: string | null;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
}
