import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantController {
    private tenantService;
    constructor(tenantService: TenantService);
    createTenant(dto: CreateTenantDto): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllTenants(): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTenant(subdomain: string): Promise<{
        id: string;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
