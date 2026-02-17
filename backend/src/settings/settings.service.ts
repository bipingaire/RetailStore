
import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class SettingsService {
    constructor(
        private tenantService: TenantService,
        private tenantPrisma: TenantPrismaService,
    ) { }

    async getSetting(subdomain: string, key: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        const setting = await client.settings.findUnique({
            where: { key },
        });

        return setting ? setting.value : '';
    }

    async saveSetting(subdomain: string, key: string, value: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.settings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    async getStripeConfig(subdomain: string) {
        const publishableKey = await this.getSetting(subdomain, 'stripe_publishable_key');
        // Secret key should strictly be used on backend, but this helper might be useful 
        // if we want to return just the pub key to frontend.
        return { publishableKey };
    }
}
