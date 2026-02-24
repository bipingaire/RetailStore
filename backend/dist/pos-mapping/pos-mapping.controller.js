"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosMappingController = void 0;
const common_1 = require("@nestjs/common");
const pos_mapping_service_1 = require("./pos-mapping.service");
let PosMappingController = class PosMappingController {
    constructor(posMappingService) {
        this.posMappingService = posMappingService;
    }
    async findAll(tenantId) {
        return this.posMappingService.findAll(tenantId);
    }
    async update(tenantId, id, body) {
        return this.posMappingService.updateMapping(tenantId, id, body);
    }
    async verify(tenantId, id) {
        return this.posMappingService.verifyMapping(tenantId, id);
    }
};
exports.PosMappingController = PosMappingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PosMappingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PosMappingController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PosMappingController.prototype, "verify", null);
exports.PosMappingController = PosMappingController = __decorate([
    (0, common_1.Controller)('pos-mappings'),
    __metadata("design:paramtypes", [pos_mapping_service_1.PosMappingService])
], PosMappingController);
//# sourceMappingURL=pos-mapping.controller.js.map