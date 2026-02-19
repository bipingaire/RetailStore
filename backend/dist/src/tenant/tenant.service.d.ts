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
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }>;
    getTenantBySubdomain(subdomain: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }>;
    listTenants(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }[]>;
}
