"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (requestOrigin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3010',
                'https://retailos.cloud',
                'https://www.retailos.cloud',
                'https://indumart.us',
                'https://www.indumart.us',
            ];
            if (!requestOrigin)
                return callback(null, true);
            if (allowedOrigins.includes(requestOrigin)) {
                return callback(null, true);
            }
            if (/^https:\/\/[a-z0-9-]+\.indumart\.us$/.test(requestOrigin)) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    });
    app.use(express.json({ limit: '10gb' }));
    app.use(express.urlencoded({ limit: '10gb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port} (Backend Restarted)`);
}
bootstrap();
//# sourceMappingURL=main.js.map