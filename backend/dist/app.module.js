"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const tenant_module_1 = require("./tenant/tenant.module");
const product_module_1 = require("./product/product.module");
const sale_module_1 = require("./sale/sale.module");
const customer_module_1 = require("./customer/customer.module");
const legacy_api_module_1 = require("./legacy-api/legacy-api.module");
const vendor_module_1 = require("./vendor/vendor.module");
const invoice_module_1 = require("./invoice/invoice.module");
const audit_module_1 = require("./audit/audit.module");
const purchase_order_module_1 = require("./purchase-order/purchase-order.module");
const campaign_module_1 = require("./campaign/campaign.module");
const settings_module_1 = require("./settings/settings.module");
const reports_module_1 = require("./reports/reports.module");
const tenant_prisma_service_1 = require("./prisma/tenant-prisma.service");
const super_admin_module_1 = require("./super-admin/super-admin.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const pos_mapping_module_1 = require("./pos-mapping/pos-mapping.module");
const social_module_1 = require("./social/social.module");
const expense_module_1 = require("./expense/expense.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            product_module_1.ProductModule,
            sale_module_1.SaleModule,
            customer_module_1.CustomerModule,
            legacy_api_module_1.LegacyApiModule,
            vendor_module_1.VendorModule,
            invoice_module_1.InvoiceModule,
            audit_module_1.AuditModule,
            purchase_order_module_1.PurchaseOrderModule,
            campaign_module_1.CampaignModule,
            settings_module_1.SettingsModule,
            super_admin_module_1.SuperAdminModule,
            dashboard_module_1.DashboardModule,
            pos_mapping_module_1.PosMappingModule,
            reports_module_1.ReportsModule,
            pos_mapping_module_1.PosMappingModule,
            reports_module_1.ReportsModule,
            social_module_1.SocialModule,
            expense_module_1.ExpenseModule,
        ],
        controllers: [],
        providers: [tenant_prisma_service_1.TenantPrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map