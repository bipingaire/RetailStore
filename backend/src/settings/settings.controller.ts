
import { Controller, Get, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get(':key')
    async getSetting(
        @Headers('x-tenant') subdomain: string,
        @Param('key') key: string,
    ) {
        return this.settingsService.getSetting(subdomain, key);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async saveSetting(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { key: string; value: string },
    ) {
        return this.settingsService.saveSetting(subdomain, body.key, body.value);
    }
}
