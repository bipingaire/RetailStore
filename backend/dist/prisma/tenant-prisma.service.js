"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPrismaService = void 0;
require('dotenv/config');
const common_1 = require("@nestjs/common");
const tenant_client_1 = require("../generated/tenant-client");
let TenantPrismaService = class TenantPrismaService {
    constructor() {
        this.clients = new Map();
    }
    async getTenantClient(databaseUrl) {
        if (this.clients.has(databaseUrl)) {
            return this.clients.get(databaseUrl);
        }
        const client = new tenant_client_1.PrismaClient({
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
};
exports.TenantPrismaService = TenantPrismaService;
exports.TenantPrismaService = TenantPrismaService = __decorate([
    (0, common_1.Injectable)()
], TenantPrismaService);
//# sourceMappingURL=tenant-prisma.service.js.map