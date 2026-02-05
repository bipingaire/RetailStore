"""
Invoice processing router - Handle invoice uploads and inventory updates
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
from datetime import datetime

from ..dependencies import get_db
from ..models import UploadedInvoice
from ..dependencies import TenantFilter
from ..dependencies import TenantFilter
from ..services.inventory_service import InventoryService
from ..services.invoice_scanner import InvoiceScanner
from fastapi import BackgroundTasks

router = APIRouter()

@router.get("/debug-db")
async def debug_database_connection(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Debug endpoint to show current database."""
    from sqlalchemy import text
    result = db.execute(text("SELECT current_database();"))
    db_name = result.scalar()
    
    # Also check if table exists
    try:
        table_check = db.execute(text("SELECT count(*) FROM \"uploaded-invoices\""))
        count = table_check.scalar()
        table_status = f"Exists (Rows: {count})"
    except Exception as e:
        table_status = f"Missing ({str(e)})"
        
    return {
        "resolved_tenant_id": tenant_filter.tenant_id,
        "connected_database": db_name,
        "table_status": table_status
    }


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
    background_tasks: BackgroundTasks,
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
        processing_status="pending",
        total_pages=0,
        pages_scanned=0
    )
    
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    # Trigger background scanning
    background_tasks.add_task(
        InvoiceScanner.scan_invoice,
        subdomain=tenant_filter.subdomain,
        invoice_id=invoice.invoice_id,
        file_path=file_location
    )
    
    return {
        "invoice_id": str(invoice.invoice_id),
        "status": "processing",
        "message": "Invoice uploaded. Processing started."
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
    invoice_id: str,  # Changed from UUID to string to handle validation ourselves
    db: Session = Depends(get_db)
):
    """Get invoice details - no auth required for polling."""
    try:
        # Validate and convert UUID
        try:
            invoice_uuid = uuid.UUID(invoice_id)
        except ValueError as e:
            print(f"Invalid UUID format: {invoice_id}, error: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid invoice ID format: {invoice_id}"
            )
        
        print(f"Fetching invoice details for {invoice_uuid}")
        
        invoice = db.query(UploadedInvoice).filter(
            UploadedInvoice.invoice_id == invoice_uuid
        ).first()
        
        if not invoice:
            print(f"Invoice {invoice_uuid} not found in database")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found"
            )
        
        print(f"Invoice {invoice_uuid} found, status: {invoice.processing_status}")
        
        return {
            "id": str(invoice.invoice_id),
            "vendor_name": invoice.supplier_name,
            "invoice_number": invoice.invoice_number,
            "invoice_date": invoice.invoice_date.isoformat() if invoice.invoice_date else None,
            "total_amount": float(invoice.total_amount_value) if invoice.total_amount_value else 0,
            "status": invoice.processing_status,
            "line_items_json": invoice.ai_extracted_data_json.get("items", []) if invoice.ai_extracted_data_json else [],
            "total_pages": invoice.total_pages or 0,
            "pages_scanned": invoice.pages_scanned or 0,
            "created_at": invoice.created_at.isoformat() if invoice.created_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching invoice {invoice_id}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
