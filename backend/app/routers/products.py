from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from decimal import Decimal

from ..database import get_db
from ..models import GlobalProduct, User
from ..dependencies import get_current_user, require_superadmin, TenantFilter

router = APIRouter()


# Pydantic schemas
class ProductBase(BaseModel):
    product_name: str
    brand_name: Optional[str] = None
    manufacturer_name: Optional[str] = None
    category_name: Optional[str] = None
    upc_ean_code: Optional[str] = None
    image_url: Optional[str] = None
    description_text: Optional[str] = None
    base_unit_name: str = "piece"
    pack_size: int = 1
    pack_unit_name: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    product_id: uuid.UUID
    enriched_by_superadmin: bool
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all products from the global catalog.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **search**: Search in product name, brand, or UPC
    - **category**: Filter by category
    """
    query = db.query(GlobalProduct)
    
    # Apply filters
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (GlobalProduct.product_name.ilike(search_filter)) |
            (GlobalProduct.brand_name.ilike(search_filter)) |
            (GlobalProduct.upc_ean_code.ilike(search_filter))
        )
    
    if category:
        query = query.filter(GlobalProduct.category_name == category)
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific product by ID."""
    product = db.query(GlobalProduct).filter(GlobalProduct.product_id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    superadmin = Depends(require_superadmin)
):
    """
    Create a new product in the global catalog.
    
    **Requires superadmin access.**
    """
    new_product = GlobalProduct(
        **product_data.model_dump(),
        enriched_by_superadmin=True,
        last_enriched_by=superadmin.user_id
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: uuid.UUID,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    superadmin = Depends(require_superadmin)
):
    """
    Update a product in the global catalog.
    
    **Requires superadmin access.**
    """
    product = db.query(GlobalProduct).filter(GlobalProduct.product_id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update fields
    for field, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    
    product.enriched_by_superadmin = True
    product.last_enriched_by = superadmin.user_id
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    superadmin = Depends(require_superadmin)
):
    """
    Delete a product from the global catalog.
    
    **Requires superadmin access.** 
    """
    product = db.query(GlobalProduct).filter(GlobalProduct.product_id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return None
