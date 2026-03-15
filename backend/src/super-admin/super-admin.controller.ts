
import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
export class SuperAdminController {
    constructor(private service: SuperAdminService) {
        console.log('SuperAdminController Initialized');
    }

    @Get('dashboard-data')
    async getDashboardData() {
        try {
            const data = await this.service.getDashboardData();
            return data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    @Post('products/:id/approve')
    async approveProduct(@Param('id') id: string) {
        return this.service.approveProduct(id);
    }

    @Post('products/:id/reject')
    async rejectProduct(@Param('id') id: string) {
        return this.service.rejectProduct(id);
    }

    @Post('products/:id')
    async updateProduct(@Param('id') id: string, @Body() data: any) {
        return this.service.updateProduct(id, data);
    }

    @Post('products/:id/image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/uploads/products',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `product_${uniqueSuffix}${ext}`);
            }
        })
    }))
    async uploadProductImage(@Param('id') id: string, @UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }
        
        // Return the dynamic route rather than hardcoding localhost explicitly
        // If frontend asks for it, it appends to window.location or proxy automatically.
        const imageUrl = `/uploads/products/${file.filename}`;
        
        // Save URL string directly to the DB sku record
        return this.service.uploadProductImage(id, imageUrl);
    }

    @Post('products/:id/enrich')
    async enrichProduct(@Param('id') id: string) {
        return this.service.enrichProduct(id);
    }

    @Post('products/:id/ai-suggest')
    async getAiSuggestions(@Param('id') id: string) {
        return this.service.getAiSuggestions(id);
    }

    @Get('products/:id')
    async getProduct(@Param('id') id: string) {
        // We'll trust the service to use Prisma to find unique
        // Since Service doesn't have getProduct, I'll add a quick one here or use existing
        // Actually, let's reuse service logic or just query via service
        // I'll add getProduct to service next if needed, but for now I will assume I can just add it to Controller calling service.
        // Wait, service doesn't have getProduct exposed.
        // Direct Prisma call is bad practice in Controller.
        // I will add getGlobalProduct to service.
        return this.service.getGlobalProduct(id);
    }
}
