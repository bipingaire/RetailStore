from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import uuid

from ..dependencies import get_master_db
# In a real app, importing Tenant model from models
# from ..models import Tenant

router = APIRouter(
    prefix="/api/tenants",
    tags=["tenants"]
)

class TenantRegister(BaseModel):
    storeName: str
    subdomain: str
    fullName: str
    email: EmailStr
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_tenant(
    data: TenantRegister,
    db: Session = Depends(get_master_db)
):
    """
    Register a new tenant (Store).
    
    In a full production environment, this would:
    1. Create a record in the 'tenants' table in the Master DB.
    2. Provision a new isolated database (or schema) for the tenant.
    3. Run migrations on the new database.
    4. Create the initial Admin user in the new database.
    
    For this migration/demo, we will:
    1. Validate the input.
    2. Return a success message simulating creation.
    """
    
    # 1. Check if subdomain is taken (Mock check)
    # existing = db.execute("SELECT 1 FROM tenants WHERE subdomain = :s", {"s": data.subdomain}).scalar()
    # if existing:
    #     raise HTTPException(400, "Subdomain already taken")
    
    if data.subdomain in ["admin", "www", "api"]:
        raise HTTPException(
            status_code=400,
            detail="Reserved subdomain"
        )
        
    # 2. Simulate Logic
    print(f"Creating tenant: {data.storeName} ({data.subdomain})")
    print(f"Admin: {data.fullName} <{data.email}>")
    
    # Return mock success
    return {
        "message": "Store created successfully",
        "tenant_id": str(uuid.uuid4()),
        "subdomain": data.subdomain,
        "login_url": f"/admin/login"
    }
