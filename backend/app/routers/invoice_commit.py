"""
Invoice commit endpoint - Save reviewed invoice data and update inventory
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import uuid

from ..dependencies import get_db, TenantFilter
from ..models import InventoryItem
from sqlalchemy import Column, String, Integer, Numeric, DateTime, Date, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.ext.declarative import declarative_base

router = APIRouter()

# Pydantic models
class CommitInvoiceItem(BaseModel):
    product_name: str
    quantity: float
    unit_cost: float
    line_total: float
    expiry_date: Optional[str] = None

class CommitInvoiceRequest(BaseModel):
    supplier_name: str
    invoice_number: str
    invoice_date: str
    total_amount: float
    items: List[CommitInvoiceItem]

@router.post("/commit")
async def commit_invoice(
    data: CommitInvoiceRequest,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Commit reviewed invoice data to database and update inventory.
    This is called after user reviews AI-extracted data.
    """
    
    # For now, we'll just update inventory directly
    # Later we can add committed-invoices table for history
    
    items_updated = 0
    items_created = 0
    
    for item_data in data.items:
        # Try to find existing inventory item by name (fuzzy match would be better)
        existing = db.query(InventoryItem).filter(
            InventoryItem.product_name_from_global.ilike(f"%{item_data.product_name}%")
        ).first()
        
        if existing:
            # Update existing item
            existing.quantity_on_hand += item_data.quantity
            existing.unit_cost = item_data.unit_cost
            existing.selling_price = item_data.unit_cost * 1.3  # 30% markup
            items_updated += 1
        else:
            # Create new inventory item
            # Note: This is simplified - in production you'd want to link to global catalog
            new_item = InventoryItem(
                inventory_id=uuid.uuid4(),
                global_product_id=None,  # Would need to create/link global product
                quantity_on_hand=item_data.quantity,
                unit_cost=item_data.unit_cost,
                selling_price=item_data.unit_cost * 1.3,
                reorder_level=10,
                override_description=f"{item_data.product_name} (from invoice {data.invoice_number})"
            )
            db.add(new_item)
            items_created += 1
    
    db.commit()
    
    return {
        "success": True,
        "invoice_number": data.invoice_number,
        "items_committed": items_updated + items_created,
        "items_updated": items_updated,
        "items_created": items_created,
        "inventory_updated": True
    }

@router.get("/history")
async def get_invoice_history(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get committed invoice history.
    For now, returns empty since we're not storing invoice records yet.
    """
    return {
        "invoices": [],
        "count": 0
    }
