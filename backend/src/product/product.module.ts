import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TenantModule } from '../tenant/tenant.module';
import { MasterCatalogModule } from '../master-catalog/master-catalog.module';

@Module({
  imports: [TenantModule, MasterCatalogModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
