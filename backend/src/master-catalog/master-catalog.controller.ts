import { Controller, Get, Query } from '@nestjs/common';
import { MasterCatalogService } from './master-catalog.service';

@Controller('master-catalog')
export class MasterCatalogController {
  constructor(private masterCatalog: MasterCatalogService) {}

  @Get()
  getSharedCatalog(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.masterCatalog.getSharedCatalog({ category, search });
  }
}
