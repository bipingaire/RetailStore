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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const tenant_service_1 = require("../tenant/tenant.service");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(jwtService, tenantService, tenantPrisma, prisma) {
        this.jwtService = jwtService;
        this.tenantService = tenantService;
        this.tenantPrisma = tenantPrisma;
        this.prisma = prisma;
    }
    async validateSuperAdmin(email, password) {
        const admin = await this.prisma.superAdmin.findUnique({ where: { email } });
        if (!admin || !await bcrypt.compare(password, admin.password)) {
            throw new common_1.UnauthorizedException('Invalid superadmin credentials');
        }
        const { password: _, ...result } = admin;
        return result;
    }
    async loginSuperAdmin(admin) {
        const payload = {
            email: admin.email,
            sub: admin.id,
            role: 'SUPERADMIN',
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: admin,
        };
    }
    async validateUser(subdomain, email, password) {
        console.log(`[AuthService] Validating user for subdomain: ${subdomain}, email: ${email}`);
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        console.log(`[AuthService] Found tenant:`, tenant.id, tenant.subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        console.log(`[AuthService] Got tenant client for database:`, tenant.databaseUrl);
        const user = await client.user.findUnique({ where: { email } });
        console.log(`[AuthService] User lookup result:`, user ? `Found user ${user.id}` : 'User not found');
        if (!user) {
            console.log(`[AuthService] User not found for email: ${email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log(`[AuthService] Password hash starts with:`, user.password.substring(0, 10));
        console.log(`[AuthService] Password is hashed:`, user.password.startsWith('$2b$'));
        if (user.password.startsWith('$2b$')) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(`[AuthService] Bcrypt comparison result:`, isPasswordValid);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
        }
        else {
            console.log(`[AuthService] Using plain text comparison`);
            if (user.password !== password) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
        }
        console.log(`[AuthService] Authentication successful for user: ${email}`);
        const { password: _, ...result } = user;
        return { ...result, tenantId: tenant.id, subdomain };
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            tenantId: user.tenantId,
            subdomain: user.subdomain,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async register(subdomain, email, password, name) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const existingUser = await client.user.findUnique({ where: { email } });
        if (existingUser)
            throw new common_1.BadRequestException('User already exists');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'CASHIER',
            },
        });
        return this.login({ ...user, tenantId: tenant.id, subdomain });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        tenant_service_1.TenantService,
        tenant_prisma_service_1.TenantPrismaService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map