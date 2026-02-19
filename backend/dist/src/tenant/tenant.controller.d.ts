import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantController {
    private tenantService;
    constructor(tenantService: TenantService);
    createTenant(dto: CreateTenantDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }>;
    getAllTenants(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }[]>;
    getTenant(subdomain: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
        isActive: boolean;
    }>;
}
