import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSetting(subdomain: string, key: string): Promise<{
        value: string;
    }>;
    saveSetting(subdomain: string, body: {
        key: string;
        value: string;
    }): Promise<{
        id: string;
        key: string;
        value: string;
    }>;
}
