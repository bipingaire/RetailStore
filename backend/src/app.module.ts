import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';
import { CustomerModule } from './customer/customer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LegacyApiModule } from './legacy-api/legacy-api.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TenantModule,
    ProductModule,
    SaleModule,
    CustomerModule,
    LegacyApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
