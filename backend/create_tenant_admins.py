from app.database_manager import db_manager
from app.models.tenant_models import User as TenantUser
from app.utils.auth import get_password_hash
import sys

# Tenants to setup
TENANTS = [
    {
        "subdomain": "greensboro",
        "database_name": "tenant_greensboro",
        "email": "admin@greensboro.indumart.us",
        "password": "Admin@123", # Change this!
        "name": "Greensboro Admin"
    },
    {
        "subdomain": "highpoint",
        "database_name": "tenant_highpoint",
        "email": "admin@highpoint.indumart.us",
        "password": "Admin@123", # Change this!
        "name": "High Point Admin"
    }
]

print("Starting Tenant Admin creation script...")

for tenant in TENANTS:
    print(f"\nProcessing {tenant['name']}...")
    
    try:
        # 1. Ensure Tenant Database Exists
        # Note: create_tenant_database expects subdomain and calculates db_name, 
        # but we can check if db exists by just trying to init schema which gets engine
        print(f"   Checking database: {tenant['database_name']}")
        
        # This will create the DB if it doesn't exist (via helper inside manager if used correctly, 
        # but here we rely on the fact that if we just inserted into registry, the DB might be missing)
        # db_manager.create_tenant_database expects subdomain to generate name: tenant_{subdomain}
        db_manager.create_tenant_database(tenant['subdomain'])
        
        # 2. Initialize Schema (Tables)
        print("   Initializing schema...")
        db_manager.init_tenant_schema(tenant['database_name'])
        
        # 3. Create Admin User
        print("   Creating admin user...")
        session = db_manager.get_tenant_session(tenant['database_name'])
        
        existing = session.query(TenantUser).filter(TenantUser.email == tenant['email']).first()
        
        if existing:
            print(f"   ⚠️ User already exists: {tenant['email']}")
        else:
            admin_user = TenantUser(
                email=tenant['email'],
                encrypted_password=get_password_hash(tenant['password']),
                role="admin",
                is_active=True
            )
            session.add(admin_user)
            session.commit()
            print(f"   ✅ Created user: {tenant['email']}")
            print(f"      Password: {tenant['password']}")
            
        session.close()
        
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\nDone!")
