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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }>;
    getTenantBySubdomain(subdomain: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }>;
    listTenants(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }[]>;
    findAll(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }[]>;
}
