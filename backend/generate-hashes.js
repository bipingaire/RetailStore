const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generating password hashes...\n');
  
  // Superadmin password: admin123
  const superadminHash = await bcrypt.hash('admin123', 10);
  console.log('Superadmin (email: superadmin@retailstore.com, password: admin123):');
  console.log(superadminHash);
  console.log('');
  
  // Anuj admin password: anuj123
  const anujAdminHash = await bcrypt.hash('anuj123', 10);
  console.log('Anuj Admin (email: admin@anuj.com, password: anuj123):');
  console.log(anujAdminHash);
  console.log('');
}

generateHashes();
