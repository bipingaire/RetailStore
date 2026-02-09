import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';
import { CustomerModule } from './customer/customer.module';
import { VendorModule } from './vendor/vendor.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MasterCatalogModule } from './master-catalog/master-catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { CampaignModule } from './campaign/campaign.module';
import { ReconciliationModule } from './reconciliation/reconciliation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TenantModule,
    ProductModule,
    SaleModule,
    CustomerModule,
    VendorModule,
    DashboardModule,
    MasterCatalogModule,
    InventoryModule,
    CampaignModule,
    ReconciliationModule,
  ],
})
export class AppModule { }
