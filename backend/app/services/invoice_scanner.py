
import os
import io
import json
import base64
from typing import List, Dict, Any, Optional
from datetime import datetime
from pdf2image import convert_from_path, convert_from_bytes
from openai import OpenAI
from sqlalchemy.orm import Session
from ..models import UploadedInvoice, Vendor, InventoryItem
from ..config import settings
from ..database_manager import db_manager

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)

class InvoiceScanner:
    """
    Service to handle PDF invoice scanning, image conversion, 
    and data extraction using OpenAI Vision.
    """
    
    @staticmethod
    def scan_invoice(subdomain: str, invoice_id: str, file_path: str):
        """
        Main entry point:
        1. Convert PDF to images
        2. Send images to OpenAI
        3. Parse results and update DB
        """
        # Create a new session for this background task
        # We need to manually manage the session lifecycle here
        db_name = db_manager.get_database_name(subdomain)
        db = db_manager.get_tenant_session(db_name)
        
        try:
            invoice = db.query(UploadedInvoice).filter(UploadedInvoice.invoice_id == invoice_id).first()
            if not invoice:
                print(f"Invoice {invoice_id} not found.")
                return

            invoice.processing_status = "processing"
            db.commit()

            # 1. Convert PDF to Images
            try:
                images = convert_from_path(file_path)
                invoice.total_pages = len(images)
                db.commit()
            except Exception as e:
                print(f"Error converting PDF: {e}")
                invoice.processing_status = "failed"
                invoice.error_message = f"PDF Conversion Failed: {str(e)}"
                db.commit()
                return

            extracted_data_list = []
            
            # 2. Process each page
            for i, image in enumerate(images):
                # Update progress
                invoice.pages_scanned = i
                db.commit()
                
                # Save temp image for processing
                temp_img_path = f"{file_path}_page_{i}.jpg"
                image.save(temp_img_path, "JPEG")
                
                # Extract Data
                page_data = InvoiceScanner._analyze_image_with_openai(temp_img_path)
                extracted_data_list.append(page_data)
                
                # Cleanup temp image
                if os.path.exists(temp_img_path):
                    os.remove(temp_img_path)

            # 3. Aggregate Results
            final_data = InvoiceScanner._aggregate_results(extracted_data_list)
            
            # 4. Update Invoice Record
            invoice.ai_extracted_data_json = final_data
            invoice.processing_status = "completed"
            invoice.pages_scanned = len(images) # Mark all done
            db.commit()
            
        except Exception as e:
            print(f"Fatal error scanning invoice: {e}")
            # Try to update status if possible
            try:
                invoice = db.query(UploadedInvoice).filter(UploadedInvoice.invoice_id == invoice_id).first()
                if invoice:
                    invoice.processing_status = "failed"
                    invoice.error_message = str(e)
                    db.commit()
            except:
                pass
        finally:
            db.close()

    @staticmethod
    def _analyze_image_with_openai(image_path: str) -> Dict[str, Any]:
        """
        Sends image to OpenAI for extraction.
        """
        client = get_openai_client()
        if not client:
            print("❌ OpenAI API Key missing. Skipping AI extraction.")
            return {}

        base64_image = InvoiceScanner.encode_image(image_path)
        
        prompt = """
        Analyze this invoice image. Extract the following fields in JSON format:
        - vendor_name (string)
        - invoice_number (string)
        - invoice_date (YYYY-MM-DD)
        - total_amount (number)
        - items (array of objects):
            - description (string)
            - quantity (number)
            - unit_price (number)
            - total_price (number)
            - product_code (string, optional)
        
        Establish the bounds of the table and extract all line items accurately.
        If a field is not found, return null.
        RETURN ONLY RAW JSON. NO MARKDOWN.
        """

        try:
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
                max_tokens=2000,
            )
            
            content = response.choices[0].message.content
            # Strip markdown if present
            content = content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
            
        except Exception as e:
            print(f"OpenAI Error: {e}")
            return {}

    @staticmethod
    def _aggregate_results(data_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Combines data from multiple pages.
        """
        if not data_list:
            return {}
            
        # Take header info from first page (usually)
        first_page = data_list[0]
        result = {
            "vendor_name": first_page.get("vendor_name"),
            "invoice_number": first_page.get("invoice_number"),
            "invoice_date": first_page.get("invoice_date"),
            "total_amount": first_page.get("total_amount"),
            "items": []
        }
        
        # Combine items from all pages
        for page in data_list:
            items = page.get("items", [])
            if items:
                result["items"].extend(items)
                
        # Fallback: if total is missing, sum items
        if not result["total_amount"] and result["items"]:
            total = sum(item.get("total_price", 0) or 0 for item in result["items"])
            result["total_amount"] = total
            
        return result

    @staticmethod
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
