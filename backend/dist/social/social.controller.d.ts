import { SocialService } from './social.service';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    getSettings(tenantId: string): Promise<any>;
    saveSettings(tenantId: string, body: any): Promise<{
        success: boolean;
    }>;
    publish(tenantId: string, body: any): Promise<{
        success: boolean;
        results: any[];
    }>;
}
