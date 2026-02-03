"""
Invoice commit endpoint - Save reviewed invoice data and update inventory
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
import uuid

from ..dependencies import get_db, TenantFilter
from ..models import InventoryItem, Vendor, CommittedInvoice, CommittedInvoiceItem

router = APIRouter()

# Pydantic models
class VendorData(BaseModel):
    name: str
    ein: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    poc_name: Optional[str] = None

class InvoiceMetadata(BaseModel):
    vendor_name: str
    invoice_number: str
    invoice_date: str
    total_tax: float = 0
    total_transport: float = 0
    total_amount: float

class CommitInvoiceItem(BaseModel):
    product_name: str
    vendor_code: Optional[str] = None
    upc: Optional[str] = None
    qty: float
    unit_cost: float
    expiry: Optional[str] = None
    matched_product_id: Optional[str] = None

class CommitInvoiceRequest(BaseModel):
    vendor: VendorData
    metadata: InvoiceMetadata
    items: List[CommitInvoiceItem]

@router.post("/commit")
async def commit_invoice(
    data: CommitInvoiceRequest,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Commit reviewed invoice data to database and update inventory.
    1. Upsert vendor
    2. Create CommittedInvoice record
    3. Create CommittedInvoiceItem records
    4. Update inventory quantities
    """
    
    try:
        # 1. Upsert Vendor
        vendor = db.query(Vendor).filter(Vendor.name == data.vendor.name).first()
        if not vendor:
            vendor = Vendor(
                id=uuid.uuid4(),
                name=data.vendor.name,
                ein=data.vendor.ein,
                address=data.vendor.address,
                website=data.vendor.website,
                email=data.vendor.email,
                contact_phone=data.vendor.phone,
                fax=data.vendor.fax,
                poc_name=data.vendor.poc_name
            )
            db.add(vendor)
            db.flush()  # Get vendor.id
        else:
            # Update existing vendor data
            vendor.ein = data.vendor.ein or vendor.ein
            vendor.address = data.vendor.address or vendor.address
            vendor.website = data.vendor.website or vendor.website
            vendor.email = data.vendor.email or vendor.email
            vendor.contact_phone = data.vendor.phone or vendor.contact_phone
            vendor.fax = data.vendor.fax or vendor.fax
            vendor.poc_name = data.vendor.poc_name or vendor.poc_name

        # 2. Create CommittedInvoice
        invoice = CommittedInvoice(
            invoice_id=uuid.uuid4(),
            vendor_id=vendor.id,
            supplier_name=data.metadata.vendor_name,
            invoice_number=data.metadata.invoice_number,
            invoice_date=datetime.fromisoformat(data.metadata.invoice_date.replace('Z', '+00:00')),
            total_amount=Decimal(str(data.metadata.total_amount)),
            total_tax=Decimal(str(data.metadata.total_tax)),
            total_transport=Decimal(str(data.metadata.total_transport))
        )
        db.add(invoice)
        db.flush()

        # 3. Create line items and update inventory
        items_updated = 0
        items_created = 0

        for item_data in data.items:
            # Save to CommittedInvoiceItem
            invoice_item = CommittedInvoiceItem(
                item_id=uuid.uuid4(),
                invoice_id=invoice.invoice_id,
                product_name=item_data.product_name,
                vendor_code=item_data.vendor_code,
                upc=item_data.upc,
                quantity=Decimal(str(item_data.qty)),
                unit_cost=Decimal(str(item_data.unit_cost)),
                line_total=Decimal(str(item_data.qty * item_data.unit_cost)),
                expiry_date=datetime.fromisoformat(item_data.expiry) if item_data.expiry else None
            )
            db.add(invoice_item)

            # Update inventory
            # Try to find by matched_product_id first, then by name
            existing = None
            if item_data.matched_product_id:
                existing = db.query(InventoryItem).filter(
                    InventoryItem.global_product_id == uuid.UUID(item_data.matched_product_id)
                ).first()
            
            if not existing:
                # Fallback to name search
                existing = db.query(InventoryItem).filter(
                    InventoryItem.product_name_from_global.ilike(f"%{item_data.product_name}%")
                ).first()

            if existing:
                existing.quantity_on_hand += Decimal(str(item_data.qty))
                existing.unit_cost = Decimal(str(item_data.unit_cost))
                items_updated += 1
            else:
                # Create new inventory item
                new_item = InventoryItem(
                    inventory_id=uuid.uuid4(),
                    global_product_id=uuid.UUID(item_data.matched_product_id) if item_data.matched_product_id else None,
                    quantity_on_hand=Decimal(str(item_data.qty)),
                    unit_cost=Decimal(str(item_data.unit_cost)),
                    selling_price=Decimal(str(item_data.unit_cost)) * Decimal('1.3'),
                    reorder_level=10,
                    override_description=f"{item_data.product_name} (from invoice {data.metadata.invoice_number})"
                )
                db.add(new_item)
                items_created += 1

        db.commit()

        return {
            "success": True,
            "invoice_id": str(invoice.invoice_id),
            "vendor_id": str(vendor.id),
            "invoice_number": data.metadata.invoice_number,
            "items_committed": len(data.items),
            "inventory_items_updated": items_updated,
            "inventory_items_created": items_created
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to commit invoice: {str(e)}"
        )

@router.get("/history")
async def get_invoice_history(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """
    Get committed invoice history with line items.
    """
    invoices = db.query(CommittedInvoice)\
        .order_by(CommittedInvoice.created_at.desc())\
        .limit(limit)\
        .all()
    
    result = []
    for inv in invoices:
        result.append({
            "id": str(inv.invoice_id),
            "vendor_name": inv.supplier_name,
            "invoice_number": inv.invoice_number,
            "invoice_date": inv.invoice_date.isoformat() if inv.invoice_date else None,
            "total_amount": float(inv.total_amount) if inv.total_amount else 0,
            "total_tax": float(inv.total_tax) if inv.total_tax else 0,
            "total_transport": float(inv.total_transport) if inv.total_transport else 0,
            "created_at": inv.created_at.isoformat() if inv.created_at else None,
            "line_items_json": [
                {
                    "product_name": item.product_name,
                    "vendor_code": item.vendor_code,
                    "upc": item.upc,
                    "qty": float(item.quantity) if item.quantity else 0,
                    "unit_cost": float(item.unit_cost) if item.unit_cost else 0,
                    "line_total": float(item.line_total) if item.line_total else 0,
                    "expiry": item.expiry_date.isoformat() if item.expiry_date else None
                }
                for item in inv.items
            ]
        })
    
    return {
        "success": True,
        "data": result,
        "count": len(result)
    }
