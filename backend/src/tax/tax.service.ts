import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class TaxService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly settingsService: SettingsService
    ) {}

    async calculateTax(subdomain: string, cartItems: { sku: string, category: string, price: number, quantity: number }[]) {
        // 1. Get Store State & Default Config
        const storeState = await this.settingsService.getSetting(subdomain, 'store_state') || 'Unknown';
        const rawDefaultTax = await this.settingsService.getSetting(subdomain, 'tax_rate') || '0';
        const defaultTaxRate = parseFloat(rawDefaultTax) || 0;

        // 2. Fetch Global Rules for this State
        const globalRules = await this.prisma.globalTaxRule.findMany({
            where: {
                isActive: true,
                OR: [
                    { state: storeState },
                    { state: 'ALL' }
                ]
            }
        });

        // Hierarchy resolution maps
        const productRules = new Map();
        const categoryRules = new Map();
        let stateDefaultRule = null;

        for (const rule of globalRules) {
            if (rule.targetType === 'PRODUCT') productRules.set(rule.targetValue, rule.taxRate);
            if (rule.targetType === 'CATEGORY') categoryRules.set(rule.targetValue, rule.taxRate);
            if (rule.targetType === 'DEFAULT') stateDefaultRule = rule.taxRate;
        }

        // 3. Process Cart
        let totalTax = 0;
        const itemBreakdown = cartItems.map(item => {
            let appliedRate: number = defaultTaxRate;
            let appliedRule = 'STORE_DEFAULT';

            // Check hierarchy
            if (productRules.has(item.sku)) {
                appliedRate = Number(productRules.get(item.sku));
                appliedRule = 'PRODUCT';
            } else if (categoryRules.has(item.category)) {
                appliedRate = Number(categoryRules.get(item.category));
                appliedRule = 'CATEGORY';
            } else if (stateDefaultRule !== null) {
                appliedRate = Number(stateDefaultRule);
                appliedRule = 'STATE_DEFAULT';
            }

            const itemSubtotal = item.price * item.quantity;
            const itemTax = itemSubtotal * (appliedRate / 100);
            totalTax += itemTax;

            return {
                ...item,
                appliedRate,
                appliedRule,
                itemTax,
                itemTotal: itemSubtotal + itemTax
            };
        });

        return {
            storeState,
            totalTax,
            breakdown: itemBreakdown
        };
    }
}
