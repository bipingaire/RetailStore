import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getCategories(@Headers('x-tenant') subdomain: string) {
        return this.categoryService.getCategories(subdomain);
    }

    @Post()
    async addCategory(
        @Headers('x-tenant') subdomain: string,
        @Body() body: { name: string; description?: string }
    ) {
        return this.categoryService.addCategory(subdomain, body.name, body.description);
    }

    @Delete(':id')
    async deleteCategory(
        @Headers('x-tenant') subdomain: string,
        @Param('id') id: string
    ) {
        return this.categoryService.deleteCategory(subdomain, id);
    }
}
