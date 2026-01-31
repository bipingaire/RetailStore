
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database_manager import get_master_db
from ..services.tenant_service import TenantService

router = APIRouter()

class TenantRegister(BaseModel):
    subdomain: str
    store_name: str
    admin_email: EmailStr
    admin_password: str

@router.get("/")
async def list_public_tenants():
    """List tenants (public info only)."""
    # For store locator logic later
    return []

@router.get("/nearest")
async def get_nearest_store(lat: float, lng: float):
    return []

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_tenant(
    data: TenantRegister,
    master_db: Session = Depends(get_master_db)
):
    """
    Public tenant registration.
    """
    return TenantService.create_tenant(
        subdomain=data.subdomain,
        store_name=data.store_name,
        admin_email=data.admin_email,
        admin_password=data.admin_password,
        master_db=master_db
    )
