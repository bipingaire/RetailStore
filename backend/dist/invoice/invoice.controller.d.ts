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
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        vendorId: string;
    }>;
    testEndpoint(): {
        success: boolean;
        message: string;
    };
    parseInvoice(subdomain: string, file: any): Promise<{
        vendorName: any;
        invoiceNumber: any;
        invoiceDate: Date;
        totalAmount: number;
        items: any;
    }>;
    getAllInvoices(subdomain: string, status?: string, page?: string, limit?: string, search?: string, vendorId?: string): Promise<({
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                isSellable: boolean;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        vendorId: string;
    })[] | import("../common/pagination.dto").PaginatedResponse<{
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                isSellable: boolean;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        vendorId: string;
    }>>;
    getInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                isSellable: boolean;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        vendorId: string;
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
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        vendorId: string;
    }>;
    addItems(subdomain: string, id: string, body: {
        items: Array<{
            productId: string;
            quantity: number;
            unitCost: number;
        }>;
    }): Promise<import("src/generated/tenant-client").Prisma.BatchPayload>;
    commitInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            name: string;
            id: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                sku: string;
                category: string | null;
                description: string | null;
                price: import("src/generated/tenant-client/runtime/library").Decimal;
                costPrice: import("src/generated/tenant-client/runtime/library").Decimal;
                stock: number;
                reorderLevel: number;
                imageUrl: string | null;
                barcode: string | null;
                isActive: boolean;
                isSellable: boolean;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                unitsPerParent: number;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            invoiceId: string;
            unitCost: import("src/generated/tenant-client/runtime/library").Decimal;
            totalCost: import("src/generated/tenant-client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: import("src/generated/tenant-client/runtime/library").Decimal;
        fileUrl: string | null;
        vendorId: string;
    }>;
}
