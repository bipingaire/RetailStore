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
}
