import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class SettingsService {
    private tenantService;
    private tenantPrisma;
    constructor(tenantService: TenantService, tenantPrisma: TenantPrismaService);
    getSetting(subdomain: string, key: string): Promise<string>;
    saveSetting(subdomain: string, key: string, value: string): Promise<{
        id: string;
        key: string;
        value: string;
    }>;
    getStripeConfig(subdomain: string): Promise<{
        publishableKey: string;
    }>;
}
