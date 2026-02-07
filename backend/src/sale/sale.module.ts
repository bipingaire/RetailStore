import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TenantModule } from '../tenant/tenant.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TenantModule, ProductModule],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
