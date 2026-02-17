import { Global, Module } from '@nestjs/common';
import { MasterPrismaService } from './master-prisma.service';
import { TenantPrismaService } from './tenant-prisma.service';
import { PrismaService } from './prisma.service'; // Keep for legacy/transition? Or remove?
// If we pivot fully, we should probably keep PrismaService as alias for Master? or Remove.
// But some services I haven't touched yet might use it.
// I'll keep it for now but export new ones.

@Global()
@Module({
  providers: [MasterPrismaService, TenantPrismaService, PrismaService],
  exports: [MasterPrismaService, TenantPrismaService, PrismaService],
})
export class PrismaModule { }
