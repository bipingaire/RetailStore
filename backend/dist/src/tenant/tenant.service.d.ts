import { MasterPrismaService } from '../prisma/master-prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class TenantService {
    private masterPrisma;
    private tenantPrisma;
    constructor(masterPrisma: MasterPrismaService, tenantPrisma: TenantPrismaService);
    createTenant(dto: {
        name: string;
        subdomain: string;
        email: string;
        password: string;
    }): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTenantBySubdomain(subdomain: string): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listTenants(): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
