






















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































0
import os
import json
import base64
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from pdf2image import convert_from_path
from openai import OpenAI
from ..models import UploadedInvoice, Vendor, InventoryItem
from ..config import settings

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class InvoiceScanner:
    """
    Service to scan invoices using OpenAI Vision.
    Default Model: gpt-4o-mini (Cost effective & fast)
    """

    @staticmethod
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    @staticmethod
    def scan_invoice(subdomain: str, invoice_id: str, file_path: str):
        """
        Main entry point to scan an invoice.
        Updates the database with progress and results.
        Owns its own DB session to match background task lifecycle.
        """
        from ..database_manager import db_manager
        
        # Get dedicated session for this task
        db_name = db_manager.get_database_name(subdomain)
        db = db_manager.get_tenant_session(db_name)
        
        try:
            # 1. Get invoice record
            invoice = db.query(UploadedInvoice).filter(UploadedInvoice.invoice_id == invoice_id).first()
            if not invoice:
                print(f"Invoice {invoice_id} not found.")
                return

            invoice.processing_status = "processing"
            db.commit()

        try:
            # 2. Convert PDF to Images
            print(f"Converting PDF: {file_path}")
            # Ensure output directory exists for temp images
            temp_dir = os.path.dirname(file_path) + "/temp_images"
            os.makedirs(temp_dir, exist_ok=True)
            
            # Convert
            images = convert_from_path(file_path)
            total_pages = len(images)
            
            invoice.total_pages = total_pages
            invoice.pages_scanned = 0
            db.commit()

            extracted_items = []
            supplier_name = "Unknown"
            invoice_number = ""
            total_amount = 0.0
            invoice_date = None

            # 3. Process each page
            for i, image in enumerate(images):
                page_num = i + 1
                image_filename = f"{temp_dir}/{invoice_id}_page_{page_num}.jpg"
                image.save(image_filename, "JPEG")
                
                print(f"Scanning page {page_num}/{total_pages}...")
                
                # Call OpenAI
                page_data = InvoiceScanner._analyze_image_with_openai(image_filename)
                
                # Merge data
                if page_data.get("items"):
                    extracted_items.extend(page_data["items"])
                
                # Take header info from first page usually
                if page_num == 1:
                    supplier_name = page_data.get("supplier_name", "Unknown")
                    invoice_number = page_data.get("invoice_number", "")
                    total_amount = page_data.get("total_amount", 0.0)
                    invoice_date = page_data.get("invoice_date")

                # Update Progress
                invoice.pages_scanned = page_num
                db.commit()
                
                # Cleanup temp image
                os.remove(image_filename)

            # 4. Finalize
            invoice.supplier_name = supplier_name
            invoice.invoice_number = invoice_number
            # invoice.invoice_date = ... (need date parsing logic if stricter types needed)
            invoice.total_amount_value = total_amount
            
            # Save JSON
            final_json = {
                "items": extracted_items,
                "raw_openai_response": "Aggregated"
            }
            invoice.ai_extracted_data_json = final_json
            invoice.processing_status = "completed"
            db.commit()
            print(f"Invoice {invoice_id} processing complete.")

        except Exception as e:
            print(f"Error processing invoice {invoice_id}: {e}")
            invoice.processing_status = "failed"
            invoice.ai_extracted_data_json = {"error": str(e)}
            db.commit()
        finally:
            db.close()

    @staticmethod
    def _analyze_image_with_openai(image_path: str) -> Dict[str, Any]:
        """
        Sends image to OpenAI for extraction.
        """
        base64_image = InvoiceScanner.encode_image(image_path)
        
        prompt = """
        You are an AI Invoice Scanner. Extract the following data from this invoice page:
        1. Supplier Name
        2. Invoice Number
        3. Invoice Date (YYYY-MM-DD format)
        4. Total Amount
        5. Line Items (Table). For each item extract:
           - product_name (exact text from invoice)
           - quantity (number)
           - unit_cost (price per unit)
           - total_price (line total)
           - upc_code (if available, else null)

        Return ONLY raw JSON. No markdown formatting.
        Structure:
        {
            "supplier_name": "...",
            "invoice_number": "...",
            "invoice_date": "...",
            "total_amount": 123.45,
            "items": [
                {
                    "product_name": "...",
                    "quantity": 1,
                    "unit_cost": 10.00,
                    "total_price": 10.00,
                    "upc_code": null
                }
            ]
        }
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=1000,
        )
        
        content = response.choices[0].message.content
        # Clean markdown wrappers if present
        content = content.replace("```json", "").replace("```", "").strip()
        
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            print("Failed to parse OpenAI JSON response")
            return {}
