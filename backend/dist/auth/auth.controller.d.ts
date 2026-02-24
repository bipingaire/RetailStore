import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(subdomain: string, dto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    register(subdomain: string, dto: RegisterDto): Promise<{
        access_token: string;
        user: any;
    }>;
    loginSuperAdmin(dto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(subdomain: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
    }>;
    forgotPassword(subdomain: string, body: {
        email: string;
    }): Promise<{
        success: boolean;
    }>;
    resetPassword(subdomain: string, body: {
        token: string;
        password: string;
    }): Promise<{
        success: boolean;
    }>;
    loginOwner(body: LoginDto): Promise<{
        access_token: string;
        user: {
            tenantId: string;
            RetailStoreTenants: {
                isActive: boolean;
                tenantId: string;
                storeName: string;
                subdomain: string | null;
                ownerUserId: string | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            isActive: boolean;
            password: string;
            role: string;
        };
        tenant: {
            isActive: boolean;
            tenantId: string;
            storeName: string;
            subdomain: string | null;
            ownerUserId: string | null;
        };
    }>;
    registerOwner(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            isActive: boolean;
            tenantId: string | null;
            password: string;
            role: string;
        };
    }>;
}
