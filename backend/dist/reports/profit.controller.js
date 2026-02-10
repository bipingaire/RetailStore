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
exports.ProfitController = void 0;
const common_1 = require("@nestjs/common");
const profit_service_1 = require("./profit.service");
let ProfitController = class ProfitController {
    constructor(profitService) {
        this.profitService = profitService;
    }
    async calculate(body) {
        return this.profitService.calculateProfit(new Date(body.startDate), new Date(body.endDate), body.period);
    }
    async getReports(period) {
        return this.profitService.getProfitReports(period);
    }
    async getTrends(days) {
        return this.profitService.getProfitTrends(days ? parseInt(days) : 30);
    }
    async getCategoryBreakdown(query) {
        return this.profitService.getCategoryBreakdown(new Date(query.startDate), new Date(query.endDate));
    }
    async addExpense(body) {
        return this.profitService.addExpense(body.category, body.amount, body.description, body.expenseDate ? new Date(body.expenseDate) : undefined);
    }
    async getExpenses(query) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;
        return this.profitService.getExpenses(startDate, endDate);
    }
};
exports.ProfitController = ProfitController;
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfitController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfitController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('trends'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfitController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('category-breakdown'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfitController.prototype, "getCategoryBreakdown", null);
__decorate([
    (0, common_1.Post)('expense'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfitController.prototype, "addExpense", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfitController.prototype, "getExpenses", null);
exports.ProfitController = ProfitController = __decorate([
    (0, common_1.Controller)('reports/profit'),
    __metadata("design:paramtypes", [profit_service_1.ProfitService])
], ProfitController);
//# sourceMappingURL=profit.controller.js.map