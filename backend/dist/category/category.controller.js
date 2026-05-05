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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async getCategories(subdomain) {
        return this.categoryService.getCategories(subdomain);
    }
    async addCategory(subdomain, body) {
        return this.categoryService.addCategory(subdomain, body.name, body.description);
    }
    async deleteCategory(subdomain, id) {
        return this.categoryService.deleteCategory(subdomain, id);
    }
    async getGlobalCategories() {
        return this.categoryService.getGlobalCategories();
    }
    async addGlobalCategory(body) {
        return this.categoryService.addGlobalCategory(body.name, body.description);
    }
    async deleteGlobalCategory(id) {
        return this.categoryService.deleteGlobalCategory(id);
    }
    async updateGlobalCategory(id, body) {
        return this.categoryService.updateGlobalCategory(id, body.name, body.description);
    }
    async renameDynamicCategory(body) {
        return this.categoryService.renameDynamicCategory(body.oldName, body.newName);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('global'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getGlobalCategories", null);
__decorate([
    (0, common_1.Post)('global'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "addGlobalCategory", null);
__decorate([
    (0, common_1.Delete)('global/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteGlobalCategory", null);
__decorate([
    (0, common_1.Put)('global/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateGlobalCategory", null);
__decorate([
    (0, common_1.Put)('global/rename/dynamic'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "renameDynamicCategory", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map