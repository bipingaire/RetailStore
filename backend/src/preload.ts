// This file is loaded BEFORE anything else to ensure environment variables are available
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('❌ Failed to load .env file:', result.error);
    process.exit(1);
} else {
    console.log('✅ Environment variables loaded successfully');
}
