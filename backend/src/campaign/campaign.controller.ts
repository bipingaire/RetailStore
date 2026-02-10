import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { CampaignService } from './campaign.service';

@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Post()
    async create(@Headers('x-tenant') tenantId: string, @Body() body: any) {
        return this.campaignService.createCampaign(tenantId, body);
    }

    @Get()
    async findAll(@Headers('x-tenant') tenantId: string) {
        return this.campaignService.listCampaigns(tenantId);
    }

    @Post('generate')
    async generate(@Body() body: { products: any[] }) {
        return this.campaignService.generateCampaignContent(body);
    }
}
