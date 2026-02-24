import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
export declare class SocialService {
    private prisma;
    private tenantService;
    constructor(prisma: TenantPrismaService, tenantService: TenantService);
    saveSettings(subdomain: string, accounts: any): Promise<{
        success: boolean;
    }>;
    getSettings(subdomain: string): Promise<any>;
    publish(subdomain: string, campaignId: string, platforms: string[]): Promise<{
        success: boolean;
        results: any[];
    }>;
}
