import { Controller, Post, Body, Headers, Get, Param, Delete } from '@nestjs/common';
import { TaxService } from './tax.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('tax')
export class TaxController {
    constructor(
        private readonly taxService: TaxService,
        private readonly prisma: PrismaService
    ) {}

    // Calculation Endpoint for Checkout
    @Post('calculate')
    async calculateTax(
        @Headers('x-tenant') subdomain: string,
        @Body() payload: { items: { sku: string, category: string, price: number, quantity: number }[] }
    ) {
        return this.taxService.calculateTax(subdomain, payload.items);
    }

    // --- SUPER ADMIN ENDPOINTS (Master DB) ---
    @Get('rules')
    async getAllRules() {
        return this.prisma.globalTaxRule.findMany({
            orderBy: [{ state: 'asc' }, { targetType: 'asc' }]
        });
    }

    @Post('rules')
    async addRule(@Body() body: { state: string, targetType: string, targetValue: string, taxRate: number }) {
        return this.prisma.globalTaxRule.create({
            data: {
                state: body.state,
                targetType: body.targetType,
                targetValue: body.targetValue,
                taxRate: body.taxRate
            }
        });
    }

    @Delete('rules/:id')
    async deleteRule(@Param('id') id: string) {
        return this.prisma.globalTaxRule.delete({
            where: { id }
        });
    }
}
