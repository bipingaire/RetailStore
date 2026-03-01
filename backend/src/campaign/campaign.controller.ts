import { Controller, Get, Post, Put, Patch, Delete, Body, Headers, Param } from '@nestjs/common';
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

    @Get('promotions')
    async getActivePromotions(@Headers('x-tenant') tenantId: string) {
        return this.campaignService.getActivePromotions(tenantId);
    }

    @Get('active')
    async getActiveCampaigns(@Headers('x-tenant') tenantId: string) {
        return this.campaignService.getActiveCampaigns(tenantId);
    }

    @Put(':id')
    async update(@Headers('x-tenant') tenantId: string, @Param('id') id: string, @Body() body: any) {
        return this.campaignService.updateCampaign(tenantId, id, body);
    }

    @Patch(':id')
    async partialUpdate(@Headers('x-tenant') tenantId: string, @Param('id') id: string, @Body() body: any) {
        return this.campaignService.updateCampaign(tenantId, id, body);
    }

    @Delete(':id')
    async delete(@Headers('x-tenant') tenantId: string, @Param('id') id: string) {
        return this.campaignService.deleteCampaign(tenantId, id);
    }

    @Post('generate')
    async generate(@Body() body: { products: any[] }) {
        return this.campaignService.generateCampaignContent(body);
    }
    @Post('promotions')
    async createPromotion(@Headers('x-tenant') tenantId: string, @Body() body: any) {
        return this.campaignService.createPromotion(tenantId, body);
    }

    @Post('attach-product')
    async attachProduct(@Headers('x-tenant') tenantId: string, @Body() body: any) {
        return this.campaignService.addSegmentProduct(tenantId, body);
    }
}
