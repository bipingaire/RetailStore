const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'anuj123';
    const hash = await bcrypt.hash(password, 10);

    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('Hash length:', hash.length);
    console.log('\nSQL UPDATE command:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@anuj.com';`);
}

generateHash();
