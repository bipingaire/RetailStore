import {
    Controller,
    Get,
    Post,
    Put,
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
            fileSize: 10 * 1024 * 1024 * 1024, // 10GB in bytes
        }
    }))
    async uploadInvoice(
        @Headers('x-tenant') subdomain: string,
        @UploadedFile() file: any,
        @Body() body: { vendorId: string; invoiceNumber: string; invoiceDate: string; totalAmount: string; items?: string },
    ) {
        console.log('📥 Upload invoice request received');

        let items = [];
        if (body.items) {
            try {
                items = JSON.parse(body.items);
                console.log('📦 Items parsed:', items.length);
            } catch (e) {
                console.error('Failed to parse items JSON', e);
            }
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
                fs.copyFileSync(file.path, filepath);
            }

            fileUrl = `/uploads/invoices/${filename}`;
        }

        // Call the real service which now handles auto-creation and stock updates
        try {
            const result = await this.invoiceService.uploadInvoice(
                subdomain,
                body.vendorId,
                body.invoiceNumber,
                new Date(body.invoiceDate),
                parseFloat(body.totalAmount),
                items,
                fileUrl
            );

            return {
                ...result,
                message: 'Invoice parsed, saved, and inventory updated successfully.'
            };
        } catch (error) {
            console.error('Error saving invoice:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to save invoice',
                message: error.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('test')
    testEndpoint() {
        return { success: true, message: 'Invoice controller is working!' };
    }

    @Post('parse')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 10 * 1024 * 1024 * 1024, // 10GB in bytes
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
            } else if (error?.message?.includes('PDF contains insufficient text')) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unreadable PDF',
                    message: error.message
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

    @Get(':id/parsed')
    async getInvoiceParsed(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.invoiceService.getInvoiceParsed(subdomain, id);
    }

    @Put(':id')
    async updateInvoice(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string,
        @Body() body: { vendorId: string; invoiceNumber: string; invoiceDate: string; totalAmount: string; items?: any[] }
    ) {
        return this.invoiceService.updateInvoice(
            subdomain,
            id,
            body.vendorId,
            body.invoiceNumber,
            new Date(body.invoiceDate),
            parseFloat(body.totalAmount),
            body.items || []
        );
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
