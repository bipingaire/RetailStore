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
