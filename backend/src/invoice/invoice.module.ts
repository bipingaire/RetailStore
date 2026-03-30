import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TenantPrismaService } from '../prisma/tenant-prisma.service';
import { TenantModule } from '../tenant/tenant.module';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [
        TenantModule,
        CategoryModule,
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads/invoices',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}-${file.originalname}`);
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB max
            },
        }),
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService, TenantPrismaService],
    exports: [InvoiceService],
})
export class InvoiceModule { }
