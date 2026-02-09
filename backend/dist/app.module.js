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
const auth_module_1 = require("./auth/auth.module");
const tenant_module_1 = require("./tenant/tenant.module");
const product_module_1 = require("./product/product.module");
const sale_module_1 = require("./sale/sale.module");
const customer_module_1 = require("./customer/customer.module");
const vendor_module_1 = require("./vendor/vendor.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const master_catalog_module_1 = require("./master-catalog/master-catalog.module");
const inventory_module_1 = require("./inventory/inventory.module");
const campaign_module_1 = require("./campaign/campaign.module");
const reconciliation_module_1 = require("./reconciliation/reconciliation.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            product_module_1.ProductModule,
            sale_module_1.SaleModule,
            customer_module_1.CustomerModule,
            vendor_module_1.VendorModule,
            dashboard_module_1.DashboardModule,
            master_catalog_module_1.MasterCatalogModule,
            inventory_module_1.InventoryModule,
            campaign_module_1.CampaignModule,
            reconciliation_module_1.ReconciliationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map