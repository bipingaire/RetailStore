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
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
        };
        items: ({
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
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    getPurchaseOrder(subdomain: string, id: string): Promise<{
        vendor: {
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
        };
        items: ({
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
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    getAllPurchaseOrders(subdomain: string, status?: string): Promise<({
        vendor: {
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        sentAt: Date | null;
        receivedAt: Date | null;
    })[]>;
    updateStatus(subdomain: string, id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    sendPurchaseOrder(subdomain: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
    receivePurchaseOrder(subdomain: string, id: string): Promise<{
        vendor: {
            email: string | null;
            name: string;
            id: string;
            isActive: boolean;
            phone: string | null;
            address: string | null;
            contactPerson: string | null;
        };
        items: ({
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
            productId: string;
            quantity: number;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
            purchaseOrderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        notes: string | null;
        vendorId: string;
        orderNumber: string;
        orderDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        sentAt: Date | null;
        receivedAt: Date | null;
    }>;
}
