import { Controller, Get, Query } from '@nestjs/common';
import { MasterCatalogService } from './master-catalog.service';

@Controller('master-catalog')
export class MasterCatalogController {
  constructor(private masterCatalog: MasterCatalogService) {}

  @Get()
  getSharedCatalog(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.masterCatalog.getSharedCatalog({ 
      category, 
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }
}
