const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/super-admin/login', {
            email: 'superadmin@retailstore.com',
            password: 'password123'
        });
        console.log('Login successful!', response.data);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
