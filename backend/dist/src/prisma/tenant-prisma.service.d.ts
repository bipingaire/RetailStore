import { OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/tenant-client';
export declare class TenantPrismaService implements OnModuleDestroy {
    private clients;
    getTenantClient(databaseUrl: string): Promise<PrismaClient>;
    onModuleDestroy(): Promise<void>;
}
