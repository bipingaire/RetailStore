import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/tenant-client';

@Injectable()
export class TenantPrismaService implements OnModuleDestroy {
    // Cache clients to avoid exhaustion: Map<dbUrl, PrismaClient>
    private clients = new Map<string, PrismaClient>();

    async getTenantClient(databaseUrl: string): Promise<PrismaClient> {
        if (this.clients.has(databaseUrl)) {
            return this.clients.get(databaseUrl);
        }

        const client = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
        });

        await client.$connect();
        this.clients.set(databaseUrl, client);
        return client;
    }

    async onModuleDestroy() {
        for (const client of this.clients.values()) {
            await client.$disconnect();
        }
    }
}
