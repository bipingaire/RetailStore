
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
        
        # Check OpenAI Key immediately
        if not os.getenv("OPENAI_API_KEY"):
            print("CRITICAL ERROR: OPENAI_API_KEY is missing from environment variables!")
        else:
            print("OpenAI API Key found in environment.")

        # Create a new session for this background task
        # We need to manually manage the session lifecycle here
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
                # Check for poppler specifically
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
                # Update progress
                invoice.pages_scanned = i
                db.commit()
                
                # Save temp image for processing
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
                    # Cleanup temp image
                    if os.path.exists(temp_img_path):
                        os.remove(temp_img_path)

            # 3. Aggregate Results
            print("Aggregating extracted data...")
            final_data = InvoiceScanner._aggregate_results(extracted_data_list)
            print(f"Final data: {json.dumps(final_data, default=str)}")
            
            # 4. Update Invoice Record
            invoice.ai_extracted_data_json = final_data
            
            # Populate top-level columns for easier querying
            invoice.supplier_name = final_data.get("vendor_name")
            invoice.invoice_number = final_data.get("invoice_number")
            
            # Handle Total Amount
            try:
                if final_data.get("total_amount"):
                    invoice.total_amount_value = float(final_data.get("total_amount"))
            except:
                pass
                
            # Handle Date Parsing
            date_str = final_data.get("invoice_date")
            if date_str:
                try:
                    # Try ISO first
                    invoice.invoice_date = datetime.fromisoformat(date_str)
                except ValueError:
                    try:
                        # Try common US format MM/DD/YYYY
                        invoice.invoice_date = datetime.strptime(date_str, "%m/%d/%Y")
                    except ValueError:
                        try:
                            # Try YYYY-MM-DD
                            invoice.invoice_date = datetime.strptime(date_str, "%Y-%m-%d")
                        except ValueError:
                            print(f"Could not parse invoice date: {date_str}")
            
            invoice.processing_status = "completed"
            invoice.pages_scanned = len(images) # Mark all done
            db.commit()
            print("-------- INVOICE SCAN COMPLETED SUCCESSFULLY --------")
            
        except Exception as e:
            print(f"Fatal error scanning invoice: {e}")
            import traceback
            traceback.print_exc()
            
            # Try to update status if possible
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
    def _parse_date(date_str: str) -> Optional[datetime]:
        """Helper to parse various date formats."""
        if not date_str:
            return None
        for fmt in ["%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d"]:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        try:
            return datetime.fromisoformat(date_str)
        except ValueError:
            return None
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
            
            prompt = """
            Analyze this invoice image. Extract the following fields in JSON format:
            - vendor_name (string)
            - invoice_number (string)
            - invoice_date (YYYY-MM-DD or MM/DD/YYYY)
            - total_amount (number)
            - items (array of objects):
                - product_name (string, exact text from invoice)
                - quantity (number)
                - unit_cost (number)
                - total_price (number)
                - vendor_code (string, optional - SKU/Code column)
                - upc (string, optional - UPC column if exists)
            
            Establish the bounds of the table and extract all line items accurately.
            If a field is not found, return null. 
            Do NOT guess. If unsure, return null.
            RETURN ONLY RAW JSON. NO MARKDOWN.
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
            )
            
            content = response.choices[0].message.content
            print("OpenAI Response received.")
            # Strip markdown if present
            content = content.replace("```json", "").replace("```", "").strip()
            
            try:
                return json.loads(content)
            except json.JSONDecodeError as je:
                print(f"JSON Decode Error: {je}")
                print(f"Raw content: {content}")
                return {}
            
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
