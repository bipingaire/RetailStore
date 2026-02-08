import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
export declare class AuthService {
    private jwtService;
    private tenantService;
    private tenantPrisma;
    constructor(jwtService: JwtService, tenantService: TenantService, tenantPrisma: TenantPrismaService);
    validateUser(subdomain: string, email: string, password: string): Promise<{
        tenantId: string;
        subdomain: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        role: string;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(subdomain: string, email: string, password: string, name: string): Promise<{
        access_token: string;
        user: any;
    }>;
}
