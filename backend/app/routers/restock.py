"""
Restock router - Automated reordering and vendor communication
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from decimal import Decimal
from datetime import datetime

from ..dependencies import get_db
from ..models import InventoryItem, Vendor, GlobalProduct
from ..dependencies import TenantFilter

router = APIRouter()


# Pydantic schemas
class PurchaseOrderItem(BaseModel):
    product_id: uuid.UUID
    quantity: float
    unit_cost: Optional[float] = None


class PurchaseOrderCreate(BaseModel):
    vendor_id: uuid.UUID
    items: List[PurchaseOrderItem]
    notes: Optional[str] = None


class RestockRecommendation(BaseModel):
    product_id: uuid.UUID
    product_name: str
    current_quantity: float
    reorder_level: float
    recommended_order_quantity: float
    estimated_cost: float


@router.get("/recommendations", response_model=List[RestockRecommendation])
async def get_restock_recommendations(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get AI-powered restock recommendations.
    
    **Restock Automation** - Identifies items that need reordering.
    
    Returns list of products below reorder level with:
    - Current quantity
    - Reorder level
    - Recommended order quantity
    - Estimated cost
    """
    # Get inventory items below reorder level
    low_stock_items = db.query(InventoryItem).join(GlobalProduct).filter(
        InventoryItem.quantity_on_hand < InventoryItem.reorder_level
    ).all()
    
    recommendations = []
    
    for item in low_stock_items:
        if not item.global_product:
            continue
        
        reorder_level = float(item.reorder_level or 10)
        current_qty = float(item.quantity_on_hand)
        
        # Recommend ordering to 2x reorder level
        recommended_qty = (reorder_level * 2) - current_qty
        estimated_cost = recommended_qty * float(item.unit_cost or 0)
        
        recommendations.append(RestockRecommendation(
            product_id=item.global_product_id,
            product_name=item.global_product.product_name,
            current_quantity=current_qty,
            reorder_level=reorder_level,
            recommended_order_quantity=recommended_qty,
            estimated_cost=estimated_cost
        ))
    
    return recommendations


@router.post("/generate-po")
async def generate_purchase_order(
    po_data: PurchaseOrderCreate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Generate purchase order for vendor.
    
    **Vendor Communication** - Creates PO for restocking.
    
    - **vendor_id**: Vendor to order from
    - **items**: Products and quantities to order
    - **notes**: Additional notes
    
    Returns PO details ready to send to vendor.
    """
    # Get vendor info
    vendor = db.query(Vendor).filter(
        Vendor.id == po_data.vendor_id
    ).first()
    
    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )
    
    # Calculate PO totals
    po_lines = []
    total_amount = Decimal(0)
    
    for item_data in po_data.items:
        inventory = db.query(InventoryItem).join(GlobalProduct).filter(
            InventoryItem.global_product_id == item_data.product_id
        ).first()
        
        if not inventory or not inventory.global_product:
            continue
        
        unit_cost = Decimal(str(item_data.unit_cost)) if item_data.unit_cost else (inventory.unit_cost or Decimal(0))
        line_total = Decimal(str(item_data.quantity)) * unit_cost
        total_amount += line_total
        
        po_lines.append({
            "product_id": str(item_data.product_id),
            "product_name": inventory.global_product.product_name,
            "quantity": item_data.quantity,
            "unit_cost": float(unit_cost),
            "line_total": float(line_total)
        })
    
    po_number = f"PO-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
    
    return {
        "po_number": po_number,
        "vendor": {
            "id": str(vendor.id),
            "name": vendor.name,
            "email": vendor.email,
            "phone": vendor.contact_phone
        },
        "items": po_lines,
        "total_amount": float(total_amount),
        "notes": po_data.notes,
        "created_at": datetime.utcnow().isoformat(),
        "status": "draft",
        "message": "Purchase order generated. Send to vendor via email."
    }


@router.post("/auto-restock")
async def auto_restock(
    vendor_id: Optional[uuid.UUID] = None,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Automatically generate PO for all low-stock items.
    
    **Automated Restocking** - One-click reordering.
    
    - **vendor_id**: Optional specific vendor, otherwise uses default
    
    Creates purchase order for all items below reorder level.
    """
    # Get low stock items
    recommendations = await get_restock_recommendations(
        tenant_filter=tenant_filter,
        db=db
    )
    
    if not recommendations:
        return {
            "message": "No items need restocking",
            "items_count": 0
        }
    
    # Get vendor
    if vendor_id:
        vendor = db.query(Vendor).filter(
            Vendor.id == vendor_id
        ).first()
    else:
        # Get first available vendor
        vendor = db.query(Vendor).first()
    
    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="No vendor found. Please add a vendor first."
        )
    
    # Create PO items
    po_items = [
        PurchaseOrderItem(
            product_id=rec.product_id,
            quantity=rec.recommended_order_quantity,
            unit_cost=rec.estimated_cost / rec.recommended_order_quantity if rec.recommended_order_quantity > 0 else 0
        )
        for rec in recommendations
    ]
    
    po_data = PurchaseOrderCreate(
        vendor_id=vendor.id,
        items=po_items,
        notes="Auto-generated restock order"
    )
    
    result = await generate_purchase_order(
        po_data=po_data,
        tenant_filter=tenant_filter,
        db=db
    )
    
    return {
        **result,
        "auto_generated": True,
        "items_count": len(recommendations)
    }


@router.get("/stock-levels")
async def get_stock_levels_report(
    critical_only: bool = Query(False, description="Show only critical stock levels"),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get current stock levels report.
    
    - **critical_only**: If true, only show items below reorder level
    """
    query = db.query(InventoryItem).join(GlobalProduct)
    
    if critical_only:
        query = query.filter(InventoryItem.quantity_on_hand < InventoryItem.reorder_level)
    
    items = query.all()
    
    return {
        "total_items": len(items),
        "stock_levels": [
            {
                "product_id": str(item.global_product_id),
                "product_name": item.global_product.product_name if item.global_product else "Unknown",
                "current_quantity": float(item.quantity_on_hand),
                "reorder_level": float(item.reorder_level or 0),
                "status": "critical" if item.quantity_on_hand < (item.reorder_level or 0) else "ok"
            }
            for item in items
        ]
    }
