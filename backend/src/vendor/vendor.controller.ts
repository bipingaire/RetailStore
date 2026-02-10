import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vendors')
@UseGuards(JwtAuthGuard)
export class VendorController {
    constructor(private vendorService: VendorService) { }

    @Get()
    findAll(@Headers('x-tenant') subdomain: string) {
        return this.vendorService.findAll(subdomain);
    }

    @Post()
    create(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { name: string }
    ) {
        return this.vendorService.create(subdomain, body.name);
    }

    @Get('invoices')
    findInvoices(@Headers('x-tenant') subdomain: string) {
        return this.vendorService.findInvoices(subdomain);
    }
}
