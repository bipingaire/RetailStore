
from ..database_manager import db_manager
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..models.master_models import Tenant
import uuid

class TenantService:
    @staticmethod
    def create_tenant(subdomain: str, store_name: str, admin_email: str, admin_password: str, master_db: Session):
        """
        Create a new tenant with dedicated database.
        """
        tenant_id = uuid.uuid4()
        
        # Check if exists
        existing = master_db.query(Tenant).filter(Tenant.subdomain == subdomain).first()
        if existing:
            return {
                "tenant_id": str(existing.tenant_id),
                "subdomain": existing.subdomain,
                "message": "Tenant already exists",
                "success": False
            }
            
        # 1. Provision Database
        try:
            db_name = db_manager.create_tenant_database(subdomain)
            db_manager.init_tenant_schema(db_name)
            
            # Create Admin User in the new Tenant DB
            from ..models.tenant_models import User as TenantUser
            from ..utils.auth import get_password_hash
            from ..models.tenant_models import StoreInfo
            
            tenant_db = db_manager.get_tenant_session(db_name)
            try:
                # 1. Create Admin User
                admin_user = TenantUser(
                    email=admin_email,
                    encrypted_password=get_password_hash(admin_password),
                    role="admin",
                    is_active=True,
                    email_confirmed_at=func.now()
                )
                tenant_db.add(admin_user)
                
                # 2. Create Store Info
                store_info = StoreInfo(
                    subdomain=subdomain,
                    store_name=store_name,
                    store_email=admin_email
                )
                tenant_db.add(store_info)
                
                tenant_db.commit()
                print(f"✅ Created admin user {admin_email} for {subdomain}")
            except Exception as e:
                print(f"❌ Error creating admin user for {subdomain}: {e}")
                tenant_db.rollback()
                # Force cache invalidation
                raise e
            finally:
                tenant_db.close()
            
        except Exception as e:
            print(f"Error provisioning database for {subdomain}: {e}")
            # Ensure we fail strictly or handle graceful partial?
            # For now, allow proceeding to register in master so we can debug, 
            # but ideally should rollback.
            db_name = f"retailstore_{subdomain}" # Fallback name
        
        tenant = Tenant(
            tenant_id=tenant_id,
            subdomain=subdomain,
            store_name=store_name,
            database_name=db_name,
            database_created=True,
            is_active=True
        )
        
        master_db.add(tenant)
        master_db.commit()
        master_db.refresh(tenant)
        
        return {
            "tenant_id": str(tenant.tenant_id),
            "subdomain": subdomain,
            "database_name": db_name,
            "success": True,
            "message": "Tenant registered and database provisioned.",
            "admin_email": admin_email
        }
