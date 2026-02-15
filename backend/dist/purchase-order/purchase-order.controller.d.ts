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
    getAll(subdomain: string, status?: string): Promise<({
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
    getOne(subdomain: string, id: string): Promise<{
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
    updateStatus(subdomain: string, id: string, body: {
        status: string;
    }): Promise<{
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
    send(subdomain: string, id: string): Promise<{
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
    receive(subdomain: string, id: string): Promise<{
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
