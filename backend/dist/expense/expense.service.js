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
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
const pagination_dto_1 = require("../common/pagination.dto");
let ExpenseService = class ExpenseService {
    constructor(tenantPrisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.tenantService = tenantService;
    }
    async createExpense(subdomain, data) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.expense.create({
            data: {
                expenseDate: new Date(data.expenseDate),
                category: data.category,
                amount: data.amount,
                description: data.description
            }
        });
    }
    async getExpenses(subdomain, options = {}) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const { skip, take, page, limit } = (0, pagination_dto_1.parsePagination)(options.page, options.limit, 20);
        const where = {};
        if (options.category)
            where.category = options.category;
        if (options.search) {
            where.OR = [
                { description: { contains: options.search, mode: 'insensitive' } },
                { category: { contains: options.search, mode: 'insensitive' } },
            ];
        }
        if (options.startDate || options.endDate) {
            where.expenseDate = {};
            if (options.startDate)
                where.expenseDate.gte = new Date(options.startDate);
            if (options.endDate)
                where.expenseDate.lte = new Date(options.endDate);
        }
        const [expenses, total] = await Promise.all([
            client.expense.findMany({
                where,
                orderBy: { expenseDate: 'desc' },
                skip,
                take,
            }),
            client.expense.count({ where }),
        ]);
        if (!options.page && !options.limit)
            return expenses;
        return (0, pagination_dto_1.buildPaginatedResponse)(expenses, total, page, limit);
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map