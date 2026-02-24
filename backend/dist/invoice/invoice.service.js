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
const tenant_client_1 = require("../generated/tenant-client");
const openai_1 = require("openai");
const fs = require("fs");
const path = require("path");
let InvoiceService = class InvoiceService {
    constructor(tenantPrisma, tenantService) {
        this.tenantPrisma = tenantPrisma;
        this.tenantService = tenantService;
    }
    async uploadInvoice(subdomain, vendorId, invoiceNumber, invoiceDate, totalAmount, items, fileUrl) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        return client.$transaction(async (tx) => {
            const invoice = await tx.vendorInvoice.create({
                data: {
                    vendorId,
                    invoiceNumber,
                    invoiceDate,
                    totalAmount,
                    fileUrl,
                    status: 'committed',
                },
            });
            for (const item of items) {
                let product = await tx.product.findFirst({
                    where: {
                        name: {
                            equals: item.description,
                            mode: 'insensitive',
                        },
                    },
                });
                const unitsPerCase = item.unitsPerCase || 1;
                const retailUnits = item.quantity * unitsPerCase;
                const costPerUnit = unitsPerCase > 1
                    ? item.casePrice / unitsPerCase
                    : (item.costPerUnit || item.unitPrice);
                if (!product) {
                    const sellingPrice = item.sellingPrice
                        ? item.sellingPrice
                        : costPerUnit * 1.3;
                    product = await tx.product.create({
                        data: {
                            name: item.description,
                            sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            category: item.category,
                            description: `${item.description}${item.unitSize ? ` (${item.unitSize})` : ''}`,
                            price: new tenant_client_1.Prisma.Decimal(sellingPrice),
                            costPrice: new tenant_client_1.Prisma.Decimal(costPerUnit),
                            stock: 0,
                            reorderLevel: 10,
                            isActive: true,
                        },
                    });
                }
                else {
                    await tx.product.update({
                        where: { id: product.id },
                        data: { costPrice: new tenant_client_1.Prisma.Decimal(costPerUnit) },
                    });
                }
                await tx.vendorInvoiceItem.create({
                    data: {
                        invoiceId: invoice.id,
                        productId: product.id,
                        quantity: retailUnits,
                        unitCost: new tenant_client_1.Prisma.Decimal(costPerUnit),
                        totalCost: new tenant_client_1.Prisma.Decimal(item.totalPrice),
                    },
                });
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        stock: { increment: retailUnits },
                    },
                });
                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: 'IN',
                        quantity: item.quantity,
                        description: `Invoice: ${invoiceNumber}`,
                    },
                });
                const expiry = item.expiryDate
                    ? new Date(item.expiryDate)
                    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
                await tx.productBatch.create({
                    data: {
                        productId: product.id,
                        sku: product.sku,
                        quantity: retailUnits,
                        expiryDate: expiry,
                        receivedDate: new Date(),
                    }
                });
            }
            return invoice;
        }, {
            timeout: 20000,
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
    async getInvoiceParsed(subdomain, id) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const invoice = await client.vendorInvoice.findUnique({
            where: { id },
            include: {
                vendor: true,
                items: {
                    include: {
                        product: { include: { Batches: true } },
                    },
                },
            },
        });
        if (!invoice)
            throw new Error('Invoice not found');
        const items = invoice.items.map(item => {
            const product = item.product;
            const unitsPerCase = product?.unitsPerParent || 1;
            const cases = item.quantity / unitsPerCase;
            const batch = product?.Batches?.[0];
            return {
                dbItemId: item.id,
                productId: product?.id,
                description: product?.name || 'Unknown',
                category: product?.category || 'General',
                quantity: cases,
                unitsPerCase: unitsPerCase,
                unitSize: '',
                casePrice: Number(item.unitCost) * unitsPerCase,
                costPerUnit: Number(item.unitCost),
                unitPrice: Number(item.unitCost),
                retailUnits: item.quantity,
                totalPrice: Number(item.totalCost),
                sellingPrice: Number(product?.price || 0),
                expiryDate: batch?.expiryDate ? batch.expiryDate.toISOString().split('T')[0] : null,
            };
        });
        return {
            vendorId: invoice.vendorId,
            vendorName: invoice.vendor?.name || '',
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate,
            totalAmount: Number(invoice.totalAmount),
            fileUrl: invoice.fileUrl,
            items: items,
        };
    }
    async updateInvoice(subdomain, id, vendorId, invoiceNumber, invoiceDate, totalAmount, items) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);
        const invoice = await client.vendorInvoice.findUnique({ where: { id } });
        if (!invoice)
            throw new Error('Invoice not found');
        if (invoice.status === 'committed')
            throw new Error('Cannot edit committed invoice');
        return await client.$transaction(async (tx) => {
            const updatedInvoice = await tx.vendorInvoice.update({
                where: { id },
                data: {
                    vendorId,
                    invoiceNumber,
                    invoiceDate,
                    totalAmount,
                }
            });
            for (const item of items) {
                const cases = Number(item.quantity) || 1;
                const unitsPerCase = Number(item.unitsPerCase) || 1;
                const retailUnits = cases * unitsPerCase;
                const casePrice = Number(item.casePrice) || Number(item.unitPrice) || 0;
                const costPerUnit = unitsPerCase > 1 ? (casePrice / unitsPerCase) : casePrice;
                let productId = item.productId;
                if (productId) {
                    if (item.sellingPrice !== null && item.sellingPrice !== undefined) {
                        await tx.product.update({
                            where: { id: productId },
                            data: {
                                price: item.sellingPrice,
                                costPrice: costPerUnit
                            }
                        });
                    }
                    if (item.dbItemId) {
                        await tx.vendorInvoiceItem.update({
                            where: { id: item.dbItemId },
                            data: {
                                quantity: retailUnits,
                                unitCost: costPerUnit,
                                totalCost: item.totalPrice || (cases * casePrice),
                            }
                        });
                        const existingItem = await tx.vendorInvoiceItem.findUnique({ where: { id: item.dbItemId } });
                        if (existingItem) {
                            const diff = retailUnits - existingItem.quantity;
                            if (diff !== 0) {
                                await tx.product.update({
                                    where: { id: productId },
                                    data: { stock: { increment: diff } }
                                });
                            }
                        }
                    }
                    else {
                        await tx.vendorInvoiceItem.create({
                            data: {
                                invoiceId: id,
                                productId: productId,
                                quantity: retailUnits,
                                unitCost: costPerUnit,
                                totalCost: item.totalPrice || (cases * casePrice),
                            }
                        });
                        await tx.product.update({
                            where: { id: productId },
                            data: { stock: { increment: retailUnits } }
                        });
                    }
                }
            }
            return updatedInvoice;
        }, { timeout: 20000 });
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
                    items: {
                        include: {
                            product: true
                        }
                    },
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
                if (!pdfText || pdfText.trim().length < 50) {
                    console.warn('⚠️ PDF contains insufficient text. Attempting to convert to image for OCR using native Canvas...');
                    try {
                        const { createCanvas } = require('canvas');
                        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
                        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
                        const uint8Array = new Uint8Array(buffer);
                        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
                        const pdfDocument = await loadingTask.promise;
                        const page = await pdfDocument.getPage(1);
                        const viewport = page.getViewport({ scale: 2.0 });
                        const canvas = createCanvas(viewport.width, viewport.height);
                        const context = canvas.getContext('2d');
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        await page.render(renderContext).promise;
                        console.log('  - Successfully rendered PDF page 1 to Canvas');
                        const base64Image = canvas.toBuffer('image/png').toString('base64');
                        const mimeType = 'image/png';
                        const dataUrl = `data:${mimeType};base64,${base64Image}`;
                        promptContent = [
                            {
                                type: "text",
                                text: `Analyze this invoice image (converted from PDF) and extract the following fields in JSON format.
CRITICAL: You must extract EVERY SINGLE LINE ITEM from the invoice. Do not summarize, do not skip items, and do not truncate the list. If there are 50 items, return 50 items.

IMPORTANT - BULK PACK LOGIC: Invoices use BULK/WHOLESALE quantities. For example "5 x 24x300gm" means 5 CASES each containing 24 retail units of 300gm. You MUST separate the bulk case quantity from the retail unit count.

- vendorName: The vendor/supplier name
- invoiceNumber: The invoice number
- invoiceDate: Invoice date in YYYY-MM-DD format
- totalAmount: Total amount (number)
- items: Array of items, each with:
  - description: Item name (retail product name, e.g. "Coca-Cola 300ml")
  - category: Product category (e.g. "Beverages", "Dairy", "Snacks", "Frozen", etc.)
  - quantity: Number of CASES ordered (bulk qty, e.g. 5)
  - unitsPerCase: Number of retail units per case (e.g. 24 from "24x300gm"). If not a bulk pack, set to 1.
  - unitSize: Retail unit size/volume (e.g. "300gm", "1L", "500ml"). Empty string if not applicable.
  - casePrice: Price PER CASE (the invoice price, e.g. 60.00)
  - costPerUnit: casePrice divided by unitsPerCase (e.g. 2.50)
  - unitPrice: Same as costPerUnit (for compatibility)
  - totalPrice: Total price for this line item (quantity x casePrice)
  - expiryDate: Suggested expiry/best-before date in YYYY-MM-DD format.
Return ONLY the JSON object.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: dataUrl
                                }
                            }
                        ];
                    }
                    catch (conversionError) {
                        console.error('❌ PDF-to-Image native conversion failed:', conversionError);
                        throw new Error(`PDF contains insufficient text and could not be converted to image (Error: ${conversionError.message}). Please upload a clear image (JPG/PNG) instead.`);
                    }
                }
                else {
                    const truncatedText = pdfText.slice(0, 50000);
                    if (pdfText.length > 50000) {
                        console.log(`  - Text truncated from ${pdfText.length} to 50000 characters`);
                    }
                    promptContent = [
                        {
                            type: "text",
                            text: `Analyze this invoice TEXT and extract the following fields in JSON format.
CRITICAL: You must extract EVERY SINGLE LINE ITEM from the invoice. Do not summarize, do not skip items, and do not truncate the list. If there are 50 items, return 50 items.

IMPORTANT - BULK PACK LOGIC: Invoices use BULK/WHOLESALE quantities. For example "5 x 24x300gm" means 5 CASES each containing 24 retail units of 300gm. You MUST separate the bulk case quantity from the retail unit count.

- vendorName: The vendor/supplier name
- invoiceNumber: The invoice number
- invoiceDate: Invoice date in YYYY-MM-DD format
- totalAmount: Total amount (number)
- items: Array of items, each with:
  - description: Item name (retail product name, e.g. "Coca-Cola 300ml")
  - category: Product category (e.g. "Beverages", "Dairy", "Snacks", "Frozen", etc.)
  - quantity: Number of CASES ordered (bulk qty, e.g. 5)
  - unitsPerCase: Number of retail units per case (e.g. 24 from "24x300gm"). If not a bulk pack, set to 1.
  - unitSize: Retail unit size/volume (e.g. "300gm", "1L", "500ml"). Empty string if not applicable.
  - casePrice: Price PER CASE (the invoice price)
  - costPerUnit: casePrice divided by unitsPerCase
  - unitPrice: Same as costPerUnit (for compatibility)
  - totalPrice: Total price for this line item (quantity x casePrice)
  - expiryDate: Suggested expiry/best-before date in YYYY-MM-DD format. For perishables use 7-30 days, packaged goods 6-12 months, non-perishables 1-2 years.

Return ONLY the JSON object, no markdown formatting.

INVOICE TEXT:
${truncatedText}`
                        }
                    ];
                }
            }
            else {
                const base64Image = buffer.toString('base64');
                const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
                const dataUrl = `data:${mimeType};base64,${base64Image}`;
                console.log('  - Converted to base64');
                promptContent = [
                    {
                        type: "text",
                        text: `Analyze this invoice image and extract the following fields in JSON format.
CRITICAL: You must extract EVERY SINGLE LINE ITEM from the invoice. Do not summarize, do not skip items, and do not truncate the list. If there are 50 items, return 50 items.

IMPORTANT - BULK PACK LOGIC: Invoices use BULK/WHOLESALE quantities. For example "5 x 24x300gm" means 5 CASES each containing 24 retail units of 300gm. You MUST separate the bulk case quantity from the retail unit count.

- vendorName: The vendor/supplier name
- invoiceNumber: The invoice number
- invoiceDate: Invoice date in YYYY-MM-DD format
- totalAmount: Total amount (number)
- items: Array of items, each with:
  - description: Item name (retail product name, e.g. "Coca-Cola 300ml")
  - category: Product category (e.g. "Beverages", "Dairy", "Snacks", "Frozen", etc.)
  - quantity: Number of CASES ordered (bulk qty, e.g. 5)
  - unitsPerCase: Number of retail units per case (e.g. 24 from "24x300gm"). If not a bulk pack, set to 1.
  - unitSize: Retail unit size/volume (e.g. "300gm", "1L", "500ml"). Empty string if not applicable.
  - casePrice: Price PER CASE (the invoice price)
  - costPerUnit: casePrice divided by unitsPerCase
  - unitPrice: Same as costPerUnit (for compatibility)
  - totalPrice: Total price for this line item (quantity x casePrice)
  - expiryDate: Suggested expiry/best-before date in YYYY-MM-DD format. For perishables use 7-30 days, packaged goods 6-12 months, non-perishables 1-2 years.

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
            const items = Array.isArray(data.items) ? data.items.map((item) => {
                const cases = Number(item.quantity) || 1;
                const unitsPerCase = Number(item.unitsPerCase) || 1;
                const casePrice = Number(item.casePrice) || Number(item.unitPrice) || 0;
                const costPerUnit = unitsPerCase > 1 ? (casePrice / unitsPerCase) : casePrice;
                const retailUnits = cases * unitsPerCase;
                return {
                    description: item.description || 'Item',
                    category: item.category || 'General',
                    quantity: cases,
                    unitsPerCase,
                    unitSize: item.unitSize || '',
                    casePrice,
                    costPerUnit,
                    unitPrice: costPerUnit,
                    retailUnits,
                    totalPrice: Number(item.totalPrice) || (cases * casePrice),
                    sellingPrice: null,
                    expiryDate: item.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                };
            }) : [];
            let totalAmount = Number(data.totalAmount) || 0;
            if (totalAmount === 0 && items.length > 0) {
                totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
                console.log(`⚠️ Total amount missing/zero. Calculated from items: ${totalAmount}`);
            }
            return {
                vendorName: data.vendorName || 'Unknown Vendor',
                invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
                invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
                totalAmount: totalAmount,
                items: items,
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