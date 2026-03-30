import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [PrismaModule, TenantModule],
  controllers: [CategoryController],
  providers: [CategoryService, TenantPrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
