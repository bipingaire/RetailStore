import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class VendorService {
    constructor(
        private tenantService: TenantService,
        private tenantPrisma: TenantPrismaService,
    ) { }

    async findAll(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const vendors = await client.vendor.findMany({
            include: { PurchaseOrders: true }
        });

        return vendors.map(v => ({
            id: v.id,
            name: v.name,
            'contact-phone': v.phone,
            email: v.email,
            // ein: v.ein, 
            address: v.address,
            // website: v.website,
            // fax: v.fax,
            'poc-name': v.contactPerson,
            'reliability-score': 95
        }));
    }

    async findInvoices(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const pos = await client.purchaseOrder.findMany({
            include: { vendor: true },
            orderBy: { orderDate: 'desc' }
        });

        return pos.map(po => ({
            'invoice-id': po.id,
            'invoice-number': po.poNumber,
            'invoice-date': po.orderDate,
            'total-amount-value': po.totalAmount,
            'processing-status': po.status,
            'supplier-name': po.vendor.name
        }));
    }
}
