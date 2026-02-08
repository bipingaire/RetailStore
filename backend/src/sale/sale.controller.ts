import { Controller, Get, Post, Body, Param, Headers, UseGuards, Query, Req, Patch } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private saleService: SaleService) { }

  @Post()
  create(
    @Headers('x-tenant') subdomain: string,
    @Req() req: any,
    @Body() dto: CreateSaleDto,
  ) {
    return this.saleService.createSale(subdomain, { ...dto, userId: req.user.id });
  }

  @Get()
  findAll(
    @Headers('x-tenant') subdomain: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('customerId') customerId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.saleService.findAll(subdomain, {
      status,
      startDate,
      endDate,
      userId,
      customerId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('stats')
  getStats(
    @Headers('x-tenant') subdomain: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.saleService.getSalesStats(
      subdomain
      // startDate ? new Date(startDate) : undefined,
      // endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.saleService.findOne(subdomain, id);
  }

  @Patch(':id/cancel')
  cancel(
    @Headers('x-tenant') subdomain: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.saleService.cancelSale(subdomain, id, req.user.id);
  }
}
