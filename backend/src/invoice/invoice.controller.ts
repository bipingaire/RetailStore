import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadInvoice(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { vendorId: string; invoiceNumber: string; invoiceDate: string; totalAmount: string },
    ) {
        // TODO: Save file to storage (S3, local, etc.) and get URL
        const fileUrl = file ? `/uploads/invoices/${file.filename}` : undefined;

        return this.invoiceService.uploadInvoice(
            body.vendorId,
            body.invoiceNumber,
            new Date(body.invoiceDate),
            parseFloat(body.totalAmount),
            fileUrl,
        );
    }

    @Post('parse')
    @UseInterceptors(FileInterceptor('file'))
    async parseInvoice(@UploadedFile() file: Express.Multer.File) {
        const fileUrl = file ? `/uploads/${file.filename}` : '';
        return this.invoiceService.parseInvoiceOCR(fileUrl);
    }

    @Get()
    async getAllInvoices(@Query('status') status?: string) {
        return this.invoiceService.getAllInvoices(status);
    }

    @Get(':id')
    async getInvoice(@Param('id') id: string) {
        return this.invoiceService.getInvoice(id);
    }

    @Post(':id/items')
    async addItems(
        @Param('id') id: string,
        @Body() body: { items: Array<{ productId: string; quantity: number; unitCost: number }> },
    ) {
        return this.invoiceService.addInvoiceItems(id, body.items);
    }

    @Post(':id/commit')
    async commitInvoice(@Param('id') id: string) {
        return this.invoiceService.commitInvoice(id);
    }
}
