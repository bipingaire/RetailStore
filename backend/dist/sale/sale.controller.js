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
exports.SaleController = void 0;
const common_1 = require("@nestjs/common");
const sale_service_1 = require("./sale.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SaleController = class SaleController {
    constructor(saleService) {
        this.saleService = saleService;
    }
    create(subdomain, req, dto) {
        return this.saleService.createSale(subdomain, { ...dto, userId: req.user.id });
    }
    findAll(subdomain, status, startDate, endDate, userId, customerId, limit, offset) {
        return this.saleService.findAll(subdomain, {
            status,
            startDate,
            endDate,
            userId,
            customerId,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        });
    }
    getStats(subdomain, startDate, endDate) {
        return this.saleService.getSalesStats(subdomain);
    }
    findOne(subdomain, id) {
        return this.saleService.findOne(subdomain, id);
    }
    cancel(subdomain, id, req) {
        return this.saleService.cancelSale(subdomain, id, req.user.id);
    }
    updateStatus(subdomain, id, body) {
        return this.saleService.updateSaleStatus(subdomain, id, body.status);
    }
};
exports.SaleController = SaleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", void 0)
], SaleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('userId')),
    __param(5, (0, common_1.Query)('customerId')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], SaleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SaleController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SaleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SaleController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SaleController.prototype, "updateStatus", null);
exports.SaleController = SaleController = __decorate([
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sale_service_1.SaleService])
], SaleController);
//# sourceMappingURL=sale.controller.js.map