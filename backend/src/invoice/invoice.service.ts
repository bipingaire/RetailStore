import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { Prisma } from '../generated/tenant-client';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoiceService {
    constructor(
        private readonly tenantPrisma: TenantPrismaService,
        private readonly tenantService: TenantService,
    ) { }

    async uploadInvoice(
        subdomain: string,
        vendorId: string,
        invoiceNumber: string,
        invoiceDate: Date,
        totalAmount: number,
        items: Array<{
            description: string;
            category: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            expiryDate?: string;
        }>,
        fileUrl?: string,
    ) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        // Use interactive transaction for atomicity
        return client.$transaction(async (tx) => {
            // 1. Create the Invoice first
            const invoice = await tx.vendorInvoice.create({
                data: {
                    vendorId,
                    invoiceNumber,
                    invoiceDate,
                    totalAmount,
                    fileUrl,
                    status: 'committed', // Auto-commit
                },
            });

            // 2. Process each item
            for (const item of items) {
                // Try to find existing product by name (case-insensitive)
                let product = await tx.product.findFirst({
                    where: {
                        name: {
                            equals: item.description,
                            mode: 'insensitive',
                        },
                    },
                });

                // If not found, create new product
                if (!product) {
                    product = await tx.product.create({
                        data: {
                            name: item.description,
                            sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            category: item.category,
                            description: item.description,
                            price: new Prisma.Decimal(item.unitPrice * 1.5), // Default markup
                            costPrice: new Prisma.Decimal(item.unitPrice),
                            stock: 0, // Starts at 0, inventory logic will add
                            reorderLevel: 10,
                            isActive: true,
                        },
                    });
                }

                // 3. Create Invoice Item Link
                await tx.vendorInvoiceItem.create({
                    data: {
                        invoiceId: invoice.id,
                        productId: product.id,
                        quantity: item.quantity,
                        unitCost: new Prisma.Decimal(item.unitPrice),
                        totalCost: new Prisma.Decimal(item.totalPrice),
                    },
                });

                // 4. Update Product Stock & Cost
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        stock: { increment: item.quantity },
                        costPrice: new Prisma.Decimal(item.unitPrice), // Update latest cost
                    },
                });

                // 5. Log Stock Movement
                await tx.stockMovement.create({
                    data: {
                        productId: product.id,
                        type: 'IN',
                        quantity: item.quantity,
                        description: `Invoice: ${invoiceNumber}`,
                    },
                });

                // 6. Create Product Batch (Critical for Inventory Pulse Health)
                // Default to 1 year expiry if not specified
                const expiry = item.expiryDate
                    ? new Date(item.expiryDate)
                    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

                await tx.productBatch.create({
                    data: {
                        productId: product.id,
                        sku: product.sku,
                        quantity: item.quantity,
                        expiryDate: expiry,
                        receivedDate: new Date(),
                    }
                });
            }

            return invoice;
        }, {
            timeout: 20000, // Increase timeout for many items
        });
    }

    async getInvoice(subdomain: string, id: string) {
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

    async getAllInvoices(subdomain: string, status?: string) {
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

            const where: Prisma.VendorInvoiceWhereInput = status ? { status } : {};

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
        } catch (error) {
            console.error('Error in getAllInvoices:', error);
            throw error;
        }
    }

    async addInvoiceItems(subdomain: string, invoiceId: string, items: Array<{
        productId: string;
        quantity: number;
        unitCost: number;
    }>) {
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

    async commitInvoice(subdomain: string, invoiceId: string) {
        const tenant = await this.tenantService.getTenantBySubdomain(subdomain);
        const client = await this.tenantPrisma.getTenantClient(tenant.databaseUrl);

        // Get invoice with all items
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

        // Update inventory quantities in a transaction
        await client.$transaction(async (tx) => {
            // Update each product's stock
            for (const item of invoice.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                        costPrice: item.unitCost, // Update cost price to latest
                    },
                });

                // Create stock movement record
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'IN',
                        quantity: item.quantity,
                        description: `Invoice ${invoice.invoiceNumber}`,
                    },
                });
            }

            // Update invoice status
            await tx.vendorInvoice.update({
                where: { id: invoiceId },
                data: { status: 'committed' },
            });
        });

        return this.getInvoice(subdomain, invoiceId);
    }

    async parseInvoiceOCR(fileUrl: string) {
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
            let promptContent: any[] = [];

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
                } else if (pdfParse.default && typeof pdfParse.default === 'function') {
                    console.log('Using pdfParse.default');
                    pdfData = await pdfParse.default(buffer);
                } else {
                    throw new Error(`pdf-parse export is not a function: ${JSON.stringify(pdfParse)}`);
                }

                const pdfText = pdfData.text;
                console.log(`  - Extracted ${pdfText.length} characters of text`);

                // Check if PDF is scanned (insufficient text)
                if (!pdfText || pdfText.trim().length < 50) {
                    console.warn('⚠️ PDF contains insufficient text. Attempting to convert to image for OCR using native Canvas...');

                    try {
                        // Use native canvas + pdfjs-dist (via pdf-parse) to avoid external dependency issues
                        // We need to require these safely
                        const { createCanvas } = require('canvas');
                        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

                        // Disable worker for Node.js environment
                        pdfjsLib.GlobalWorkerOptions.workerSrc = '';

                        // Load the PDF document
                        // pdfjs-dist expects Uint8Array
                        const uint8Array = new Uint8Array(buffer);
                        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
                        const pdfDocument = await loadingTask.promise;

                        // Get the first page
                        const page = await pdfDocument.getPage(1);

                        // Set scale for high resolution (2.0 = 200% size, good for OCR)
                        const viewport = page.getViewport({ scale: 2.0 });

                        // Create canvas
                        const canvas = createCanvas(viewport.width, viewport.height);
                        const context = canvas.getContext('2d');

                        // Render PDF page to canvas
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        await page.render(renderContext).promise;

                        console.log('  - Successfully rendered PDF page 1 to Canvas');

                        // Convert canvas to PNG buffer
                        const base64Image = canvas.toBuffer('image/png').toString('base64');
                        const mimeType = 'image/png';
                        const dataUrl = `data:${mimeType};base64,${base64Image}`;

                        promptContent = [
                            {
                                type: "text",
                                text: `Analyze this invoice image (converted from PDF) and extract the following fields in JSON format.
CRITICAL: You must extract EVERY SINGLE LINE ITEM from the invoice. Do not summarize, do not skip items, and do not truncate the list. If there are 50 items, return 50 items.

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

                    } catch (conversionError) {
                        console.error('❌ PDF-to-Image native conversion failed:', conversionError);
                        throw new Error(`PDF contains insufficient text and could not be converted to image (Error: ${conversionError.message}). Please upload a clear image (JPG/PNG) instead.`);
                    }
                } else {
                    // Text-based PDF handling (existing logic)
                    // [...]
                    // Truncate text to avoid OpenAI Token Limits (429 Errors)
                    // 50,000 chars is roughly 10k-12k tokens, well within limits
                    const truncatedText = pdfText.slice(0, 50000);
                    if (pdfText.length > 50000) {
                        console.log(`  - Text truncated from ${pdfText.length} to 50000 characters`);
                    }

                    promptContent = [
                        {
                            type: "text",
                            text: `Analyze this invoice TEXT and extract the following fields in JSON format.
CRITICAL: You must extract EVERY SINGLE LINE ITEM from the invoice. Do not summarize, do not skip items, and do not truncate the list. If there are 50 items, return 50 items.

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
${truncatedText}`
                        }
                    ];
                }
            } else {
                // Image handling
                const base64Image = buffer.toString('base64');
                const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
                const dataUrl = `data:${mimeType};base64,${base64Image}`;
                console.log('  - Converted to base64');

                promptContent = [
                    {
                        type: "text",
                        text: `Analyze this invoice image and extract the following fields in JSON format.
CRITICAL: You must extract EVERY SINGLE LINE ITEM from the invoice. Do not summarize, do not skip items, and do not truncate the list. If there are 50 items, return 50 items.

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
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
            if (!content) throw new Error('No content returned from OpenAI');

            const data = JSON.parse(content);
            console.log('✅ OpenAI Response received');

            // Normalize data types
            const items = Array.isArray(data.items) ? data.items.map((item: any) => ({
                description: item.description || 'Item',
                category: item.category || 'General',
                quantity: Number(item.quantity) || 1,
                unitPrice: Number(item.unitPrice) || 0,
                totalPrice: Number(item.totalPrice) || 0,
                expiryDate: item.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 30 days from now
            })) : [];

            // Calculate total amount from items if it's missing or 0
            let totalAmount = Number(data.totalAmount) || 0;
            if (totalAmount === 0 && items.length > 0) {
                totalAmount = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
                console.log(`⚠️ Total amount missing/zero. Calculated from items: ${totalAmount}`);
            }

            return {
                vendorName: data.vendorName || 'Unknown Vendor',
                invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
                invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
                totalAmount: totalAmount,
                items: items,
            };

        } catch (error) {
            console.error('❌ OCR Service Error:', error);
            throw error; // Propagate error only, do NOT failover to mock data
        }
    }

    private getMockInvoiceData() {
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
}
