import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantController {
    private tenantService;
    constructor(tenantService: TenantService);
    createTenant(dto: CreateTenantDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }>;
    getAllTenants(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }[]>;
    getTenant(subdomain: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subdomain: string;
        storeName: string;
        databaseUrl: string;
        adminEmail: string;
    }>;
}
