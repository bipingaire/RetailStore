"""
Tenant provisioning service - Creates and manages tenants with separate databases.
"""

from sqlalchemy.orm import Session
from typing import Dict
import uuid
import logging

from ..database_manager import db_manager
from ..models.master_models import Tenant, TenantUser, User
from ..utils.auth import get_password_hash

logger = logging.getLogger(__name__)


class TenantService:
    """Service for creating and managing tenants."""
    
    @staticmethod
    def create_tenant(
        subdomain: str,
        store_name: str,
        admin_email: str,
        admin_password: str,
        master_db: Session
    ) -> Dict:
        """
        Create a new tenant with its own database.
        
        Steps:
        1. Create database for tenant
        2. Initialize schema in tenant database
        3. Create tenant record in master DB
        4. Create admin user if needed
        5. Link admin to tenant
        
        Args:
            subdomain: Tenant subdomain (e.g., "store1")
            store_name: Store display name
            admin_email: Admin user email
            admin_password: Admin user password
            master_db: Master database session
            
        Returns:
            Dict with tenant info and status
        """
        try:
            # 1. Create database
            database_name = db_manager.create_tenant_database(subdomain)
            logger.info(f"Created database: {database_name}")
            
            # 2. Initialize schema
            db_manager.init_tenant_schema(database_name)
            logger.info(f"Initialized schema for: {database_name}")
            
            # 3. Create tenant record in master DB
            tenant = Tenant(
                subdomain=subdomain,
                store_name=store_name,
                database_name=database_name,
                database_created=True,
                is_active=True
            )
            master_db.add(tenant)
            master_db.flush()
            logger.info(f"Created tenant record: {tenant.tenant_id}")
            
            # 4. Create or find admin user
            admin_user = master_db.query(User).filter(User.email == admin_email).first()
            if not admin_user:
                admin_user = User(
                    email=admin_email,
                    encrypted_password=get_password_hash(admin_password),
                    is_active=True
                )
                master_db.add(admin_user)
                master_db.flush()
                logger.info(f"Created admin user: {admin_user.id}")
            
            # 5. Link admin to tenant
            tenant_user = TenantUser(
                tenant_id=tenant.tenant_id,
                user_id=admin_user.id,
                role_name="admin",
                is_active=True
            )
            master_db.add(tenant_user)
            
            master_db.commit()
            
            return {
                "success": True,
                "tenant_id": str(tenant.tenant_id),
                "subdomain": subdomain,
                "database_name": database_name,
                "database_created": True,
                "admin_email": admin_email,
                "admin_created": True,
                "message": f"Tenant '{store_name}' created successfully"
            }
            
        except Exception as e:
            master_db.rollback()
            logger.error(f"Error creating tenant: {str(e)}")
            raise
    
    @staticmethod
    def get_tenant_database_name(subdomain: str, master_db: Session) -> str:
        """
        Get database name for a tenant by subdomain.
        
        Args:
            subdomain: Tenant subdomain
            master_db: Master database session
            
        Returns:
            Database name
        """
        tenant = master_db.query(Tenant).filter(
            Tenant.subdomain == subdomain
        ).first()
        
        if not tenant:
            raise ValueError(f"Tenant not found: {subdomain}")
        
        if not tenant.database_created:
            raise ValueError(f"Database not created for tenant: {subdomain}")
        
        return tenant.database_name
    
    @staticmethod
    def get_tenant_by_id(tenant_id: uuid.UUID, master_db: Session) -> Tenant:
        """Get tenant by ID."""
        return master_db.query(Tenant).filter(Tenant.tenant_id == tenant_id).first()
