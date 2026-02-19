import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
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
    async findAll(@Headers('x-tenant') subdomain: string) {
        return this.expenseService.getExpenses(subdomain);
    }
}
