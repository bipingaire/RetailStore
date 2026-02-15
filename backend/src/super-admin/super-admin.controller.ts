
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
}
