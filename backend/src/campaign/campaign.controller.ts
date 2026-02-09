import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/campaign.dto';

@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Post()
    async create(@Req() req: any, @Body() dto: CreateCampaignDto) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.campaignService.create(tenantId, dto);
    }

    @Get()
    async findAll(@Req() req: any, @Query('status') status?: string) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.campaignService.findAll(tenantId, status);
    }

    @Get('suggestions')
    async getSuggestions(@Req() req: any) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.campaignService.getSuggestions(tenantId);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.campaignService.findOne(tenantId, id);
    }

    @Post(':id/push-website')
    async pushToWebsite(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.campaignService.pushToWebsite(tenantId, id);
    }

    @Post(':id/push-social')
    async pushToSocial(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.campaignService.pushToSocial(tenantId, id);
    }
}
