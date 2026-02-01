"""
Inventory router - Updated for database-per-tenant architecture.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from decimal import Decimal

from ..dependencies import TenantContext, require_admin_or_superadmin, get_master_db
from ..models.tenant_models import InventoryItem
from ..models.master_models import GlobalProduct

router = APIRouter()


# Pydantic schemas
class InventoryResponse(BaseModel):
    inventory_id: uuid.UUID
    global_product_id: uuid.UUID
    quantity_on_hand: Decimal
    unit_cost: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    product_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class InventoryUpdate(BaseModel):
    quantity_on_hand: Decimal
    unit_cost: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None


class InventoryCreate(BaseModel):
    # Product Fields (for Global Catalog)
    product_name: str
    upc_ean_code: Optional[str] = None
    brand_name: Optional[str] = None
    category_name: Optional[str] = None
    description_text: Optional[str] = None
    image_url: Optional[str] = None
    
    # Inventory Fields (for Tenant)
    quantity_on_hand: Decimal = 0
    unit_cost: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    reorder_level: Optional[Decimal] = 10


@router.post("/", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
async def create_inventory(
    item_data: InventoryCreate,
    context: TenantContext = Depends()
):
    """
    Add item to inventory.
    
    **Auto-Sync Logic:**
    1. Checks if product exists in Global Catalog (by UPC or Name).
    2. If YES: Links to existing Global Product.
    3. If NO: Creates new Global Product (Auto-Sync).
    4. Creates Inventory Item in Tenant Database.
    """
    # 1. Check Global Catalog
    global_product = None
    
    # Try finding by UPC first (most accurate)
    if item_data.upc_ean_code:
        global_product = context.master_db.query(GlobalProduct).filter(
            GlobalProduct.upc_ean_code == item_data.upc_ean_code
        ).first()
    
    # Logic: "As soon as tenant admin add new... auto sync to global"
    if not global_product:
        # Create new Global Product
        global_product = GlobalProduct(
            product_name=item_data.product_name,
            upc_ean_code=item_data.upc_ean_code,
            brand_name=item_data.brand_name,
            category_name=item_data.category_name,
            description_text=item_data.description_text,
            image_url=item_data.image_url,
            status="active" # Auto-activate for now, or use "pending" if review needed
        )
        context.master_db.add(global_product)
        context.master_db.commit()
        context.master_db.refresh(global_product)
    
    # 2. Check Local Inventory (Prevent Duplicates)
    existing_inventory = context.tenant_db.query(InventoryItem).filter(
        InventoryItem.global_product_id == global_product.product_id
    ).first()
    
    if existing_inventory:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in inventory. Please update quantity instead."
        )
    
    # 3. Create Inventory Item
    new_item = InventoryItem(
        global_product_id=global_product.product_id,
        quantity_on_hand=item_data.quantity_on_hand,
        unit_cost=item_data.unit_cost,
        selling_price=item_data.selling_price,
        reorder_level=item_data.reorder_level
    )
    
    context.tenant_db.add(new_item)
    context.tenant_db.commit()
    context.tenant_db.refresh(new_item)
    
    # 4. Return response (with product name)
    # We construct response manually to ensure product name is included
    return InventoryResponse(
        inventory_id=new_item.inventory_id,
        global_product_id=new_item.global_product_id,
        quantity_on_hand=new_item.quantity_on_hand,
        unit_cost=new_item.unit_cost,
        selling_price=new_item.selling_price,
        product_name=global_product.product_name
    )


@router.get("/", response_model=List[InventoryResponse])
async def list_inventory(
    context: TenantContext = Depends()
):
    """
    List inventory items for the current tenant.
    
    **Database-per-tenant**: Queries tenant's own database.
    """
    # Query tenant database
    items = context.tenant_db.query(InventoryItem).all()
    
    # Enrich with product names from master DB
    result = []
    for item in items:
        item_dict = {
            "inventory_id": item.inventory_id,
            "global_product_id": item.global_product_id,
            "quantity_on_hand": item.quantity_on_hand,
            "unit_cost": item.unit_cost,
            "selling_price": item.selling_price,
        }
        
        # Get product from master DB
        product = context.master_db.query(GlobalProduct).filter(
            GlobalProduct.product_id == item.global_product_id
        ).first()
        
        if product:
            item_dict["product_name"] = product.product_name
        
        result.append(item_dict)
    
    return result


@router.get("/{inventory_id}", response_model=InventoryResponse)
async def get_inventory_item(
    inventory_id: uuid.UUID,
    context: TenantContext = Depends()
):
    """Get a specific inventory item from tenant database."""
    item = context.tenant_db.query(InventoryItem).filter(
        InventoryItem.inventory_id == inventory_id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    
    return item


@router.put("/{inventory_id}", response_model=InventoryResponse)
async def update_inventory(
    inventory_id: uuid.UUID,
    update_data: InventoryUpdate,
    context: TenantContext = Depends(),
    _=Depends(require_admin_or_superadmin)
):
    """Update inventory item in tenant database."""
    item = context.tenant_db.query(InventoryItem).filter(
        InventoryItem.inventory_id == inventory_id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    
    # Update fields
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    
    context.tenant_db.commit()
    context.tenant_db.refresh(item)
    
    return item
