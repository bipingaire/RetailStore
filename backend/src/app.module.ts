
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';
import { CustomerModule } from './customer/customer.module';
import { LegacyApiModule } from './legacy-api/legacy-api.module';
import { VendorModule } from './vendor/vendor.module';
import { InvoiceModule } from './invoice/invoice.module';
import { AuditModule } from './audit/audit.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { CampaignModule } from './campaign/campaign.module';
import { ProfitController } from './reports/profit.controller';
import { ProfitService } from './reports/profit.service';
import { TenantPrismaService } from './prisma/tenant-prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TenantModule,
    ProductModule,
    SaleModule,
    CustomerModule,
    LegacyApiModule,
    VendorModule,
    InvoiceModule,
    AuditModule,
    PurchaseOrderModule,
    CampaignModule,
  ],
  controllers: [ProfitController],
  providers: [ProfitService, TenantPrismaService],
})
export class AppModule { }
