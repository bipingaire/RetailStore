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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const stock_movement_dto_1 = require("./dto/stock-movement.dto");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async createMovement(req, dto) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.createMovement(tenantId, dto);
    }
    async getMovements(req, productId, movementType) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.getMovements(tenantId, productId, movementType);
    }
    async getHealthMetrics(req) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.getHealthMetrics(tenantId);
    }
    async getLowStock(req) {
        const tenantId = req.headers['x-tenant-id'] || 'retail_store_anuj';
        return this.inventoryService.getLowStock(tenantId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('movements'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, stock_movement_dto_1.CreateStockMovementDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createMovement", null);
__decorate([
    (0, common_1.Get)('movements'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, common_1.Query)('movementType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)('health'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getHealthMetrics", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLowStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map