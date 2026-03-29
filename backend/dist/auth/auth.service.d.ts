import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { LocalPrismaService } from '../prisma/local-prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private jwtService;
    private tenantPrisma;
    private prisma;
    private localPrisma;
    constructor(jwtService: JwtService, tenantPrisma: TenantPrismaService, prisma: PrismaService, localPrisma: LocalPrismaService);
    validateSuperAdmin(email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
    }>;
    loginSuperAdmin(admin: any): Promise<{
        access_token: string;
        user: any;
    }>;
    validateUser(subdomain: string, email: string, password: string): Promise<{
        tenantId: string;
        subdomain: string;
        name: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
    googleLogin(subdomain: string, data: {
        email: string;
        name: string;
        googleId: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPass: string): Promise<{
        success: boolean;
    }>;
    registerOwner(subdomain: string, dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            tenantId: string | null;
            name: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            role: string;
        };
    }>;
    loginOwner(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            tenantId: string;
            RetailStoreTenants: {
                tenantId: string;
                storeName: string;
                subdomain: string | null;
                isActive: boolean;
                ownerUserId: string | null;
            }[];
            name: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            role: string;
        };
        tenant: {
            tenantId: string;
            storeName: string;
            subdomain: string | null;
            isActive: boolean;
            ownerUserId: string | null;
        };
    }>;
}
