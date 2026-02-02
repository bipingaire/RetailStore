
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database_manager import get_master_db
from ..services.tenant_service import TenantService
from ..models.master_models import Tenant
from fastapi import APIRouter, Depends, HTTPException, status, Query

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
async def get_nearest_store(
    lat: float, 
    lng: float,
    master_db: Session = Depends(get_master_db)
):
    result = TenantService.find_nearest_tenant(lat, lng, master_db)
    if not result:
        # Return demo1 if nothing found (fallback)
        return {
            "success": True,
            "nearest": {
                "subdomain": "demo1", 
                "store_name": "Demo Store", 
                "city": "Demo City", 
                "state": "DS", 
                "distanceMiles": 0, 
                "address": "123 Demo St"
            }
        }
    
    # Enrichment for frontend
    result["city"] = "Unknown City" # Placeholder as we don't have city/state in DB yet
    result["state"] = "US"
    result["distanceMiles"] = result["distance_approx"] * 69 # Rough deg to miles conversion
    result["address"] = "123 Main St" # Placeholder
    
    return {"success": True, "nearest": result}

@router.get("/lookup")
async def lookup_tenant(
    subdomain: str = Query(..., description="Subdomain to lookup"),
    master_db: Session = Depends(get_master_db)
):
    """
    Lookup tenant ID by subdomain.
    Used by frontend middleware for routing.
    """
    tenant = master_db.query(Tenant).filter(Tenant.subdomain == subdomain).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
            
    return {"tenant_id": str(tenant.tenant_id), "is_active": tenant.is_active}


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
