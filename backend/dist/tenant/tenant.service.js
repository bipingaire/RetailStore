"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const master_prisma_service_1 = require("../prisma/master-prisma.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
let TenantService = class TenantService {
    constructor(masterPrisma, tenantPrisma) {
        this.masterPrisma = masterPrisma;
        this.tenantPrisma = tenantPrisma;
    }
    async createTenant(dto) {
        const existing = await this.masterPrisma.tenant.findUnique({ where: { subdomain: dto.subdomain } });
        if (existing)
            throw new common_1.BadRequestException('Subdomain taken');
        const dbName = `retail_store_${dto.subdomain}`;
        const dbUrl = process.env.DATABASE_URL.replace(/\/([^/?]+)(\?|$)/, `/${dbName}$2`);
        const tenant = await this.masterPrisma.tenant.create({
            data: {
                storeName: dto.name,
                subdomain: dto.subdomain,
                adminEmail: dto.email,
                databaseUrl: dbUrl,
            },
        });
        try {
            if (!/^[a-z0-9]+$/.test(dto.subdomain))
                throw new common_1.BadRequestException('Invalid subdomain');
        }
        catch (e) {
            console.error('Failed to provision DB', e);
        }
        return tenant;
    }
    async getTenantBySubdomain(subdomain) {
        const tenant = await this.masterPrisma.tenant.findUnique({ where: { subdomain } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async listTenants() {
        return this.masterPrisma.tenant.findMany();
    }
    async findAll() {
        return this.masterPrisma.tenant.findMany();
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [master_prisma_service_1.MasterPrismaService,
        tenant_prisma_service_1.TenantPrismaService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map