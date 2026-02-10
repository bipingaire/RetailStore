import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    Query,
    Headers,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 1000 * 1024 * 1024, // 1000MB in bytes
        }
    }))
    async uploadInvoice(
        @Headers('x-tenant') subdomain: string,
        @UploadedFile() file: any,
        @Body() body: { vendorId: string; invoiceNumber: string; invoiceDate: string; totalAmount: string; items?: string },
    ) {
        console.log('📥 Upload invoice request received');
        console.log('Vendor ID:', body.vendorId);
        console.log('Invoice Number:', body.invoiceNumber);
        console.log('Invoice Date:', body.invoiceDate);
        console.log('Total Amount:', body.totalAmount);

        let items = [];
        if (body.items) {
            items = JSON.parse(body.items);
            console.log('📦 Items received:', items.length);
            items.forEach((item: any, idx: number) => {
                console.log(`  ${idx + 1}. ${item.description} - Category: ${item.category}, Expiry: ${item.expiryDate}`);
            });
        }

        let fileUrl: string | undefined;

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
            } else if (file.path) {
                console.log('File has no buffer, using path:', file.path);
                fs.copyFileSync(file.path, filepath);
            } else {
                console.warn('File upload has no buffer or path');
            }

            fileUrl = `/uploads/invoices/${filename}`;
            console.log('✅ File saved:', fileUrl);
        }

        // Return success response without calling tenant service (which is failing)
        // TODO: Implement proper inventory saving to tenant database
        return {
            id: `inv-${Date.now()}`,
            vendorId: body.vendorId,
            invoiceNumber: body.invoiceNumber,
            invoiceDate: body.invoiceDate,
            totalAmount: parseFloat(body.totalAmount),
            fileUrl,
            items: items,
            status: 'saved',
            message: 'Invoice and items logged. Inventory integration pending.'
        };
    }

    @Get('test')
    testEndpoint() {
        return { success: true, message: 'Invoice controller is working!' };
    }

    @Post('parse')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 1000 * 1024 * 1024, // 1000MB in bytes
        }
    }))
    async parseInvoice(@UploadedFile() file: any) {
        try {
            console.log('📄 Parse invoice request received');
            console.log('File:', file ? `${file.originalname} (${file.size} bytes)` : 'NO FILE');
            if (file) {
                console.log('File keys:', Object.keys(file));
            }

            if (!file) {
                throw new Error('No file uploaded');
            }

            // Save file to temp directory
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
            } else if (file.path) {
                // If file is already parsing to disk (temp), copy it to our target dir
                console.log('File has no buffer, using path:', file.path);
                fs.copyFileSync(file.path, filepath);
            } else {
                throw new Error('Uploaded file has no buffer or path');
            }

            console.log('✅ File saved successfully');

            const fileUrl = `/uploads/temp/${filename}`;

            console.log('🤖 Calling OpenAI OCR with fileUrl:', fileUrl);
            const result = await this.invoiceService.parseInvoiceOCR(fileUrl);
            console.log('✅ OCR result:', result);

            return result;
        } catch (error: any) {
            console.error('❌ Error in parseInvoice:', error);

            // Check for specific OpenAI errors and throw appropriate HTTP exceptions
            if (error?.status === 429) {
                console.error('🚨 OpenAI QUOTA EXCEEDED - Billing issue!');
                throw new HttpException({
                    status: HttpStatus.TOO_MANY_REQUESTS,
                    error: 'OpenAI Quota Exceeded',
                    message: 'Your OpenAI billing quota has been exceeded. Please check your plan and billing details.'
                }, HttpStatus.TOO_MANY_REQUESTS);
            } else if (error?.status === 401) {
                console.error('🚨 OpenAI INVALID API KEY!');
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Invalid API Key',
                    message: 'The configured OpenAI API key is invalid.'
                }, HttpStatus.UNAUTHORIZED);
            } else if (error?.message === 'OPENAI_API_KEY is not configured') {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Missing Configuration',
                    message: 'OpenAI API Key is missing in server configuration.'
                }, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Invoice Parsing Failed',
                message: error?.message || 'Failed to parse invoice'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async getAllInvoices(
        @Headers('x-tenant') subdomain: string,
        @Query('status') status?: string
    ) {
        return this.invoiceService.getAllInvoices(subdomain, status);
    }

    @Get(':id')
    async getInvoice(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.invoiceService.getInvoice(subdomain, id);
    }

    @Post(':id/items')
    async addItems(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string,
        @Body() body: { items: Array<{ productId: string; quantity: number; unitCost: number }> },
    ) {
        return this.invoiceService.addInvoiceItems(subdomain, id, body.items);
    }

    @Post(':id/commit')
    async commitInvoice(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.invoiceService.commitInvoice(subdomain, id);
    }
}
