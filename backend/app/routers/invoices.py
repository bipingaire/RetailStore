"""
Invoice processing router - Handle invoice uploads and inventory updates
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from datetime import datetime

from ..database import get_db
from ..models import UploadedInvoice
from ..dependencies import TenantFilter
from ..services.inventory_service import InventoryService

router = APIRouter()


# Pydantic schemas
class InvoiceItem(BaseModel):
    product_name: str
    quantity: float
    unit_cost: float
    upc_code: Optional[str] = None


class InvoiceData(BaseModel):
    supplier_name: str
    invoice_number: str
    invoice_date: str
    total_amount: float
    items: List[InvoiceItem]


class InvoiceProcessResponse(BaseModel):
    invoice_id: uuid.UUID
    items_created: int
    items_updated: int
    total_items: int
    supplier: str


@router.post("/upload", response_model=Dict)
async def upload_invoice(
    file: UploadFile = File(...),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Upload an invoice for OCR processing.
    
    - **file**: Invoice PDF or image
    
    Returns the invoice ID for later processing.
    """
    # Save invoice record
    import os
    
    upload_path = f"uploads/invoices"
    os.makedirs(upload_path, exist_ok=True)
    
    file_location = f"{upload_path}/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
        
    invoice = UploadedInvoice(
        file_url_path=f"/uploads/invoices/{file.filename}",
        processing_status="pending"
    )
    
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    return {
        "invoice_id": str(invoice.invoice_id),
        "status": "uploaded",
        "message": "Invoice uploaded successfully. Process with /process endpoint."
    }


@router.post("/process", response_model=InvoiceProcessResponse)
async def process_invoice(
    invoice_data: InvoiceData,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Process invoice data and update inventory.
    
    This endpoint accepts parsed invoice data (from OCR or manual entry)
    and automatically updates inventory quantities and costs.
    
    **Inventory IN** - Adds purchased items to inventory.
    """
    # Create invoice record
    invoice = UploadedInvoice(
        supplier_name=invoice_data.supplier_name,
        invoice_number=invoice_data.invoice_number,
        invoice_date=datetime.fromisoformat(invoice_data.invoice_date),
        total_amount_value=invoice_data.total_amount,
        processing_status="processed",
        ai_extracted_data_json={
            "items": [item.model_dump() for item in invoice_data.items]
        }
    )
    
    db.add(invoice)
    db.flush()
    
    # Process inventory updates
    result = InventoryService.process_invoice(
        db=db,
        tenant_id=tenant_filter.tenant_id,
        invoice_data={"items": [item.model_dump() for item in invoice_data.items]},
        supplier_name=invoice_data.supplier_name
    )
    
    return {
        "invoice_id": invoice.invoice_id,
        **result
    }


@router.get("/history")
async def get_invoice_history(
    skip: int = 0,
    limit: int = 50,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get invoice processing history."""
    
    invoices = db.query(UploadedInvoice).order_by(
        UploadedInvoice.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return {
        "invoices": [
            {
                "invoice_id": str(inv.invoice_id),
                "supplier": inv.supplier_name,
                "invoice_number": inv.invoice_number,
                "total_amount": float(inv.total_amount_value) if inv.total_amount_value else 0,
                "status": inv.processing_status,
                "created_at": inv.created_at.isoformat() if inv.created_at else None
            }
            for inv in invoices
        ],
        "count": len(invoices)
    }

@router.get("/")
async def list_invoices_root(
    skip: int = 0,
    limit: int = 50,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Alias for getting invoice history (fixes frontend calling /api/invoices)."""
    invoices = db.query(UploadedInvoice).order_by(
        UploadedInvoice.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return {
        "invoices": [
            {
                "invoice_id": str(inv.invoice_id),
                "supplier": inv.supplier_name,
                "invoice_number": inv.invoice_number,
                "total_amount": float(inv.total_amount_value) if inv.total_amount_value else 0,
                "status": inv.processing_status,
                "created_at": inv.created_at.isoformat() if inv.created_at else None
            }
            for inv in invoices
        ],
        "count": len(invoices)
    }


@router.get("/{invoice_id}")
async def get_invoice_details(
    invoice_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get invoice details."""
    invoice = db.query(UploadedInvoice).filter(
        UploadedInvoice.invoice_id == invoice_id
    ).first()
    
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    return {
        "id": str(invoice.invoice_id),
        "vendor_name": invoice.supplier_name,
        "invoice_number": invoice.invoice_number,
        "invoice_date": invoice.invoice_date.isoformat() if invoice.invoice_date else None,
        "total_amount": float(invoice.total_amount_value) if invoice.total_amount_value else 0,
        "status": invoice.processing_status,
        "line_items_json": invoice.ai_extracted_data_json.get("items", []) if invoice.ai_extracted_data_json else [],
        "created_at": invoice.created_at.isoformat() if invoice.created_at else None
    }
