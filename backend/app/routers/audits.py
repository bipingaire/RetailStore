"""
Shelf audit router - Inventory reconciliation and theft/loss tracking
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from decimal import Decimal

from ..database import get_db
from ..models.additional import ShelfAuditRecord, ShelfAuditItem
from ..models import InventoryItem
from ..dependencies import TenantFilter, get_current_user
from ..services.inventory_service import InventoryService

router = APIRouter()


# Pydantic schemas
class AuditItemCreate(BaseModel):
    product_id: uuid.UUID
    actual_quantity: float


class AuditCreate(BaseModel):
    notes: Optional[str] = None
    items: List[AuditItemCreate]


class AuditResponse(BaseModel):
    audit_id: uuid.UUID
    total_items: int
    items_adjusted: int
    total_discrepancy: float
    auto_adjusted: bool


@router.post("/start", response_model=Dict)
async def start_shelf_audit(
    tenant_filter: TenantFilter = Depends(),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start a new shelf audit session.
    
    **Shelf Check (Reconciliation)** - Begin inventory count.
    
    Returns audit_id to track the audit session.
    """
    audit = ShelfAuditRecord(
        tenant_id=tenant_filter.tenant_id,
        audited_by=current_user.id
    )
    
    db.add(audit)
    db.commit()
    db.refresh(audit)
    
    # Get current inventory for reference
    inventory_items = db.query(InventoryItem).filter(
        InventoryItem.tenant_id == tenant_filter.tenant_id
    ).all()
    
    return {
        "audit_id": str(audit.audit_id),
        "started_at": audit.audit_date.isoformat(),
        "expected_items_count": len(inventory_items),
        "message": "Audit started. Record actual quantities for each item."
    }


@router.post("/complete", response_model=AuditResponse)
async def complete_shelf_audit(
    audit_data: AuditCreate,
    audit_id: uuid.UUID,
    auto_adjust: bool = True,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Complete shelf audit and process discrepancies.
    
    **Inventory Reconciliation** - Compare actual vs expected quantities.
    
    - **audit_id**: Audit session ID from /start
    - **items**: List of products with actual counts
    - **auto_adjust**: Automatically update inventory (default: True)
    
    Identifies:
    - Theft/losses (actual < expected)
    - Counting errors
    - Unrecorded additions
    """
    audit = db.query(ShelfAuditRecord).filter(
        ShelfAuditRecord.audit_id == audit_id,
        ShelfAuditRecord.tenant_id == tenant_filter.tenant_id
    ).first()
    
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit not found"
        )
    
    # Update notes
    if audit_data.notes:
        audit.notes = audit_data.notes
    
    # Add audit items
    for item_data in audit_data.items:
        # Get expected quantity from current inventory
        inventory = db.query(InventoryItem).filter(
            InventoryItem.tenant_id == tenant_filter.tenant_id,
            InventoryItem.global_product_id == item_data.product_id
        ).first()
        
        expected_qty = float(inventory.quantity_on_hand) if inventory else 0
        
        audit_item = ShelfAuditItem(
            audit_id=audit_id,
            global_product_id=item_data.product_id,
            expected_quantity=Decimal(str(expected_qty)),
            actual_quantity=Decimal(str(item_data.actual_quantity)),
            discrepancy=Decimal(str(item_data.actual_quantity - expected_qty))
        )
        
        db.add(audit_item)
    
    db.commit()
    
    # Process audit and adjust inventory
    result = InventoryService.process_shelf_audit(
        db=db,
        tenant_id=tenant_filter.tenant_id,
        audit_id=audit_id,
        auto_adjust=auto_adjust
    )
    
    return result


@router.get("/history")
async def get_audit_history(
    skip: int = 0,
    limit: int = 50,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get shelf audit history."""
    
    audits = db.query(ShelfAuditRecord).filter(
        ShelfAuditRecord.tenant_id == tenant_filter.tenant_id
    ).order_by(
        ShelfAuditRecord.audit_date.desc()
    ).offset(skip).limit(limit).all()
    
    return {
        "audits": [
            {
                "audit_id": str(audit.audit_id),
                "audit_date": audit.audit_date.isoformat() if audit.audit_date else None,
                "items_count": len(audit.items) if audit.items else 0,
                "notes": audit.notes
            }
            for audit in audits
        ],
        "count": len(audits)
    }


@router.get("/{audit_id}/details")
async def get_audit_details(
    audit_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get detailed audit report including all discrepancies."""
    
    audit = db.query(ShelfAuditRecord).filter(
        ShelfAuditRecord.audit_id == audit_id,
        ShelfAuditRecord.tenant_id == tenant_filter.tenant_id
    ).first()
    
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit not found"
        )
    
    items_detail = []
    total_loss = Decimal(0)
    total_gain = Decimal(0)
    
    for item in audit.items or []:
        discrepancy = item.discrepancy or 0
        
        if discrepancy < 0:
            total_loss += abs(discrepancy)
        elif discrepancy > 0:
            total_gain += discrepancy
        
        items_detail.append({
            "product_id": str(item.global_product_id),
            "expected": float(item.expected_quantity or 0),
            "actual": float(item.actual_quantity or 0),
            "discrepancy": float(discrepancy),
            "status": "loss" if discrepancy < 0 else ("gain" if discrepancy > 0 else "match")
        })
    
    return {
        "audit_id": str(audit.audit_id),
        "audit_date": audit.audit_date.isoformat() if audit.audit_date else None,
        "total_items": len(items_detail),
        "total_loss": float(total_loss),
        "total_gain": float(total_gain),
        "notes": audit.notes,
        "status": audit.status,
        "items": items_detail
    }


@router.post("/{audit_id}/apply")
async def apply_audit_adjustment(
    audit_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Apply inventory adjustments from a pending audit.
    """
    return InventoryService.process_shelf_audit(
        db=db,
        tenant_id=tenant_filter.tenant_id,
        audit_id=audit_id,
        auto_adjust=True
    )


@router.post("/{audit_id}/reject")
async def reject_audit(
    audit_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Reject an audit (no inventory changes).
    """
    audit = db.query(ShelfAuditRecord).filter(
        ShelfAuditRecord.audit_id == audit_id,
        ShelfAuditRecord.tenant_id == tenant_filter.tenant_id
    ).first()

    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit not found"
        )

    audit.status = "rejected"
    db.commit()
    
    return {"message": "Audit rejected", "status": "rejected"}
