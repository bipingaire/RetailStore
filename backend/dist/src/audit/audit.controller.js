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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async startSession(subdomain, body) {
        return this.auditService.startAuditSession(subdomain, body.userId, body.notes);
    }
    async addCount(subdomain, id, body) {
        return this.auditService.addAuditCount(subdomain, id, body.productId, body.countedQuantity, body.reason);
    }
    async completeSession(subdomain, id) {
        return this.auditService.completeAuditSession(subdomain, id);
    }
    async rejectSession(subdomain, id) {
        return this.auditService.rejectAuditSession(subdomain, id);
    }
    async getSession(subdomain, id) {
        return this.auditService.getAuditSession(subdomain, id);
    }
    async getAllSessions(subdomain) {
        return this.auditService.getAllAuditSessions(subdomain);
    }
    async getVariances(subdomain) {
        return this.auditService.getVarianceReport(subdomain);
    }
    async submitBulk(subdomain, body) {
        return this.auditService.submitBulkAudit(subdomain, body.userId, body.items, body.notes);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Post)('session/start'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('session/:id/count'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "addCount", null);
__decorate([
    (0, common_1.Post)('session/:id/complete'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "completeSession", null);
__decorate([
    (0, common_1.Post)('session/:id/reject'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "rejectSession", null);
__decorate([
    (0, common_1.Get)('session/:id'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAllSessions", null);
__decorate([
    (0, common_1.Get)('variances'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getVariances", null);
__decorate([
    (0, common_1.Post)('submit-bulk'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "submitBulk", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('audit'),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map