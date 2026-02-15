import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ProfitService } from './profit.service';

@Controller('reports/profit')
export class ProfitController {
    constructor(private readonly profitService: ProfitService) { }

    @Post('calculate')
    async calculate(
        @Headers('x-tenant') subdomain: string,
        @Body() body: {
            startDate: string;
            endDate: string;
            period: 'daily' | 'weekly' | 'monthly';
        }
    ) {
        return this.profitService.calculateProfit(
            subdomain,
            new Date(body.startDate),
            new Date(body.endDate),
            body.period,
        );
    }

    @Get()
    async getReports(
        @Headers('x-tenant') subdomain: string,
        @Query('period') period?: string
    ) {
        return this.profitService.getProfitReports(subdomain, period);
    }

    @Get('trends')
    async getTrends(
        @Headers('x-tenant') subdomain: string,
        @Query('days') days?: string
    ) {
        return this.profitService.getProfitTrends(subdomain, days ? parseInt(days) : 30);
    }

    @Get('category-breakdown')
    async getCategoryBreakdown(
        @Headers('x-tenant') subdomain: string,
        @Query() query: { startDate: string; endDate: string }
    ) {
        return this.profitService.getCategoryBreakdown(
            subdomain,
            new Date(query.startDate),
            new Date(query.endDate),
        );
    }

    @Post('expense')
    async addExpense(
        @Headers('x-tenant') subdomain: string,
        @Body() body: {
            category: string;
            amount: number;
            description?: string;
            expenseDate?: string;
        }
    ) {
        return this.profitService.addExpense(
            subdomain,
            body.category,
            body.amount,
            body.description,
            body.expenseDate ? new Date(body.expenseDate) : undefined,
        );
    }

    @Get('expenses')
    async getExpenses(
        @Headers('x-tenant') subdomain: string,
        @Query() query: { startDate?: string; endDate?: string }
    ) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;

        return this.profitService.getExpenses(subdomain, startDate, endDate);
    }

    @Get('dashboard-stats')
    async getDashboardStats(@Headers('x-tenant') subdomain: string) {
        return this.profitService.getDashboardStats(subdomain);
    }
}
