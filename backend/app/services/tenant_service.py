
from sqlalchemy.orm import Session
from ..models.master_models import Tenant
import uuid

class TenantService:
    @staticmethod
    def create_tenant(subdomain: str, store_name: str, admin_email: str, admin_password: str, master_db: Session):
        """
        Create a new tenant.
        
        TODO: Implement actual database provisioning.
        Currently registers the tenant in the master database.
        """
        tenant_id = uuid.uuid4()
        db_name = f"retailstore_{subdomain}"
        
        # Check if exists
        existing = master_db.query(Tenant).filter(Tenant.subdomain == subdomain).first()
        if existing:
            return {
                "tenant_id": str(existing.tenant_id),
                "subdomain": existing.subdomain,
                "message": "Tenant already exists",
                "success": False
            }
        
        tenant = Tenant(
            tenant_id=tenant_id,
            subdomain=subdomain,
            store_name=store_name,
            database_name=db_name,
            database_created=True, # Mocking true for now to allow flow to proceed
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
            "message": "Tenant registered successfully.",
            "admin_email": admin_email
        }
