import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { Prisma } from '../generated/tenant-client';
export declare class InvoiceService {
    private readonly tenantPrisma;
    private readonly tenantService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService);
    private cleanProductName;
    uploadInvoice(subdomain: string, vendorId: string, invoiceNumber: string, invoiceDate: Date, totalAmount: number, items: Array<{
        description: string;
        category: string;
        quantity: number;
        unitsPerCase: number;
        unitSize: string;
        casePrice: number;
        costPerUnit: number;
        unitPrice: number;
        totalPrice: number;
        sellingPrice?: number;
        expiryDate?: string;
    }>, fileUrl?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
    }>;
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
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
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
    updateInvoice(subdomain: string, id: string, vendorId: string, invoiceNumber: string, invoiceDate: Date, totalAmount: number, items: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        vendorId: string;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
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
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
    })[]>;
    addInvoiceItems(subdomain: string, invoiceId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>): Promise<Prisma.BatchPayload>;
    commitInvoice(subdomain: string, invoiceId: string): Promise<{
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
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
    }>;
    parseInvoiceOCR(fileUrl: string): Promise<{
        vendorName: any;
        invoiceNumber: any;
        invoiceDate: Date;
        totalAmount: number;
        items: any;
    }>;
    private getMockInvoiceData;
}
