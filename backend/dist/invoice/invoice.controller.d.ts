import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    uploadInvoice(subdomain: string, file: any, body: {
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: string;
        totalAmount: string;
        items?: string;
    }): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
    }>;
    testEndpoint(): {
        success: boolean;
        message: string;
    };
    parseInvoice(file: any): Promise<{
        vendorName: any;
        invoiceNumber: any;
        invoiceDate: Date;
        totalAmount: number;
        items: any;
    }>;
    getAllInvoices(subdomain: string, status?: string): Promise<({
        items: ({
            product: {
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
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
            invoiceId: string;
        })[];
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
    })[]>;
    getInvoice(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
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
            invoiceId: string;
        })[];
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
    }>;
    getInvoiceParsed(subdomain: string, id: string): Promise<{
        vendorId: string;
        vendorName: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: number;
        fileUrl: any;
        items: {
            dbItemId: string;
            productId: string;
            description: string;
            category: string;
            quantity: number;
            unitsPerCase: number;
            unitSize: string;
            casePrice: number;
            costPerUnit: number;
            unitPrice: number;
            retailUnits: number;
            totalPrice: number;
            sellingPrice: number;
            expiryDate: string;
        }[];
    }>;
    updateInvoice(subdomain: string, id: string, body: {
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: string;
        totalAmount: string;
        items?: any[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
    }>;
    addItems(subdomain: string, id: string, body: {
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
        }>;
    }): Promise<import("src/generated/tenant-client").Prisma.BatchPayload>;
    commitInvoice(subdomain: string, id: string): Promise<{
        items: ({
            product: {
                sku: string;
                category: string | null;
                description: string | null;
                imageUrl: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
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
            invoiceId: string;
        })[];
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
            address: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
    }>;
}
