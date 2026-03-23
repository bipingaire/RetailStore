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
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    loginSuperAdmin(admin: any): Promise<{
        access_token: string;
        user: any;
    }>;
    validateUser(subdomain: string, email: string, password: string): Promise<{
        tenantId: string;
        subdomain: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        role: string;
        isActive: boolean;
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
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
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
            id: string;
            email: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            role: string;
            isActive: boolean;
            tenantId: string | null;
        };
    }>;
    loginOwner(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            tenantId: string;
            RetailStoreTenants: {
                isActive: boolean;
                subdomain: string | null;
                storeName: string;
                tenantId: string;
                ownerUserId: string | null;
            }[];
            id: string;
            email: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            role: string;
            isActive: boolean;
        };
        tenant: {
            isActive: boolean;
            subdomain: string | null;
            storeName: string;
            tenantId: string;
            ownerUserId: string | null;
        };
    }>;
}
