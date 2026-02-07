import { Module } from '@nestjs/common';
import { MasterCatalogService } from './master-catalog.service';
import { MasterCatalogController } from './master-catalog.controller';

@Module({
  providers: [MasterCatalogService],
  controllers: [MasterCatalogController],
  exports: [MasterCatalogService],
})
export class MasterCatalogModule {}
