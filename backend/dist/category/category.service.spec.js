"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const category_service_1 = require("./category.service");
describe('CategoryService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [category_service_1.CategoryService],
        }).compile();
        service = module.get(category_service_1.CategoryService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=category.service.spec.js.map