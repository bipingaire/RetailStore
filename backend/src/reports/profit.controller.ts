import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProfitService } from './profit.service';

@Controller('reports/profit')
export class ProfitController {
    constructor(private readonly profitService: ProfitService) { }

    @Post('calculate')
    async calculate(@Body() body: {
        startDate: string;
        endDate: string;
        period: 'daily' | 'weekly' | 'monthly';
    }) {
        return this.profitService.calculateProfit(
            new Date(body.startDate),
            new Date(body.endDate),
            body.period,
        );
    }

    @Get()
    async getReports(@Query('period') period?: string) {
        return this.profitService.getProfitReports(period);
    }

    @Get('trends')
    async getTrends(@Query('days') days?: string) {
        return this.profitService.getProfitTrends(days ? parseInt(days) : 30);
    }

    @Get('category-breakdown')
    async getCategoryBreakdown(@Query() query: { startDate: string; endDate: string }) {
        return this.profitService.getCategoryBreakdown(
            new Date(query.startDate),
            new Date(query.endDate),
        );
    }

    @Post('expense')
    async addExpense(@Body() body: {
        category: string;
        amount: number;
        description?: string;
        expenseDate?: string;
    }) {
        return this.profitService.addExpense(
            body.category,
            body.amount,
            body.description,
            body.expenseDate ? new Date(body.expenseDate) : undefined,
        );
    }

    @Get('expenses')
    async getExpenses(@Query() query: { startDate?: string; endDate?: string }) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;

        return this.profitService.getExpenses(startDate, endDate);
    }
}
