import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards, Query, Patch } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  create(@Headers('x-tenant') subdomain: string, @Body() dto: CreateCustomerDto) {
    return this.customerService.create(subdomain, dto);
  }

  @Get()
  findAll(@Headers('x-tenant') subdomain: string, @Query('search') search?: string) {
    return this.customerService.findAll(subdomain, search);
  }

  @Get(':id')
  findOne(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.customerService.findOne(subdomain, id);
  }

  @Put(':id')
  update(
    @Headers('x-tenant') subdomain: string,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.update(subdomain, id, dto);
  }

  @Delete(':id')
  delete(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.customerService.delete(subdomain, id);
  }

  @Patch(':id/loyalty-points')
  updateLoyaltyPoints(
    @Headers('x-tenant') subdomain: string,
    @Param('id') id: string,
    @Body('points') points: number,
  ) {
    return this.customerService.updateLoyaltyPoints(subdomain, id, points);
  }
}
