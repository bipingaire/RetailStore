
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
        print(f"-------- STARTING INVOICE SCAN FOR {invoice_id} --------")
        print(f"File path: {file_path}")
        
        if not os.getenv("OPENAI_API_KEY"):
            print("CRITICAL ERROR: OPENAI_API_KEY is missing from environment variables!")
        else:
            print("OpenAI API Key found in environment.")

        try:
            db_name = db_manager.get_database_name(subdomain)
            db = db_manager.get_tenant_session(db_name)
        except Exception as e:
            print(f"DB Connection Error: {e}")
            return
        
        try:
            invoice = db.query(UploadedInvoice).filter(UploadedInvoice.invoice_id == invoice_id).first()
            if not invoice:
                print(f"Invoice {invoice_id} not found.")
                return

            invoice.processing_status = "processing"
            db.commit()

            # 1. Convert PDF to Images
            images = []
            try:
                print("Attempting to convert PDF to images...")
                images = convert_from_path(file_path)
                print(f"PDF converted successfully. Pages: {len(images)}")
                invoice.total_pages = len(images)
                db.commit()
            except Exception as e:
                print(f"Error converting PDF: {e}")
                if "poppler" in str(e).lower():
                    invoice.error_message = "Server configuration error: Poppler not installed."
                else:
                    invoice.error_message = f"PDF Conversion Failed: {str(e)}"
                
                invoice.processing_status = "failed"
                db.commit()
                return

            extracted_data_list = []
            
            # 2. Process each page
            for i, image in enumerate(images):
                print(f"Processing page {i+1}/{len(images)}...")
                invoice.pages_scanned = i
                db.commit()
                
                temp_img_path = f"{file_path}_page_{i}.jpg"
                try:
                    image.save(temp_img_path, "JPEG")
                    
                    # Extract Data
                    page_data = InvoiceScanner._analyze_image_with_openai(temp_img_path)
                    if page_data:
                        print(f"Page {i+1} extraction success")
                        extracted_data_list.append(page_data)
                    else:
                        print(f"Page {i+1} extraction returned empty data")
                    
                except Exception as e:
                    print(f"Error processing page {i+1}: {e}")
                finally:
                    if os.path.exists(temp_img_path):
                        os.remove(temp_img_path)

            # 3. Aggregate Results
            print("Aggregating extracted data...")
            final_data = InvoiceScanner._aggregate_results(extracted_data_list)
            print(f"Final data: {json.dumps(final_data, default=str)}")
            
            # 4. Update Invoice Record
            invoice.ai_extracted_data_json = final_data
            invoice.processing_status = "completed"
            invoice.pages_scanned = len(images)
            
            # Try to populate top-level fields if AI found them
            if final_data.get("vendor_name"):
                invoice.supplier_name = final_data["vendor_name"]
            if final_data.get("invoice_number"):
                invoice.invoice_number = final_data["invoice_number"]
            if final_data.get("total_amount"):
                invoice.total_amount_value = final_data["total_amount"]
            if final_data.get("invoice_date"):
                try:
                    # Attempt simple date parsing
                    date_str = final_data["invoice_date"]
                    # Add more robust parsing logic if needed
                    pass 
                except:
                    pass

            db.commit()
            print("-------- INVOICE SCAN COMPLETED SUCCESSFULLY --------")
            
        except Exception as e:
            print(f"Fatal error scanning invoice: {e}")
            import traceback
            traceback.print_exc()
            
            try:
                invoice = db.query(UploadedInvoice).filter(UploadedInvoice.invoice_id == invoice_id).first()
                if invoice:
                    invoice.processing_status = "failed"
                    invoice.error_message = f"System Error: {str(e)}"
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
        try:
            client = get_openai_client()
            if not client:
                print("❌ OpenAI API Key missing. Skipping AI extraction.")
                return {}

            base64_image = InvoiceScanner.encode_image(image_path)
            print("Sending image to OpenAI GPT-4o-mini...")
            
            # IMPROVED PROMPT
            prompt = """
            You are an expert invoice data extractor. Analyze this invoice image and extract structured data.
            
            CRITICAL INSTRUCTIONS:
            1. **Extracted Fields**: You must extract the following in strict JSON format:
               - vendor_name (string): Name of the supplier/store.
               - invoice_number (string): The invoice or receipt number. If unsure, look for # or Inv or Receipt.
               - invoice_date (string, YYYY-MM-DD): The date of the transaction. Transform to YYYY-MM-DD format.
               - total_amount (number): The comprehensive total of the invoice.
               - items (array of objects):
                   - product_name (string): Exact text description of the line item.
                   - quantity (number): Defaults to 1 if not specified.
                   - unit_cost (number): Price per item.
                   - total_price (number): Line total.
                   - category (string): **MANDATORY**. Classify the item into one of: "Food", "Beverage", "Household", "Tobacco", "Personal Care", "Automotive", "Other". Do NOT return null. Guess if unsure.
                   - vendor_code (string, optional): SKU or product code if visible.
            
            2. **Constraints**:
               - If a field is missing, use null, but TRY HARD to find it.
               - **Category MUST NOT be null**.
               - Do not include markdown formatting like ```json.
               - Return ONLY valid JSON.
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
                max_tokens=2000,
                response_format={"type": "json_object"} # FORCE JSON
            )
            
            content = response.choices[0].message.content
            print("OpenAI Response received.")
            
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
            
        # Prioritize header info. Iterate pages until we find non-null headers.
        vendor_name = None
        invoice_number = None
        invoice_date = None
        total_amount = None
        
        for data in data_list:
            if not vendor_name and data.get("vendor_name"):
                vendor_name = data.get("vendor_name")
            if not invoice_number and data.get("invoice_number"):
                invoice_number = data.get("invoice_number")
            if not invoice_date and data.get("invoice_date"):
                invoice_date = data.get("invoice_date")
            if not total_amount and data.get("total_amount"):
                total_amount = data.get("total_amount")

        result = {
            "vendor_name": vendor_name,
            "invoice_number": invoice_number,
            "invoice_date": invoice_date,
            "total_amount": total_amount,
            "items": []
        }
        
        # Combine items from all pages
        for page in data_list:
            items = page.get("items", [])
            if items:
                result["items"].extend(items)
        
        # MATH FALLBACK: Calculate missing totals
        calculated_total = 0
        for item in result["items"]:
             # If total_price is missing but we have unit_cost, calculate it
             if not item.get("total_price") and item.get("unit_cost"):
                 try:
                     qty = float(item.get("quantity", 1))
                     cost = float(item.get("unit_cost", 0))
                     item["total_price"] = cost * qty
                 except:
                     pass
             
             # If unit_cost is missing but we have total_price, calculate it
             if not item.get("unit_cost") and item.get("total_price"):
                  try:
                      qty = float(item.get("quantity", 1))
                      total = float(item.get("total_price", 0))
                      if qty > 0:
                          item["unit_cost"] = total / qty
                  except:
                      pass
                      
             calculated_total += float(item.get("total_price", 0) or 0)

        # Fallback: if total is missing, sum items
        if not result["total_amount"]:
            result["total_amount"] = calculated_total
            
        return result

    @staticmethod
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
