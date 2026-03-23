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
        email: string;
        password: string;
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
    registerOwner(body: any): Promise<{
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
}
