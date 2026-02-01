
from fastapi import UploadFile, HTTPException
import base64
import io
import json
import os
from typing import Dict, Any, Optional, List
from pdf2image import convert_from_bytes, convert_from_path
import openai
from ..config import settings

class InvoiceParserService:
    """Service to parse invoices using OpenAI GPT-4o."""
    
    @staticmethod
    async def parse_invoice_file(file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Parse invoice content (PDF bytes or Image bytes).
        """
        if not settings.openai_api_key:
            print("WARNING: OpenAI API Key missing. Returning mock data.")
            return InvoiceParserService._get_mock_data()

        client = openai.OpenAI(api_key=settings.openai_api_key)
        encoded_image = None

        try:
            # Handle PDF
            if filename.lower().endswith(".pdf"):
                try:
                    # Convert first page of PDF to image
                    images = convert_from_bytes(file_content, first_page=1, last_page=1)
                    if images:
                        # Convert PIL image to bytes
                        img_byte_arr = io.BytesIO()
                        images[0].save(img_byte_arr, format='JPEG')
                        encoded_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
                except Exception as e:
                    print(f"PDF Conversion Error: {e}")
                    raise HTTPException(status_code=400, detail=f"Failed to convert PDF invoice: {str(e)}")
            else:
                # Handle Image directly
                encoded_image = base64.b64encode(file_content).decode('utf-8')

            if not encoded_image:
                raise HTTPException(status_code=400, detail="Could not extract image from file")

            # Prompt for OpenAI
            prompt = """
            Extract the following data from this invoice image:
            1. Vendor Name
            2. Invoice Date (YYYY-MM-DD)
            3. Total Amount
            4. Invoice Number
            5. Line Items (Product Name, Quantity, Unit Cost, UPC/SKU if available)

            Return ONLY raw JSON with this structure:
            {
                "vendor_name": "string",
                "invoice_number": "string",
                "invoice_date": "YYYY-MM-DD",
                "total_amount": number,
                "items": [
                    {
                        "product_name": "string",
                        "quantity": number,
                        "unit_cost": number,
                        "upc": "string" (or null)
                    }
                ]
            }
            """

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{encoded_image}"
                                }
                            },
                        ],
                    }
                ],
                max_tokens=1000,
                temperature=0,
                response_format={"type": "json_object"}
            )
            
            result_text = response.choices[0].message.content
            extracted_data = json.loads(result_text)
            return extracted_data

        except Exception as e:
            print(f"AI Parse Error: {e}")
            # Fallback to mock/empty if AI fails? Or re-raise?
            # Re-raising better to inform user
            raise HTTPException(status_code=500, detail=f"AI Processing Failed: {str(e)}")

    @staticmethod
    def _get_mock_data():
        return {
            "vendor_name": "Mock Supplier Inc.",
            "invoice_number": "INV-MOCK-001",
            "invoice_date": "2024-01-01",
            "total_amount": 100.00,
            "items": [
                {
                    "product_name": "Mock Item A",
                    "quantity": 10,
                    "unit_cost": 5.00,
                    "upc": None
                },
                {
                    "product_name": "Mock Item B",
                    "quantity": 2,
                    "unit_cost": 25.00,
                    "upc": None
                }
            ]
        }
