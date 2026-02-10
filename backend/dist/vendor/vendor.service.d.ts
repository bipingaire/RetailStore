import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class VendorService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    findAll(subdomain: string): Promise<{
        id: string;
        name: string;
        'contact-phone': string;
        email: string;
        address: string;
        'poc-name': string;
        'reliability-score': number;
    }[]>;
    create(subdomain: string, name: string): Promise<{
        id: string;
        name: string;
        'contact-phone': string;
        email: string;
        address: string;
        'poc-name': string;
        'reliability-score': number;
    }>;
    findInvoices(subdomain: string): Promise<{
        'invoice-id': string;
        'invoice-number': string;
        'invoice-date': Date;
        'total-amount-value': import("src/generated/tenant-client/runtime/library").Decimal;
        'processing-status': string;
        'supplier-name': string;
    }[]>;
}
