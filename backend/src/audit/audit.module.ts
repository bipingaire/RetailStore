import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantModule } from '../tenant/tenant.module';

@Module({
    imports: [TenantModule],
    controllers: [AuditController],
    providers: [AuditService, TenantPrismaService],
    exports: [AuditService],
})
export class AuditModule { }
