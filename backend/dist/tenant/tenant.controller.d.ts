import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantController {
    private tenantService;
    constructor(tenantService: TenantService);
    createTenant(dto: CreateTenantDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        storeName: string;
        subdomain: string;
        databaseUrl: string;
        adminEmail: string;
    }>;
    getAllTenants(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        storeName: string;
        subdomain: string;
        databaseUrl: string;
        adminEmail: string;
    }[]>;
    getTenant(subdomain: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        storeName: string;
        subdomain: string;
        databaseUrl: string;
        adminEmail: string;
    }>;
}
