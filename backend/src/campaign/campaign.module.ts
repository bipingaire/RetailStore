import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { TenantModule } from '../tenant/tenant.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [TenantModule, PrismaModule],
    controllers: [CampaignController],
    providers: [CampaignService],
})
export class CampaignModule { }
