import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { parsePagination, buildPaginatedResponse } from '../common/pagination.dto';

@Injectable()
export class ExpenseService {
    constructor(
        private readonly tenantPrisma: TenantPrismaService,
        private readonly tenantService: TenantService,
    ) { }

    async createExpense(subdomain: string, data: { expenseDate: string; category: string; amount: number; description?: string }) {
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

    async getExpenses(subdomain: string, options: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        startDate?: string;
        endDate?: string;
    } = {}) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const { skip, take, page, limit } = parsePagination(options.page, options.limit, 20);

        const where: any = {};
        if (options.category) where.category = options.category;
        if (options.search) {
            where.OR = [
                { description: { contains: options.search, mode: 'insensitive' } },
                { category: { contains: options.search, mode: 'insensitive' } },
            ];
        }
        if (options.startDate || options.endDate) {
            where.expenseDate = {};
            if (options.startDate) where.expenseDate.gte = new Date(options.startDate);
            if (options.endDate) where.expenseDate.lte = new Date(options.endDate);
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

        if (!options.page && !options.limit) return expenses;
        return buildPaginatedResponse(expenses, total, page, limit);
    }
}
