import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TenantModule } from '../tenant/tenant.module';
import { ProductModule } from '../product/product.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [TenantModule, ProductModule, SettingsModule],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule { }
