import { PurchaseOrderService } from './purchase-order.service';
export declare class PurchaseOrderController {
    private readonly purchaseOrderService;
    constructor(purchaseOrderService: PurchaseOrderService);
    create(subdomain: string, body: {
        vendorId: string;
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
        }>;
        notes?: string;
    }): Promise<{
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
    getAll(subdomain: string, status?: string): Promise<({
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
    getOne(subdomain: string, id: string): Promise<{
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
    updateStatus(subdomain: string, id: string, body: {
        status: string;
    }): Promise<{
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
    send(subdomain: string, id: string): Promise<{
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
    receive(subdomain: string, id: string): Promise<{
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
