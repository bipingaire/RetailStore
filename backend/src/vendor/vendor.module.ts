import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { TenantModule } from '../tenant/tenant.module';

@Module({
    imports: [TenantModule],
    controllers: [VendorController],
    providers: [VendorService],
})
export class VendorModule { }
