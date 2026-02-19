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
        email: string;
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
                subdomain: string | null;
                storeName: string;
                isActive: boolean;
                tenantId: string;
                ownerUserId: string | null;
            }[];
            email: string;
            password: string;
            name: string | null;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
        tenant: {
            subdomain: string | null;
            storeName: string;
            isActive: boolean;
            tenantId: string;
            ownerUserId: string | null;
        };
    }>;
    registerOwner(body: any): Promise<{
        access_token: string;
        user: {
            email: string;
            password: string;
            name: string | null;
            role: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            tenantId: string | null;
        };
    }>;
}
