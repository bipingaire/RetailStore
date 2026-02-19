import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';

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

    async getExpenses(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return client.expense.findMany({
            orderBy: { expenseDate: 'desc' }
        });
    }
}
