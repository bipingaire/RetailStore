import { Module } from '@nestjs/common';
import { LegacyApiController } from './legacy-api.controller';
import { ProductModule } from '../product/product.module';
import { SaleModule } from '../sale/sale.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
    imports: [ProductModule, SaleModule, TenantModule],
    controllers: [LegacyApiController],
    providers: [],
})
export class LegacyApiModule { }
