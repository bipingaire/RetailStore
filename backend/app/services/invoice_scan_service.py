"""
Invoice Scanner Service - AI-Powered with Live Progress
Handles upload, AI extraction, and progress tracking via WebSocket
"""
import os
import hashlib
from datetime import datetime
from typing import AsyncGenerator
from fastapi import WebSocket
import asyncio
from pdf2image import convert_from_path
import json

from ..models.invoice_models import InvoiceScanSession, InvoiceExtractedItem
from ..services.invoice_scanner import InvoiceScanner
from ..database_manager import db_manager


class InvoiceScannerService:
    """
    New service for invoice scanning with review workflow.
    - Does NOT save to database until commit
    - Provides live progress updates via WebSocket
    """
    
    @staticmethod
    def generate_invoice_hash(supplier: str, invoice_num: str, date: str, total: float) -> str:
        """Generate SHA256 hash for duplicate detection"""
        data = f"{supplier}|{invoice_num}|{date}|{total}".lower()
        return hashlib.sha256(data.encode()).hexdigest()
    
    @staticmethod
    async def process_invoice_with_progress(
        subdomain: str,
        session_id: str,
        file_path: str,
        websocket: WebSocket
    ):
        """
        Process invoice with live WebSocket progress updates.
        
        Progress messages:
        - {"stage": "converting", "page": 1, "total": 20}
        - {"stage": "scanning", "page": 2, "total": 20}
        - {"stage": "extracting", "page": 3, "total": 20}
        - {"stage": "completed", "items_count": 45}
        - {"stage": "error", "message": "..."}
        """
        db_name = db_manager.get_database_name(subdomain)
        db = db_manager.get_tenant_session(db_name)
        
        try:
            session = db.query(InvoiceScanSession).filter(
                InvoiceScanSession.session_id == session_id
            ).first()
            
            if not session:
                await websocket.send_json({
                    "stage": "error",
                    "message": "Session not found"
                })
                return
            
            # Update status
            session.processing_status = "converting"
            db.commit()
            
            # 1. Convert PDF to images
            await websocket.send_json({
                "stage": "converting",
                "message": "Converting PDF to images..."
            })
            
            try:
                images = convert_from_path(file_path, dpi=200)
                total_pages = len(images)
                session.total_pages = total_pages
                db.commit()
                
                await websocket.send_json({
                    "stage": "converted",
                    "total_pages": total_pages
                })
            except Exception as e:
                session.processing_status = "failed"
                session.error_message = f"PDF conversion failed: {str(e)}"
                db.commit()
                await websocket.send_json({
                    "stage": "error",
                    "message": str(e)
                })
                return
            
            # 2. Extract data from each page
            session.processing_status = "scanning"
            db.commit()
            
            extracted_data_list = []
            
            for i, image in enumerate(images, start=1):
                # Send progress
                await websocket.send_json({
                    "stage": "scanning",
                    "page": i,
                    "total": total_pages,
                    "message": f"Scanning page {i}/{total_pages}..."
                })
                
                # Save temp image
                temp_img_path = f"{file_path}_page_{i}.jpg"
                image.save(temp_img_path, "JPEG")
                
                # Extract with AI
                try:
                    page_data = InvoiceScanner._analyze_image_with_openai(temp_img_path)
                    extracted_data_list.append(page_data)
                    
                    # Update progress in DB
                    session.pages_processed = i
                    db.commit()
                    
                except Exception as e:
                    print(f"Error extracting page {i}: {e}")
                    # Continue to next page
                
                # Cleanup temp image
                if os.path.exists(temp_img_path):
                    os.remove(temp_img_path)
                
                # Small delay to avoid rate limiting
                await asyncio.sleep(0.5)
            
            # 3. Aggregate results
            await websocket.send_json({
                "stage": "extracting",
                "message": "Processing extracted data..."
            })
            
            final_data = InvoiceScanner._aggregate_results(extracted_data_list)
            
            # 4. Save to session
            session.supplier_name = final_data.get("vendor_name")
            session.invoice_number = final_data.get("invoice_number")
            
            if final_data.get("invoice_date"):
                try:
                    session.invoice_date = datetime.fromisoformat(final_data["invoice_date"])
                except:
                    pass
            
            session.total_amount = final_data.get("total_amount")
            
            # Generate hash for duplicate detection
            if session.supplier_name and session.invoice_number:
                session.invoice_hash = InvoiceScannerService.generate_invoice_hash(
                    session.supplier_name or "",
                    session.invoice_number or "",
                    str(session.invoice_date) if session.invoice_date else "",
                    float(session.total_amount) if session.total_amount else 0.0
                )
            
            # 5. Save extracted items
            items = final_data.get("items", [])
            items_saved = 0
            
            for item_data in items:
                extracted_item = InvoiceExtractedItem(
                    session_id=session_id,
                    product_name=item_data.get("description"),
                    quantity=item_data.get("quantity"),
                    unit_cost=item_data.get("unit_price"),
                    line_total=item_data.get("total_price"),
                    product_code=item_data.get("product_code"),
                )
                db.add(extracted_item)
                items_saved += 1
            
            session.processing_status = "completed"
            db.commit()
            
            # 6. Send completion
            await websocket.send_json({
                "stage": "completed",
                "items_count": items_saved,
                "session_id": str(session_id),
                "supplier": session.supplier_name,
                "invoice_number": session.invoice_number,
                "total_amount": float(session.total_amount) if session.total_amount else 0
            })
            
        except Exception as e:
            print(f"Fatal error in invoice processing: {e}")
            try:
                session = db.query(InvoiceScanSession).filter(
                    InvoiceScanSession.session_id == session_id
                ).first()
                if session:
                    session.processing_status = "failed"
                    session.error_message = str(e)
                    db.commit()
            except:
                pass
            
            await websocket.send_json({
                "stage": "error",
                "message": str(e)
            })
        finally:
            db.close()
