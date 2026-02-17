import { Controller, Get, Headers, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(
    @Headers('x-tenant') subdomain: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dashboardService.getOverview(
      subdomain,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('sales-chart')
  getSalesChart(
    @Headers('x-tenant') subdomain: string,
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'week',
  ) {
    return this.dashboardService.getSalesChart(subdomain, period);
  }

  @Get('product-analytics')
  getProductAnalytics(@Headers('x-tenant') subdomain: string) {
    return this.dashboardService.getProductAnalytics(subdomain);
  }
}
