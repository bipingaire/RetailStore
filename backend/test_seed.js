
require('dotenv').config();

try {
    console.log('Requiring bcryptjs...');
    const bcrypt = require('bcryptjs');
    console.log('bcryptjs loaded');

    console.log('Requiring @prisma/client...');
    const { PrismaClient } = require('@prisma/client');
    console.log('@prisma/client loaded');

    console.log('Instantiating PrismaClient...');
    const prisma = new PrismaClient();
    console.log('PrismaClient instantiated');

    // Try connecting
    prisma.$connect().then(() => {
        console.log('Connected to DB');
        process.exit(0);
    }).catch(e => {
        console.error('Connection failed:', e);
        process.exit(1);
    });

} catch (e) {
    console.error('Error:', e);
}
