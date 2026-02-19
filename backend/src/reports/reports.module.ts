import { Module } from '@nestjs/common';
import { ZReportController } from './z-report.controller';
import { ZReportService } from './z-report.service';
import { ProfitController } from './profit.controller';
import { ProfitService } from './profit.service';
import { TenantModule } from '../tenant/tenant.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [TenantModule, PrismaModule],
    controllers: [ZReportController, ProfitController],
    providers: [ZReportService, ProfitService],
    exports: [ZReportService, ProfitService],
})
export class ReportsModule { }
