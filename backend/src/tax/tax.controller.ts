import { Controller, Post, Body, Headers, Get, Param, Delete } from '@nestjs/common';
import { TaxService } from './tax.service';
import { PrismaService } from '../prisma/prisma.service';

function standardizeCategory(cat: string | null | undefined): string {
    if (!cat) return '';
    return cat.trim().split(/\s+/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

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
        const targetVal = body.targetType === 'CATEGORY' ? standardizeCategory(body.targetValue) || body.targetValue : body.targetValue;
        return this.prisma.globalTaxRule.create({
            data: {
                state: body.state,
                targetType: body.targetType,
                targetValue: targetVal,
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

    // --- TENANT LOCAL ENDPOINTS ---
    
    @Get('local-rules')
    async getLocalRules(@Headers('x-tenant') subdomain: string) {
        return this.taxService.getLocalTaxRules(subdomain);
    }

    @Post('local-rules')
    async addLocalRule(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { category: string, taxRate: number }
    ) {
        const standardCat = standardizeCategory(body.category) || body.category;
        return this.taxService.addLocalTaxRule(subdomain, standardCat, Number(body.taxRate));
    }

    @Delete('local-rules/:id')
    async deleteLocalRule(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.taxService.deleteLocalTaxRule(subdomain, id);
    }
}
