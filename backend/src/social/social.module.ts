import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { TenantModule } from '../tenant/tenant.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [TenantModule, PrismaModule],
    controllers: [SocialController],
    providers: [SocialService],
})
export class SocialModule { }
