import { Controller, Get, Post, Delete, Put, Body, Param, Headers } from '@nestjs/common';
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

    // --- GLOBAL SUPER ADMIN ROUTES --- //

    @Get('global')
    async getGlobalCategories() {
        return this.categoryService.getGlobalCategories();
    }

    @Post('global')
    async addGlobalCategory(@Body() body: { name: string; description?: string }) {
        return this.categoryService.addGlobalCategory(body.name, body.description);
    }

    @Delete('global/:id')
    async deleteGlobalCategory(@Param('id') id: string) {
        return this.categoryService.deleteGlobalCategory(id);
    }

    @Put('global/:id')
    async updateGlobalCategory(
        @Param('id') id: string,
        @Body() body: { name: string; description?: string }
    ) {
        return this.categoryService.updateGlobalCategory(id, body.name, body.description);
    }

    @Put('global/rename/dynamic')
    async renameDynamicCategory(@Body() body: { oldName: string; newName: string }) {
        return this.categoryService.renameDynamicCategory(body.oldName, body.newName);
    }
}
