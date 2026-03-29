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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const invoice_service_1 = require("./invoice.service");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async uploadInvoice(subdomain, file, body) {
        console.log('📥 Upload invoice request received');
        let items = [];
        if (body.items) {
            try {
                items = JSON.parse(body.items);
                console.log('📦 Items parsed:', items.length);
            }
            catch (e) {
                console.error('Failed to parse items JSON', e);
            }
        }
        let fileUrl;
        if (file) {
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(process.cwd(), '..', 'public', 'uploads', 'invoices');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filename = `${Date.now()}-${file.originalname}`;
            const filepath = path.join(uploadDir, filename);
            if (file.buffer) {
                fs.writeFileSync(filepath, file.buffer);
            }
            else if (file.path) {
                fs.copyFileSync(file.path, filepath);
            }
            fileUrl = `/uploads/invoices/${filename}`;
        }
        try {
            const result = await this.invoiceService.uploadInvoice(subdomain, body.vendorId, body.invoiceNumber, new Date(body.invoiceDate), parseFloat(body.totalAmount), items, fileUrl);
            return {
                ...result,
                message: 'Invoice parsed, saved, and inventory updated successfully.'
            };
        }
        catch (error) {
            console.error('Error saving invoice:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to save invoice',
                message: error.message
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    testEndpoint() {
        return { success: true, message: 'Invoice controller is working!' };
    }
    async parseInvoice(file) {
        try {
            console.log('📄 Parse invoice request received');
            console.log('File:', file ? `${file.originalname} (${file.size} bytes)` : 'NO FILE');
            if (file) {
                console.log('File keys:', Object.keys(file));
            }
            if (!file) {
                throw new Error('No file uploaded');
            }
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(process.cwd(), '..', 'public', 'uploads', 'temp');
            if (!fs.existsSync(uploadDir)) {
                console.log('Creating upload directory:', uploadDir);
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filename = `${Date.now()}-${file.originalname}`;
            const filepath = path.join(uploadDir, filename);
            console.log('Saving file to:', filepath);
            if (file.buffer) {
                fs.writeFileSync(filepath, file.buffer);
            }
            else if (file.path) {
                console.log('File has no buffer, using path:', file.path);
                fs.copyFileSync(file.path, filepath);
            }
            else {
                throw new Error('Uploaded file has no buffer or path');
            }
            console.log('✅ File saved successfully');
            const fileUrl = `/uploads/temp/${filename}`;
            console.log('🤖 Calling OpenAI OCR with fileUrl:', fileUrl);
            const result = await this.invoiceService.parseInvoiceOCR(fileUrl);
            console.log('✅ OCR result:', result);
            return result;
        }
        catch (error) {
            console.error('❌ Error in parseInvoice:', error);
            if (error?.status === 429) {
                console.error('🚨 OpenAI QUOTA EXCEEDED - Billing issue!');
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.TOO_MANY_REQUESTS,
                    error: 'OpenAI Quota Exceeded',
                    message: 'Your OpenAI billing quota has been exceeded. Please check your plan and billing details.'
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            else if (error?.status === 401) {
                console.error('🚨 OpenAI INVALID API KEY!');
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNAUTHORIZED,
                    error: 'Invalid API Key',
                    message: 'The configured OpenAI API key is invalid.'
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            else if (error?.message === 'OPENAI_API_KEY is not configured') {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Missing Configuration',
                    message: 'OpenAI API Key is missing in server configuration.'
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            else if (error?.message?.includes('PDF contains insufficient text')) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Unreadable PDF',
                    message: error.message
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Invoice Parsing Failed',
                message: error?.message || 'Failed to parse invoice'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllInvoices(subdomain, status) {
        return this.invoiceService.getAllInvoices(subdomain, status);
    }
    async getInvoice(subdomain, id) {
        return this.invoiceService.getInvoice(subdomain, id);
    }
    async getInvoiceParsed(subdomain, id) {
        return this.invoiceService.getInvoiceParsed(subdomain, id);
    }
    async updateInvoice(subdomain, id, body) {
        return this.invoiceService.updateInvoice(subdomain, id, body.vendorId, body.invoiceNumber, new Date(body.invoiceDate), parseFloat(body.totalAmount), body.items || []);
    }
    async addItems(subdomain, id, body) {
        return this.invoiceService.addInvoiceItems(subdomain, id, body.items);
    }
    async commitInvoice(subdomain, id) {
        return this.invoiceService.commitInvoice(subdomain, id);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 10 * 1024 * 1024 * 1024,
        }
    })),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "uploadInvoice", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "testEndpoint", null);
__decorate([
    (0, common_1.Post)('parse'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 10 * 1024 * 1024 * 1024,
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "parseInvoice", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getAllInvoices", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.Get)(':id/parsed'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getInvoiceParsed", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "addItems", null);
__decorate([
    (0, common_1.Post)(':id/commit'),
    __param(0, (0, common_1.Headers)('x-tenant')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "commitInvoice", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map