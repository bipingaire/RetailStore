from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid

from ..dependencies import get_db, TenantFilter
from ..models import Vendor

router = APIRouter()


# Pydantic schemas
class VendorCreate(BaseModel):
    name: str
    ein: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    contact_phone: Optional[str] = None
    fax: Optional[str] = None
    poc_name: Optional[str] = None


class VendorUpdate(BaseModel):
    name: Optional[str] = None
    ein: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    contact_phone: Optional[str] = None
    fax: Optional[str] = None
    poc_name: Optional[str] = None


class VendorResponse(BaseModel):
    id: uuid.UUID
    name: str
    ein: Optional[str]
    address: Optional[str]
    website: Optional[str]
    email: Optional[str]
    contact_phone: Optional[str]
    fax: Optional[str]
    poc_name: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[VendorResponse])
async def list_vendors(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """List vendors for the current tenant."""
    print(f"DEBUG: list_vendors using DB URL: {db.bind.url}")
    query = db.query(Vendor)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Vendor.name.ilike(search_filter)) |
            (Vendor.email.ilike(search_filter))
        )
    
    vendors = query.offset(skip).limit(limit).all()
    return vendors


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(
    vendor_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get a specific vendor."""
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()
    
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return vendor


@router.post("/", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def create_vendor(
    vendor_data: VendorCreate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Create a new vendor."""
    new_vendor = Vendor(
        **vendor_data.model_dump()
    )
    
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    
    return new_vendor


@router.put("/{vendor_id}", response_model=VendorResponse)
async def update_vendor(
    vendor_id: uuid.UUID,
    vendor_data: VendorUpdate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Update vendor information."""
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()
    
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    for field, value in vendor_data.model_dump(exclude_unset=True).items():
        setattr(vendor, field, value)
    
    db.commit()
    db.refresh(vendor)
    
    return vendor


@router.delete("/{vendor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vendor(
    vendor_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Delete a vendor."""
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()
    
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    db.delete(vendor)
    db.commit()
    
    return None
