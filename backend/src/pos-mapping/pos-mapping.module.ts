import { Module } from '@nestjs/common';
import { PosMappingController } from './pos-mapping.controller';
import { PosMappingService } from './pos-mapping.service';
import { TenantModule } from '../tenant/tenant.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [TenantModule, PrismaModule],
    controllers: [PosMappingController],
    providers: [PosMappingService],
})
export class PosMappingModule { }
