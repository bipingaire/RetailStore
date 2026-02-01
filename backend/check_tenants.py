
from app.database_manager import db_manager
from app.models.master_models import Tenant

db = db_manager.get_master_session()
tenants = db.query(Tenant).all()
print(f"Total Tenants: {len(tenants)}")
for t in tenants:
    print(f"- {t.store_name} ({t.subdomain}) Active: {t.is_active}")
db.close()
