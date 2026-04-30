import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Post('force-sync')
  @UseGuards(JwtAuthGuard)
  syncAll(@Headers('x-tenant') subdomain: string) {
    return this.productService.syncAll(subdomain);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Headers('x-tenant') subdomain: string, @Body() dto: CreateProductDto) {
    return this.productService.create(subdomain, dto);
  }

  @Get()
  findAll(
    @Headers('x-tenant') subdomain: string,
    @Query('sellableOnly') sellableOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.productService.findAll(subdomain, {
      sellableOnly: sellableOnly === 'true',
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      category,
    });
  }

  @Get(':id')
  findOne(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.productService.findOne(subdomain, id);
  }



  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Headers('x-tenant') subdomain: string, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(subdomain, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Headers('x-tenant') subdomain: string, @Param('id') id: string) {
    return this.productService.delete(subdomain, id);
  }

  @Post(':id/stock')
  @UseGuards(JwtAuthGuard)
  updateStock(
    @Headers('x-tenant') subdomain: string,
    @Param('id') id: string,
    @Body() dto: { quantity: number; type: 'IN' | 'OUT' | 'ADJUSTMENT' }
  ) {
    return this.productService.updateStock(subdomain, id, dto.quantity, dto.type);
  }

  @Post(':id/enrich')
  @UseGuards(JwtAuthGuard)
  enrich(
    @Headers('x-tenant') subdomain: string,
    @Param('id') id: string
  ) {
    return this.productService.enrichProduct(subdomain, id);
  }
}
