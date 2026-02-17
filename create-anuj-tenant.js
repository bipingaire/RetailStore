const axios = require('axios');

async function createTenant() {
    try {
        const response = await axios.post('http://localhost:3001/api/tenants', {
            name: 'Anuj Store',
            subdomain: 'anuj',
            adminEmail: 'admin@anuj.com',
            adminPassword: 'anuj123'
        });

        console.log('✅ Tenant created successfully!');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

createTenant();
