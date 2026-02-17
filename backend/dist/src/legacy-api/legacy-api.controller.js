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
exports.LegacyApiController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../product/product.service");
const sale_service_1 = require("../sale/sale.service");
let LegacyApiController = class LegacyApiController {
    constructor(productService, saleService) {
        this.productService = productService;
        this.saleService = saleService;
    }
    async commitInventory(body) {
        return this.productService.commitInventory(body.tenantId, body.items);
    }
    async syncSales(body) {
        return this.saleService.syncSalesFromImage(body.tenantId, body.imageUrl);
    }
    async addProduct(body, req) {
        const tenantId = req.headers['x-tenant'] || body.tenantId;
        return this.productService.createProduct(tenantId, body);
    }
};
exports.LegacyApiController = LegacyApiController;
__decorate([
    (0, common_1.Post)('inventory/commit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LegacyApiController.prototype, "commitInventory", null);
__decorate([
    (0, common_1.Post)('sales/sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LegacyApiController.prototype, "syncSales", null);
__decorate([
    (0, common_1.Post)('admin/products/add-new'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LegacyApiController.prototype, "addProduct", null);
exports.LegacyApiController = LegacyApiController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        sale_service_1.SaleService])
], LegacyApiController);
//# sourceMappingURL=legacy-api.controller.js.map