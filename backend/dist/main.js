"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.use(express.json({ limit: '1000mb' }));
    app.use(express.urlencoded({ limit: '1000mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    await app.listen(3001);
    console.log('🚀 Server running on http://localhost:3001 (Backend Restarted)');
}
bootstrap();
//# sourceMappingURL=main.js.map