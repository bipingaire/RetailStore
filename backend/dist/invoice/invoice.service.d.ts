import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { Prisma } from '../generated/tenant-client';
import { CategoryService } from '../category/category.service';
export declare class InvoiceService {
    private readonly tenantPrisma;
    private readonly tenantService;
    private readonly categoryService;
    constructor(tenantPrisma: TenantPrismaService, tenantService: TenantService, categoryService: CategoryService);
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
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
        status: string;
        vendorId: string;
    }>;
    getInvoice(subdomain: string, id: string): Promise<{
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                category: string | null;
                sku: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
        status: string;
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
    updateInvoice(subdomain: string, id: string, vendorId: string, invoiceNumber: string, invoiceDate: Date, totalAmount: number, items: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
        status: string;
        vendorId: string;
    }>;
    getAllInvoices(subdomain: string, options?: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
        vendorId?: string;
    } | string): Promise<({
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                category: string | null;
                sku: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
        status: string;
        vendorId: string;
    })[] | import("../common/pagination.dto").PaginatedResponse<{
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                category: string | null;
                sku: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
        status: string;
        vendorId: string;
    }>>;
    addInvoiceItems(subdomain: string, invoiceId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>): Promise<Prisma.BatchPayload>;
    commitInvoice(subdomain: string, invoiceId: string): Promise<{
        vendor: {
            id: string;
            name: string;
            isActive: boolean;
            contactPerson: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                category: string | null;
                sku: string;
                price: Prisma.Decimal;
                costPrice: Prisma.Decimal;
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
            invoiceId: string;
            productId: string;
            quantity: number;
            unitCost: Prisma.Decimal;
            totalCost: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        invoiceDate: Date;
        totalAmount: Prisma.Decimal;
        fileUrl: string | null;
        status: string;
        vendorId: string;
    }>;
    parseInvoiceOCR(subdomain: string, fileUrl: string): Promise<{
        vendorName: any;
        invoiceNumber: any;
        invoiceDate: Date;
        totalAmount: number;
        items: any;
    }>;
    private getMockInvoiceData;
}
