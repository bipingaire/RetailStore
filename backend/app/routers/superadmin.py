"""
SuperAdmin router - Tenant management and provisioning.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid

from ..database_manager import get_master_db
from ..models.master_models import Tenant, User
from ..dependencies import require_superadmin
from ..services.tenant_service import TenantService

router = APIRouter()


# Pydantic schemas
class TenantCreate(BaseModel):
    subdomain: str
    store_name: str
    store_address: Optional[str] = None
    store_email: Optional[EmailStr] = None
    store_phone: Optional[str] = None
    admin_email: EmailStr
    admin_password: str


class TenantResponse(BaseModel):
    tenant_id: str
    subdomain: str
    store_name: str
    database_name: str
    database_created: bool
    is_active: bool
    created_at: str


class TenantCreateResponse(BaseModel):
    success: bool
    tenant_id: str
    subdomain: str
    database_name: str
    database_created: bool
    admin_email: str
    message: str


# ==================== TENANT MANAGEMENT ====================

@router.post("/tenants", response_model=TenantCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    tenant_data: TenantCreate,
    superadmin = Depends(require_superadmin),
    master_db: Session = Depends(get_master_db)
):
    """
    Create a new tenant with its own database.
    
    **SuperAdmin Only**
    
    This endpoint:
    1. Creates a new PostgreSQL database for the tenant
    2. Initializes the schema in the tenant database
    3. Creates the tenant record in master database
    4. Creates admin user (if doesn't exist)
    5. Links admin to tenant
    
    - **subdomain**: Unique subdomain for tenant (e.g., "store1")
    - **store_name**: Display name for the store
    - **admin_email**: Email for store admin
    - **admin_password**: Password for store admin
    """
    # Check if subdomain already exists
    existing = master_db.query(Tenant).filter(Tenant.subdomain == tenant_data.subdomain).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Subdomain '{tenant_data.subdomain}' already exists"
        )
    
    # Create tenant with database
    result = TenantService.create_tenant(
        subdomain=tenant_data.subdomain,
        store_name=tenant_data.store_name,
        admin_email=tenant_data.admin_email,
        admin_password=tenant_data.admin_password,
        master_db=master_db
    )
    
    # Update additional tenant fields if provided
    if tenant_data.store_address or tenant_data.store_email or tenant_data.store_phone:
        tenant = master_db.query(Tenant).filter(
            Tenant.tenant_id == uuid.UUID(result["tenant_id"])
        ).first()
        
        if tenant_data.store_address:
            tenant.store_address = tenant_data.store_address
        if tenant_data.store_email:
            tenant.store_email = tenant_data.store_email
        if tenant_data.store_phone:
            tenant.store_phone = tenant_data.store_phone
        
        master_db.commit()
    
    return result


@router.get("/tenants", response_model=List[TenantResponse])
async def list_tenants(
    skip: int = 0,
    limit: int = 100,
    superadmin = Depends(require_superadmin),
    master_db: Session = Depends(get_master_db)
):
    """
    List all tenants.
    
    **SuperAdmin Only**
    """
    tenants = master_db.query(Tenant).offset(skip).limit(limit).all()
    
    return [
        {
            "tenant_id": str(t.tenant_id),
            "subdomain": t.subdomain,
            "store_name": t.store_name,
            "database_name": t.database_name,
            "database_created": t.database_created,
            "is_active": t.is_active,
            "created_at": t.created_at.isoformat() if t.created_at else None
        }
        for t in tenants
    ]


@router.get("/tenants/{tenant_id}", response_model=TenantResponse)
async def get_tenant(
    tenant_id: uuid.UUID,
    superadmin = Depends(require_superadmin),
    master_db: Session = Depends(get_master_db)
):
    """
    Get tenant details.
    
    **SuperAdmin Only**
    """
    tenant = master_db.query(Tenant).filter(Tenant.tenant_id == tenant_id).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return {
        "tenant_id": str(tenant.tenant_id),
        "subdomain": tenant.subdomain,
        "store_name": tenant.store_name,
        "database_name": tenant.database_name,
        "database_created": tenant.database_created,
        "is_active": tenant.is_active,
        "created_at": tenant.created_at.isoformat() if tenant.created_at else None
    }


@router.delete("/tenants/{tenant_id}")
async def deactivate_tenant(
    tenant_id: uuid.UUID,
    superadmin = Depends(require_superadmin),
    master_db: Session = Depends(get_master_db)
):
    """
    Deactivate a tenant.
    
    **SuperAdmin Only**
    
    Note: This does not delete the database, just marks tenant as inactive.
    """
    tenant = master_db.query(Tenant).filter(Tenant.tenant_id == tenant_id).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    tenant.is_active = False
    master_db.commit()
    
    return {
        "success": True,
        "message": f"Tenant '{tenant.subdomain}' deactivated"
    }


@router.get("/stats")
async def get_system_stats(
    superadmin = Depends(require_superadmin),
    master_db: Session = Depends(get_master_db)
):
    """
    Get system-wide statistics.
    
    **SuperAdmin Only**
    """
    total_tenants = master_db.query(Tenant).count()
    active_tenants = master_db.query(Tenant).filter(Tenant.is_active == True).count()
    total_users = master_db.query(User).count()
    
    from ..models.master_models import GlobalProduct
    total_products = master_db.query(GlobalProduct).count()
    
    return {
        "total_tenants": total_tenants,
        "active_tenants": active_tenants,
        "inactive_tenants": total_tenants - active_tenants,
        "total_users": total_users,
        "global_products": total_products
    }
