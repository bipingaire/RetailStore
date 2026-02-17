"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosMappingModule = void 0;
const common_1 = require("@nestjs/common");
const pos_mapping_controller_1 = require("./pos-mapping.controller");
const pos_mapping_service_1 = require("./pos-mapping.service");
const tenant_module_1 = require("../tenant/tenant.module");
const prisma_module_1 = require("../prisma/prisma.module");
let PosMappingModule = class PosMappingModule {
};
exports.PosMappingModule = PosMappingModule;
exports.PosMappingModule = PosMappingModule = __decorate([
    (0, common_1.Module)({
        imports: [tenant_module_1.TenantModule, prisma_module_1.PrismaModule],
        controllers: [pos_mapping_controller_1.PosMappingController],
        providers: [pos_mapping_service_1.PosMappingService],
    })
], PosMappingModule);
//# sourceMappingURL=pos-mapping.module.js.map