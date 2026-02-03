"""
Invoice Scanning API - New workflow with review before commit
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
import os
import asyncio
from datetime import datetime

from ..dependencies import get_db, TenantFilter
from ..models.invoice_models import InvoiceScanSession, InvoiceExtractedItem, CommittedInvoice
from ..models.tenant_models import InventoryItem
from ..services.invoice_scan_service import InvoiceScannerService

router = APIRouter()

# ==================== UPLOAD & SCAN ====================

@router.post("/scan-upload")
async def upload_and_scan(
    file: UploadFile = File(...),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Upload PDF and create scan session (NOT saved to committed history yet).
    Returns session_id for WebSocket connection.
    """
    # Save to temp directory
    temp_dir = "uploads/temp_scans"
    os.makedirs(temp_dir, exist_ok=True)
    
    session_id = uuid.uuid4()
    temp_file_path = f"{temp_dir}/{session_id}_{file.filename}"
    
    # Save uploaded file
    with open(temp_file_path, "wb") as f:
        f.write(await file.read())
    
    # Create scan session (temp data)
    scan_session = InvoiceScanSession(
        session_id=session_id,
        temp_file_path=temp_file_path,
        processing_status="pending",
    )
    
    db.add(scan_session)
    db.commit()
    
    return {
        "session_id": str(session_id),
        "message": "Upload successful. Connect to WebSocket for live progress.",
        "websocket_url": f"/api/invoices-v2/scan-progress/{session_id}"
    }


@router.websocket("/scan-progress/{session_id}")
async def websocket_scan_progress(
    websocket: WebSocket,
    session_id: str,
    subdomain: str = "demo1"  # TODO: Extract from query params or auth
):
    """
    WebSocket endpoint for live scanning progress.
    Sends real-time updates as PDF is converted and scanned.
    """
    await websocket.accept()
    
    try:
        # Get session from DB
        from ..database_manager import db_manager
        db_name = db_manager.get_database_name(subdomain)
        db = db_manager.get_tenant_session(db_name)
        
        session = db.query(InvoiceScanSession).filter(
            InvoiceScanSession.session_id == uuid.UUID(session_id)
        ).first()
        
        if not session:
            await websocket.send_json({
                "stage": "error",
                "message": "Session not found"
            })
            await websocket.close()
            return
        
        # Start processing
        await InvoiceScannerService.process_invoice_with_progress(
            subdomain=subdomain,
            session_id=session_id,
            file_path=session.temp_file_path,
            websocket=websocket
        )
        
        db.close()
        
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_json({
                "stage": "error",
                "message": str(e)
            })
        except:
            pass
    finally:
        await websocket.close()


# ==================== REVIEW & EDIT ====================

@router.get("/sessions/{session_id}")
async def get_scan_session(
    session_id: str,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get scan session details with extracted items for review"""
    session = db.query(InvoiceScanSession).filter(
        InvoiceScanSession.session_id == uuid.UUID(session_id)
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    items = db.query(InvoiceExtractedItem).filter(
        InvoiceExtractedItem.session_id == uuid.UUID(session_id)
    ).all()
    
    return {
        "session": {
            "session_id": str(session.session_id),
            "supplier_name": session.supplier_name,
            "invoice_number": session.invoice_number,
            "invoice_date": session.invoice_date.isoformat() if session.invoice_date else None,
            "total_amount": float(session.total_amount) if session.total_amount else 0,
            "status": session.status,
            "processing_status": session.processing_status,
        },
        "items": [
            {
                "item_id": str(item.item_id),
                "product_name": item.product_name,
                "quantity": float(item.quantity) if item.quantity else 0,
                "unit_cost": float(item.unit_cost) if item.unit_cost else 0,
                "line_total": float(item.line_total) if item.line_total else 0,
                "product_code": item.product_code,
                "modified_expiry_date": item.modified_expiry_date.isoformat() if item.modified_expiry_date else None,
                "include_in_commit": item.include_in_commit,
            }
            for item in items
        ]
    }


class UpdateItemRequest(BaseModel):
    modified_expiry_date: Optional[str] = None
    modified_health_date: Optional[str] = None
    include_in_commit: Optional[bool] = None


@router.put("/sessions/{session_id}/items/{item_id}")
async def update_extracted_item(
    session_id: str,
    item_id: str,
    update_data: UpdateItemRequest,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Update extracted item before committing (dates, inclusion flag)"""
    item = db.query(InvoiceExtractedItem).filter(
        InvoiceExtractedItem.item_id == uuid.UUID(item_id),
        InvoiceExtractedItem.session_id == uuid.UUID(session_id)
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update fields
    if update_data.modified_expiry_date:
        item.modified_expiry_date = datetime.fromisoformat(update_data.modified_expiry_date)
    
    if update_data.modified_health_date:
        item.modified_health_date = datetime.fromisoformat(update_data.modified_health_date)
    
    if update_data.include_in_commit is not None:
        item.include_in_commit = update_data.include_in_commit
    
    db.commit()
    
    return {"message": "Item updated"}


# ==================== COMMIT TO INVENTORY ====================

@router.post("/sessions/{session_id}/commit")
async def commit_to_inventory(
    session_id: str,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Commit reviewed items to inventory and save to invoice history.
    This is the ONLY way invoices appear in history.
    """
    session = db.query(InvoiceScanSession).filter(
        InvoiceScanSession.session_id == uuid.UUID(session_id)
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.status == "committed":
        raise HTTPException(status_code=400, detail="Session already committed")
    
    # Get items to commit
    items = db.query(InvoiceExtractedItem).filter(
        InvoiceExtractedItem.session_id == uuid.UUID(session_id),
        InvoiceExtractedItem.include_in_commit == True
    ).all()
    
    if not items:
        raise HTTPException(status_code=400, detail="No items to commit")
    
    # TODO: Update inventory for each item
    # For now, just save to history
    
    # Create committed invoice (HISTORY ENTRY)
    committed = CommittedInvoice(
        supplier_name=session.supplier_name,
        invoice_number=session.invoice_number,
        invoice_date=session.invoice_date,
        total_amount=session.total_amount,
        invoice_hash=session.invoice_hash,
        items_count=len(items),
        original_session_id=session.session_id,
        committed_items_json=[
            {
                "product_name": item.product_name,
                "quantity": float(item.quantity) if item.quantity else 0,
                "unit_cost": float(item.unit_cost) if item.unit_cost else 0,
                "expiry_date": item.modified_expiry_date.isoformat() if item.modified_expiry_date else None,
            }
            for item in items
        ]
    )
    
    db.add(committed)
    
    # Update session status
    session.status = "committed"
    session.committed_at = datetime.utcnow()
    
    db.commit()
    
    # Delete temp file
    if os.path.exists(session.temp_file_path):
        os.remove(session.temp_file_path)
    
    return {
        "message": "Invoice committed to inventory",
        "committed_invoice_id": str(committed.committed_invoice_id),
        "items_committed": len(items)
    }


# ==================== HISTORY (COMMITTED ONLY) ====================

@router.get("/committed")
async def get_committed_invoices(
    skip: int = 0,
    limit: int = 50,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get invoice history - ONLY shows committed invoices.
    Pending sessions are NOT shown.
    """
    invoices = db.query(CommittedInvoice).order_by(
        CommittedInvoice.committed_at.desc()
    ).offset(skip).limit(limit).all()
    
    return {
        "invoices": [
            {
                "committed_invoice_id": str(inv.committed_invoice_id),
                "supplier": inv.supplier_name,
                "invoice_number": inv.invoice_number,
                "invoice_date": inv.invoice_date.isoformat() if inv.invoice_date else None,
                "total_amount": float(inv.total_amount) if inv.total_amount else 0,
                "items_count": inv.items_count,
                "committed_at": inv.committed_at.isoformat() if inv.committed_at else None,
            }
            for inv in invoices
        ],
        "count": len(invoices)
    }
