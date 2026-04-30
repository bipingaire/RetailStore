import { Controller, Get, Post, Body, Headers, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expenses')
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    @Post()
    async create(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { expenseDate: string; category: string; amount: number; description?: string }
    ) {
        return this.expenseService.createExpense(subdomain, body);
    }

    @Get()
    async findAll(
        @Headers('x-tenant') subdomain: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.expenseService.getExpenses(subdomain, {
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            search,
            category,
            startDate,
            endDate,
        });
    }
}
