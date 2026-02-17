"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('❌ Failed to load .env file:', result.error);
    process.exit(1);
}
else {
    console.log('✅ Environment variables loaded successfully');
}
//# sourceMappingURL=preload.js.map