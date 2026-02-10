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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const tenant_prisma_service_1 = require("../prisma/tenant-prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
const openai_1 = require("openai");
const fs = require("fs");
const path = require("path");
let InvoiceService = class InvoiceService {
    constructor(tenantPrisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.tenantService = tenantService;
    }
    async uploadInvoice(subdomain, vendorId, invoiceNumber, invoiceDate, totalAmount, fileUrl) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.vendorInvoice.create({
            data: {
                vendorId,
                invoiceNumber,
                invoiceDate,
                totalAmount,
                fileUrl,
                status: 'pending',
            },
        });
    }
    async getInvoice(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.vendorInvoice.findUnique({
            where: { id },
            include: {
                vendor: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async getAllInvoices(subdomain, status) {
        console.log(`getAllInvoices called for subdomain: ${subdomain}`);
        try {
            const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
            if (!tenant) {
                console.log(`Tenant not found for subdomain: ${subdomain}`);
                throw new Error(`Tenant not found for subdomain: ${subdomain}`);
            }
            console.log(`Tenant found: ${tenant.id}, DB: ${tenant.databaseUrl}`);
            const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
            console.log('Got tenant client');
            const where = status ? { status } : {};
            const invoices = await client.vendorInvoice.findMany({
                where,
                include: {
                    vendor: true,
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            console.log(`Found ${invoices.length} invoices`);
            return invoices;
        }
        catch (error) {
            console.error('Error in getAllInvoices:', error);
            throw error;
        }
    }
    async addInvoiceItems(subdomain, invoiceId, items) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const createItems = items.map(item => ({
            invoiceId,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            totalCost: item.quantity * item.unitCost,
        }));
        return client.vendorInvoiceItem.createMany({
            data: createItems,
        });
    }
    async commitInvoice(subdomain, invoiceId) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const invoice = await client.vendorInvoice.findUnique({
            where: { id: invoiceId },
            include: { items: true },
        });
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        if (invoice.status === 'committed') {
            throw new Error('Invoice already committed');
        }
        await client.$transaction(async (tx) => {
            for (const item of invoice.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                        costPrice: item.unitCost,
                    },
                });
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'IN',
                        quantity: item.quantity,
                        description: `Invoice ${invoice.invoiceNumber}`,
                    },
                });
            }
            await tx.vendorInvoice.update({
                where: { id: invoiceId },
                data: { status: 'committed' },
            });
        });
        return this.getInvoice(subdomain, invoiceId);
    }
    async parseInvoiceOCR(fileUrl) {
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ Missing OPENAI_API_KEY in environment variables');
            throw new Error('OPENAI_API_KEY is not configured');
        }
        console.log(`🔑 Using OpenAI Key: ${process.env.OPENAI_API_KEY?.substring(0, 10)}... (Length: ${process.env.OPENAI_API_KEY?.length})`);
        try {
            console.log('📂 Resolving file path...');
            const publicDir = path.join(process.cwd(), '..', 'public');
            console.log('  - Public Dir:', publicDir);
            const relativePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
            console.log('  - Relative Path:', relativePath);
            const filePath = path.join(publicDir, relativePath);
            console.log('  - Full File Path:', filePath);
            if (!fs.existsSync(filePath)) {
                console.error(`❌ File not found: ${filePath}`);
                throw new Error(`File not found at path: ${filePath}`);
            }
            const ext = path.extname(filePath).toLowerCase();
            let promptContent = [];
            console.log('📖 Reading file...');
            const buffer = fs.readFileSync(filePath);
            console.log(`  - File read, size: ${buffer.length} bytes`);
            if (ext === '.pdf') {
                console.log('📄 PDF detected. Extracting text...');
                const pdfParse = require('pdf-parse');
                console.log('pdfParse type:', typeof pdfParse);
                console.log('pdfParse keys:', Object.keys(pdfParse));
                let pdfData;
                if (typeof pdfParse === 'function') {
                    pdfData = await pdfParse(buffer);
                }
                else if (pdfParse.default && typeof pdfParse.default === 'function') {
                    console.log('Using pdfParse.default');
                    pdfData = await pdfParse.default(buffer);
                }
                else {
                    throw new Error(`pdf-parse export is not a function: ${JSON.stringify(pdfParse)}`);
                }
                const pdfText = pdfData.text;
                console.log(`  - Extracted ${pdfText.length} characters of text`);
                if (!pdfText || pdfText.trim().length === 0) {
                    throw new Error('PDF contains no extractable text (it might be a scanned image). Please upload an image instead.');
                }
                promptContent = [
                    {
                        type: "text",
                        text: `Analyze this invoice TEXT and extract the following fields in JSON format:
- vendorName: The vendor/supplier name
- invoiceNumber: The invoice number
- invoiceDate: Invoice date in YYYY-MM-DD format
- totalAmount: Total amount (number)
- items: Array of items, each with:
  - description: Item name/description
  - category: Product category (e.g., "Dairy", "Bakery", "Beverages", "Snacks", "Produce", "Frozen", "Household", "Electronics", etc.)
  - quantity: Quantity (number)
  - unitPrice: Unit price (number)
  - totalPrice: Total price for this item (number)
  - expiryDate: Suggested expiry/best-before date in YYYY-MM-DD format. For perishables use 7-30 days from invoice date, for packaged goods use 6-12 months, for non-perishables use 1-2 years. If the invoice shows an expiry date, use that.

Return ONLY the JSON object, no markdown formatting.

INVOICE TEXT:
${pdfText}`
                    }
                ];
            }
            else {
                const base64Image = buffer.toString('base64');
                const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
                const dataUrl = `data:${mimeType};base64,${base64Image}`;
                console.log('  - Converted to base64');
                promptContent = [
                    {
                        type: "text",
                        text: `Analyze this invoice image and extract the following fields in JSON format:
- vendorName: The vendor/supplier name
- invoiceNumber: The invoice number
- invoiceDate: Invoice date in YYYY-MM-DD format
- totalAmount: Total amount (number)
- items: Array of items, each with:
  - description: Item name/description
  - category: Product category (e.g., "Dairy", "Bakery", "Beverages", "Snacks", "Produce", "Frozen", "Household", "Electronics", etc.)
  - quantity: Quantity (number)
  - unitPrice: Unit price (number)
  - totalPrice: Total price for this item (number)
  - expiryDate: Suggested expiry/best-before date in YYYY-MM-DD format. For perishables use 7-30 days from invoice date, for packaged goods use 6-12 months, for non-perishables use 1-2 years. If the invoice shows an expiry date, use that.

Return ONLY the JSON object, no markdown formatting.`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            "url": dataUrl,
                        },
                    },
                ];
            }
            console.log('🤖 Initializing OpenAI client...');
            const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
            console.log('🚀 Sending request to OpenAI API...');
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: promptContent,
                    },
                ],
                response_format: { type: "json_object" },
            });
            const content = response.choices[0].message.content;
            if (!content)
                throw new Error('No content returned from OpenAI');
            const data = JSON.parse(content);
            console.log('✅ OpenAI Response received');
            return {
                vendorName: data.vendorName || 'Unknown Vendor',
                invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
                invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
                totalAmount: Number(data.totalAmount) || 0,
                items: Array.isArray(data.items) ? data.items.map((item) => ({
                    description: item.description || 'Item',
                    category: item.category || 'General',
                    quantity: Number(item.quantity) || 1,
                    unitPrice: Number(item.unitPrice) || 0,
                    totalPrice: Number(item.totalPrice) || 0,
                    expiryDate: item.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                })) : [],
            };
        }
        catch (error) {
            console.error('❌ OCR Service Error:', error);
            throw error;
        }
    }
    getMockInvoiceData() {
        return {
            vendorName: 'Mock Vendor (OCR Failed)',
            invoiceNumber: `INV-${Date.now()}`,
            invoiceDate: new Date(),
            items: [
                {
                    description: 'Sample Product',
                    category: 'General',
                    quantity: 10,
                    unitPrice: 25.00,
                    totalPrice: 250.00,
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    description: 'Fresh Item',
                    category: 'Perishable',
                    quantity: 5,
                    unitPrice: 10.00,
                    totalPrice: 50.00,
                    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
            ],
            totalAmount: 300.00,
        };
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_prisma_service_1.TenantPrismaService,
        tenant_service_1.TenantService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map