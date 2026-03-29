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
    googleLogin(subdomain: string, body: {
        email: string;
        name: string;
        googleId: string;
    }): Promise<{
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
    registerOwner(body: any): Promise<{
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
}
