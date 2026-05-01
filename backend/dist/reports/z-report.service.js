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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZReportService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
const openai_1 = require("openai");
const path = require("path");
let ZReportService = class ZReportService {
    constructor(prisma, tenantService) {
        this.prisma = prisma;
        this.tenantService = tenantService;
        this.openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    }
    async parseZReport(buffer, originalname) {
        if (!process.env.OPENAI_API_KEY) {
            throw new common_1.BadRequestException('OPENAI_API_KEY is not configured');
        }
        const ext = path.extname(originalname).toLowerCase();
        let promptContent = [];
        const Z_PROMPT = `You are analysing a POS Z-Report (end-of-day sales report).
Extract the following from the document and return ONLY a JSON object with no markdown:
{
  "reportDate": "YYYY-MM-DD",
  "reportNumber": "string (or null if not present)",
  "totalSales": number,
  "totalTax": number (0 if not shown),
  "transactionCount": number (0 if not shown),
  "items": [
    // Array of precise items expressed as flat arrays strictly in this exact order:
    // [description (string), category (string), quantitySold (number), unitPrice (number), totalAmount (number)]
    ["item 1 name", "category", QTY, PRICE, TOTAL],
    ["item 2 name", "category", QTY, PRICE, TOTAL]
  ]
}
CRITICAL: Extract EVERY line item. Do not skip any items. To save token length, "items" MUST be an array of arrays (tuples) of exactly 5 elements each.`;
        if (ext === '.pdf') {
            const pdfParse = require('pdf-parse');
            let pdfData;
            if (typeof pdfParse === 'function') {
                pdfData = await pdfParse(buffer);
            }
            else if (pdfParse.default && typeof pdfParse.default === 'function') {
                pdfData = await pdfParse.default(buffer);
            }
            else {
                throw new Error('pdf-parse export is not a function');
            }
            const pdfText = pdfData.text || '';
            if (pdfText.trim().length >= 50) {
                promptContent = [
                    { type: 'text', text: `${Z_PROMPT}\n\nZ-REPORT TEXT:\n${pdfText.slice(0, 50000)}` }
                ];
            }
            else {
                const { createCanvas } = require('canvas');
                const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '';
                const uint8Array = new Uint8Array(buffer);
                const pdfDoc = await pdfjsLib.getDocument({ data: uint8Array }).promise;
                const page = await pdfDoc.getPage(1);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = createCanvas(viewport.width, viewport.height);
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                const base64 = canvas.toBuffer('image/png').toString('base64');
                promptContent = [
                    { type: 'text', text: Z_PROMPT },
                    { type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } }
                ];
            }
        }
        else {
            const base64 = buffer.toString('base64');
            const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
            promptContent = [
                { type: 'text', text: Z_PROMPT },
                { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } }
            ];
        }
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [{ role: 'user', content: promptContent }],
            max_completion_tokens: 100000,
            temperature: 0.1,
            response_format: { type: 'json_object' },
        });
        const raw = completion.choices[0].message.content || '{}';
        console.log('🤖 OpenAI Z-Report raw response:', raw.substring(0, 500));
        let data = {};
        try {
            let cleaned = raw
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/gi, '')
                .trim();
            const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (jsonMatch) {
                cleaned = jsonMatch[0];
            }
            data = JSON.parse(cleaned);
        }
        catch (parseErr) {
            const finishReason = completion.choices[0]?.finish_reason;
            console.error('❌ Z-Report JSON parse failed. Length:', raw.length, parseErr.message, 'Finish Reason:', finishReason);
            if (finishReason === 'length') {
                throw new common_1.BadRequestException('The Z-Report is too large and was cut off by the AI. Please split the report or use a shorter receipt.');
            }
            throw new common_1.BadRequestException(`JSON parse error: ${parseErr.message}. Total response length: ${raw.length} chars. Preview: ${raw.substring(0, 300)}`);
        }
        return {
            reportDate: data.reportDate || new Date().toISOString().split('T')[0],
            reportNumber: data.reportNumber || null,
            totalSales: Number(data.totalSales) || 0,
            totalTax: Number(data.totalTax) || 0,
            transactionCount: Number(data.transactionCount) || 0,
            items: (data.items || []).map((item) => {
                if (Array.isArray(item)) {
                    return {
                        description: String(item[0] || 'Unknown Item'),
                        category: String(item[1] || 'General'),
                        quantitySold: Number(item[2]) || 0,
                        unitPrice: Number(item[3]) || 0,
                        totalAmount: Number(item[4]) || 0,
                    };
                }
                return {
                    description: item.description || 'Unknown Item',
                    category: item.category || 'General',
                    quantitySold: Number(item.quantitySold) || 0,
                    unitPrice: Number(item.unitPrice) || 0,
                    totalAmount: Number(item.totalAmount) || 0,
                };
            }),
        };
    }
    async commitZReport(subdomain, reportData) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);
        const reportDate = new Date(reportData.reportDate);
        const reportNumber = reportData.reportNumber ||
            `Z-${reportData.reportDate}-${Date.now().toString().slice(-6)}`;
        const savedReport = await client.zReport.create({
            data: {
                reportDate,
                reportNumber,
                totalSales: reportData.totalSales,
                totalTax: reportData.totalTax,
                status: 'committed',
                processedAt: new Date(),
            },
        });
        const adjustments = [];
        await client.$transaction(async (tx) => {
            for (const item of reportData.items) {
                if (!item.quantitySold || item.quantitySold <= 0)
                    continue;
                const searchName = item.description.trim();
                const product = await tx.product.findFirst({
                    where: {
                        name: { contains: searchName, mode: 'insensitive' },
                        isSellable: true,
                    },
                });
                if (product) {
                    const updateData = { stock: { decrement: item.quantitySold } };
                    if (item.unitPrice && item.unitPrice > 0) {
                        updateData.price = Number(item.unitPrice);
                    }
                    await tx.product.update({
                        where: { id: product.id },
                        data: updateData,
                    });
                    await tx.stockMovement.create({
                        data: {
                            productId: product.id,
                            type: 'OUT',
                            quantity: item.quantitySold,
                            description: `Z-Report: ${reportNumber}`,
                        },
                    });
                    adjustments.push({ productName: item.description, qty: item.quantitySold, matched: true });
                }
                else {
                    const newProduct = await tx.product.create({
                        data: {
                            name: item.description.trim(),
                            sku: `ZRPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            category: item.category || 'General',
                            description: `Auto-created from Z-Report: ${reportNumber}`,
                            price: Number(item.unitPrice) || 0,
                            costPrice: Number(item.unitPrice) || 0,
                            stock: -item.quantitySold,
                            reorderLevel: 0,
                            isActive: true,
                            isSellable: true,
                            unitsPerParent: 1,
                        },
                    });
                    await tx.stockMovement.create({
                        data: {
                            productId: newProduct.id,
                            type: 'OUT',
                            quantity: item.quantitySold,
                            description: `Z-Report (auto-created): ${reportNumber}`,
                        },
                    });
                    adjustments.push({
                        productName: item.description,
                        qty: item.quantitySold,
                        matched: false,
                        autoCreated: true,
                    });
                }
            }
        });
        return {
            message: 'Z-Report committed. Stock adjusted for matched products.',
            reportId: savedReport.id,
            reportNumber,
            adjustments,
            unmatchedCount: adjustments.filter(a => !a.matched).length,
        };
    }
    async getZReports(subdomain) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.prisma.getTenantClient(tenant.databaseUrl);
        return client.zReport.findMany({ orderBy: { reportDate: 'desc' } });
    }
    async processZReport(subdomain, file, dateString) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const tenantClient = await this.prisma.getTenantClient(tenant.databaseUrl);
        const reportDate = dateString ? new Date(dateString) : new Date();
        const startOfDay = new Date(reportDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(reportDate);
        endOfDay.setHours(23, 59, 59, 999);
        const salesAgg = await tenantClient.sale.aggregate({
            where: { createdAt: { gte: startOfDay, lte: endOfDay }, status: 'COMPLETED' },
            _sum: { total: true, tax: true },
            _count: { id: true },
        });
        const reportNumber = `Z-${startOfDay.toISOString().split('T')[0]}-${Date.now().toString().slice(-6)}`;
        const savedReport = await tenantClient.zReport.create({
            data: {
                reportDate: startOfDay,
                reportNumber,
                totalSales: salesAgg._sum.total || 0,
                totalTax: salesAgg._sum.tax || 0,
                fileUrl: file ? ('http://mock-storage-url.com/' + (file.originalname || 'report.pdf')) : null,
                status: 'processed',
                processedAt: new Date(),
            }
        });
        return {
            message: 'Z-Report generated successfully from sales data',
            data: { ...savedReport, transactionCount: salesAgg._count.id },
            stats: { salesCount: salesAgg._count.id, totalSales: Number(salesAgg._sum.total || 0) }
        };
    }
};
exports.ZReportService = ZReportService;
exports.ZReportService = ZReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], ZReportService);
//# sourceMappingURL=z-report.service.js.map