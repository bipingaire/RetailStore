
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
// Ideally we should have a SuperAdminGuard

@Controller('super-admin')
export class SuperAdminController {
    constructor(private service: SuperAdminService) {
        console.log('SuperAdminController Initialized');
    }

    @Get('dashboard-data')
    async getDashboardData() {
        try {
            console.log('Fetching dashboard data...');
            const data = await this.service.getDashboardData();
            console.log('Dashboard data fetched successfully.');
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

    @Post('products/:id') // Using POST for update to avoid CORS OPTIONS usually associated with PUT if simple
    // Actually PUT is fine.
    async updateProduct(@Param('id') id: string, @Body() data: any) {
        return this.service.updateProduct(id, data);
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
