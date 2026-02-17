import { Controller, Get, Put, Patch, Body, Headers, Param } from '@nestjs/common';
import { PosMappingService } from './pos-mapping.service';

@Controller('pos-mappings')
export class PosMappingController {
    constructor(private readonly posMappingService: PosMappingService) { }

    @Get()
    async findAll(@Headers('x-tenant') tenantId: string) {
        return this.posMappingService.findAll(tenantId);
    }

    @Put(':id')
    async update(
        @Headers('x-tenant') tenantId: string,
        @Param('id') id: string,
        @Body() body: any
    ) {
        return this.posMappingService.updateMapping(tenantId, id, body);
    }

    @Patch(':id/verify')
    async verify(
        @Headers('x-tenant') tenantId: string,
        @Param('id') id: string
    ) {
        return this.posMappingService.verifyMapping(tenantId, id);
    }
}
