import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) { }

    @Get('settings')
    async getSettings(@Headers('x-tenant') tenantId: string) {
        return this.socialService.getSettings(tenantId);
    }

    @Post('save-settings')
    async saveSettings(@Headers('x-tenant') tenantId: string, @Body() body: any) {
        return this.socialService.saveSettings(tenantId, body.accounts);
    }

    @Post('publish')
    async publish(@Headers('x-tenant') tenantId: string, @Body() body: any) {
        return this.socialService.publish(tenantId, body.campaignId, body.platforms);
    }
}
