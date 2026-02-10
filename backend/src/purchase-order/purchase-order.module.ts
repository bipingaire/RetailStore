import { Module } from '@nestjs/common';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Module({
    controllers: [PurchaseOrderController],
    providers: [PurchaseOrderService, TenantPrismaService],
    exports: [PurchaseOrderService],
})
export class PurchaseOrderModule { }
