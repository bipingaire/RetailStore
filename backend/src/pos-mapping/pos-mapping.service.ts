import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class PosMappingService {
    constructor(
        private tenantService: TenantService,
        private tenantPrisma: TenantPrismaService,
    ) { }

    async findAll(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.pOSItemMapping.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        sku: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateMapping(subdomain: string, id: string, data: any) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.pOSItemMapping.update({
            where: { id },
            data: {
                matchedInventoryId: data.inventoryId,
                confidenceScore: data.confidenceScore || 1.0,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                    }
                }
            }
        });
    }

    async verifyMapping(subdomain: string, id: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        // Set confidence score to 1.0 to indicate verified
        return client.pOSItemMapping.update({
            where: { id },
            data: { confidenceScore: 1.0 }
        });
    }
}
