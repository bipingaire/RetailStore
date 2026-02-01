
import sys
import logging
import uuid
from sqlalchemy import text
from app.database_manager import db_manager
from app.models.master_models import Tenant
from app.models.tenant_models import User, StoreInfo, TenantBase
from app.utils.auth import get_password_hash

from app.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def debug_connection_info():
    url = settings.master_database_url
    if "@" in url:
        # Mask password
        auth, rest = url.split("@")
        if ":" in auth:
            user, password = auth.split(":")[-2:]
            # Handle if schema is present e.g. postgresql://
            prefix = auth.split("://")[0] + "://"
            masked_password = password[:3] + "***" if password else "EMPTY"
            print(f"DEBUG: Connecting to {prefix}{user}:{masked_password}@{rest}")
        else:
            print(f"DEBUG: No password in URL: {url.split('@')[0]}@...")
    else:
        print(f"DEBUG: Invalid/Local URL structure: {url}")

def fix_tenants():
    print("🚀 Starting Tenant Repair Tool...")
    debug_connection_info()
    db = db_manager.get_master_session()
    tenants = db.query(Tenant).all()
    print(f"Checking {len(tenants)} tenants in Master Registry...")

    for t in tenants:
        print(f"\n------------------------------------------------")
        print(f"Checking {t.store_name} ({t.subdomain})")
        print(f"Target DB: {t.database_name}")
        
        db_exists = False
        
        # 1. Check if DB exists physically
        try:
            # Try to connect (this will fail if DB doesn't exist)
            tenant_db = db_manager.get_tenant_session(t.database_name)
            tenant_db.execute(text("SELECT 1"))
            tenant_db.close()
            print(f"  ✅ Database connection successful.")
            db_exists = True
        except Exception:
            print(f"  ❌ Database connection FAILED. It likely does not exist.")
            
        if not db_exists:
            print(f"  🛠️  Reprovisioning database for {t.subdomain}...")
            reprovision_database(t, db)
            
        # 2. Check if Admin user exists (and Schema is valid)
        try:
            tenant_db = db_manager.get_tenant_session(t.database_name)
            
            # Ensure schema exists (create_all is duplicate-safe)
            logger.info("  Verifying schema...")
            db_manager.init_tenant_schema(t.database_name)
            
            admin = tenant_db.query(User).filter(User.role == "admin").first()
            if not admin:
                print(f"  ❌ No Admin user found! Creating default admin...")
                create_default_admin(t, tenant_db)
            else:
                 print(f"  ✅ Admin user exists: {admin.email}")
            
            tenant_db.close()
        except Exception as e:
            print(f"  🔥 Error checking/creating admin: {e}")

    db.close()
    print("\n✅ Repair complete.")

def reprovision_database(tenant, master_db):
    try:
        # Create DB
        db_manager.create_tenant_database(tenant.subdomain)
        # Init Schema
        db_manager.init_tenant_schema(tenant.database_name)
        
        # Update master record flag
        tenant.database_created = True
        master_db.commit()
        print("  ✅ Database and Schema created.")
    except Exception as e:
        print(f"  🔥 Failed to create database: {e}")

def create_default_admin(tenant, tenant_db):
    # Determine email - try to match known seeds or use default
    admin_email = tenant.store_email
    
    # Overrides for known seeds to ensure login works as user expects
    if tenant.subdomain == "highpoint":
        admin_email = "admin@highpoint.indumart.us"
    elif tenant.subdomain == "greensboro":
        admin_email = "admin@greensboro.indumart.us"
    
    if not admin_email:
        admin_email = f"admin@{tenant.subdomain}.retailos.cloud"
        
    print(f"  Creating admin {admin_email}...")
    
    new_admin = User(
        email=admin_email,
        encrypted_password=get_password_hash("Password123!"),
        full_name=f"{tenant.store_name} Admin",
        role="admin",
        is_active=True
    )
    tenant_db.add(new_admin)
    
    # Ensure StoreInfo exists
    store = tenant_db.query(StoreInfo).first()
    if not store:
        new_store = StoreInfo(
            name=tenant.store_name,
            subdomain=tenant.subdomain,
            address=tenant.store_address,
            phone=tenant.store_phone,
            email=tenant.store_email
        )
        tenant_db.add(new_store)
        
    tenant_db.commit()
    print("  ✅ Admin user and Store info created.")

if __name__ == "__main__":
    fix_tenants()
