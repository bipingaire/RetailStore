import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Headers('x-tenant') subdomain: string, @Body() dto: CreateProductDto) {
    return this.productService.create(subdomain, dto);
  }

  @Get()
  findAll(@Headers('x-tenant') subdomain: string) {
    return this.productService.findAll(subdomain);
  }

  @Get(':id')
  findOne(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.productService.findOne(subdomain, id);
  }

  @Put(':id')
  update(@Headers('x-tenant') subdomain: string, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(subdomain, id, dto);
  }

  @Delete(':id')
  delete(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.productService.delete(subdomain, id);
  }

  @Post(':id/stock')
  updateStock(
    @Headers('x-tenant') subdomain: string,
    @Param('id') id: string,
    @Body() dto: { quantity: number; type: 'IN' | 'OUT' | 'ADJUSTMENT' }
  ) {
    return this.productService.updateStock(subdomain, id, dto.quantity, dto.type);
  }
}
