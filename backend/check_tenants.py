
from app.database_manager import db_manager
from app.models.master_models import Tenant
from app.models.tenant_models import User
from sqlalchemy.exc import OperationalError

db = db_manager.get_master_session()
tenants = db.query(Tenant).all()
print(f"Total Tenants: {len(tenants)}")

for t in tenants:
    print(f"\n--- Tenant: {t.store_name} ({t.subdomain}) ---")
    print(f"    Master Record Active: {t.is_active}")
    print(f"    Target Database: {t.database_name}")
    
    if not t.database_created:
        print("    ⚠️ Database NOT created flag set!")
        continue

    try:
        # Attempt to connect to tenant DB
        tenant_db = db_manager.get_tenant_session(t.database_name)
        user_count = tenant_db.query(User).count()
        print(f"    ✅ Connected to Tenant DB")
        print(f"    Users found: {user_count}")
        
        users = tenant_db.query(User).all()
        for u in users:
            print(f"    - User: {u.email} (Role: {u.role})")
            
        tenant_db.close()
    except Exception as e:
        print(f"    ❌ Failed to connect/query tenant DB: {e}")

db.close()
