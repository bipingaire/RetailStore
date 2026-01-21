"""
Products router - Updated with missing endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid

from ..dependencies import get_master_db, require_admin_or_superadmin
from ..models.master_models import GlobalProduct

router = APIRouter()


# Pydantic schemas
class ProductResponse(BaseModel):
    product_id: uuid.UUID
    product_name: str
    brand_name: Optional[str] = None
    category_name: Optional[str] = None
    upc_ean_code: Optional[str] = None
    image_url: Optional[str] = None
    status: str = "active"
    
    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    product_name: str
    brand_name: Optional[str] = None
    manufacturer_name: Optional[str] = None
    category_name: Optional[str] = None
    subcategory_name: Optional[str] = None
    upc_ean_code: Optional[str] = None
    image_url: Optional[str] = None
    description_text: Optional[str] = None
    status: Optional[str] = "active"


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query("active"),
    limit: int = Query(100, le=1000),
    master_db: Session = Depends(get_master_db)
):
    """
    List products from global catalog.
    
    **Status Filter:**
    - `active` (default) - Only verified products
    - `pending` - Products awaiting approval
    - `rejected` - Rejected products
    - `all` - All products
    """
    query = master_db.query(GlobalProduct)
    
    if search:
        query = query.filter(
            GlobalProduct.product_name.ilike(f"%{search}%") |
            GlobalProduct.brand_name.ilike(f"%{search}%") |
            GlobalProduct.upc_ean_code.ilike(f"%{search}%")
        )
    
    if category:
        query = query.filter(GlobalProduct.category_name == category)
        
    if status and status != "all":
        query = query.filter(GlobalProduct.status == status)
    
    products = query.limit(limit).all()
    return products


@router.get("/upc/{upc}", response_model=ProductResponse)
async def get_product_by_upc(
    upc: str,
    master_db: Session = Depends(get_master_db)
):
    """Get product by UPC code."""
    product = master_db.query(GlobalProduct).filter(
        GlobalProduct.upc_ean_code == upc
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with UPC '{upc}' not found"
        )
    
    return product


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: uuid.UUID,
    master_db: Session = Depends(get_master_db)
):
    """Get product details by ID."""
    product = master_db.query(GlobalProduct).filter(
        GlobalProduct.product_id == product_id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    master_db: Session = Depends(get_master_db),
    _=Depends(require_admin_or_superadmin)
):
    """Create new product in global catalog (Admin/SuperAdmin only)."""
    
    # Check if UPC already exists
    if product_data.upc_ean_code:
        existing = master_db.query(GlobalProduct).filter(
            GlobalProduct.upc_ean_code == product_data.upc_ean_code
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this UPC already exists"
            )
    
    product = GlobalProduct(**product_data.model_dump())
    master_db.add(product)
    master_db.commit()
    master_db.refresh(product)
    
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: uuid.UUID,
    product_data: ProductCreate,
    master_db: Session = Depends(get_master_db),
    _=Depends(require_admin_or_superadmin)
):
    """Update product in global catalog (Admin/SuperAdmin only)."""
    product = master_db.query(GlobalProduct).filter(
        GlobalProduct.product_id == product_id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    for field, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    
    master_db.commit()
    master_db.refresh(product)
    
    return product
