import { Module } from '@nestjs/common';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantModule } from '../tenant/tenant.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [PrismaModule, TenantModule, SettingsModule],
  controllers: [TaxController],
  providers: [TaxService, TenantPrismaService],
  exports: [TaxService],
})
export class TaxModule {}
