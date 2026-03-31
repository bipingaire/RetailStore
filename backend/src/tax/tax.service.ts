import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { TenantService } from '../tenant/tenant.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';

@Injectable()
export class TaxService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly settingsService: SettingsService,
        private readonly tenantService: TenantService,
        private readonly tenantPrisma: TenantPrismaService
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

        // 3. Fetch Local Tax Rules (Overrides)
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');
        const tClient = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        
        const localRules = await tClient.localTaxRule.findMany({
            where: { isActive: true }
        });

        // Hierarchy resolution maps
        const productRules = new Map();
        const globalCategoryRules = new Map();
        const localCategoryRules = new Map();
        let stateDefaultRule = null;

        for (const rule of globalRules) {
            if (rule.targetType === 'PRODUCT') productRules.set(rule.targetValue, rule.taxRate);
            if (rule.targetType === 'CATEGORY') globalCategoryRules.set(rule.targetValue, rule.taxRate);
            if (rule.targetType === 'DEFAULT') stateDefaultRule = rule.taxRate;
        }

        for (const rule of localRules) {
            localCategoryRules.set(rule.category, rule.taxRate);
        }

        // 3. Process Cart
        let totalTax = 0;
        const itemBreakdown = cartItems.map(item => {
            let appliedRate: number = defaultTaxRate;
            let appliedRule = defaultTaxRate > 0 ? 'STORE_DEFAULT' : 'NO_TAX';

            // Check hierarchy
            if (productRules.has(item.sku)) {
                appliedRate = Number(productRules.get(item.sku));
                appliedRule = 'GLOBAL_PRODUCT';
            } else if (localCategoryRules.has(item.category)) {
                appliedRate = Number(localCategoryRules.get(item.category));
                appliedRule = 'LOCAL_CATEGORY';
            } else if (globalCategoryRules.has(item.category)) {
                appliedRate = Number(globalCategoryRules.get(item.category));
                appliedRule = 'GLOBAL_CATEGORY';
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

    // --- LOCAL TENANT TAX RULES ---
    
    async getLocalTaxRules(subdomain: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');
        const tClient = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return tClient.localTaxRule.findMany({
            orderBy: { category: 'asc' }
        });
    }

    async addLocalTaxRule(subdomain: string, category: string, taxRate: number) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');
        const tClient = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return tClient.localTaxRule.upsert({
            where: { category },
            update: { taxRate, isActive: true },
            create: { category, taxRate, isActive: true }
        });
    }

    async deleteLocalTaxRule(subdomain: string, id: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        if (!tenant) throw new NotFoundException('Tenant not found');
        const tClient = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        return tClient.localTaxRule.delete({
            where: { id }
        });
    }
}
