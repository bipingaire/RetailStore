"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const z_report_controller_1 = require("./z-report.controller");
const z_report_service_1 = require("./z-report.service");
const profit_controller_1 = require("./profit.controller");
const profit_service_1 = require("./profit.service");
const tenant_module_1 = require("../tenant/tenant.module");
const prisma_module_1 = require("../prisma/prisma.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [tenant_module_1.TenantModule, prisma_module_1.PrismaModule],
        controllers: [z_report_controller_1.ZReportController, profit_controller_1.ProfitController],
        providers: [z_report_service_1.ZReportService, profit_service_1.ProfitService],
        exports: [z_report_service_1.ZReportService, profit_service_1.ProfitService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map