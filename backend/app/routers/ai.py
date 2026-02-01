from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import random
import time
from datetime import datetime

# In a real app, logic for OpenAI would be here
# import openai

router = APIRouter(
    tags=["ai"]
)

# --- MODELS ---

class EnrichRequest(BaseModel):
    product_name: str
    category: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None

class EnrichResponse(BaseModel):
    success: bool
    data: Dict[str, Any]

class InvoiceParsedResponse(BaseModel):
    success: bool
    data: Dict[str, Any]


# --- ENDPOINTS ---

@router.get("/health")
async def ai_health_check():
    """Simple health check to verify AI router is mounted correctly."""
    return {"status": "AI Router Active", "timestamp": datetime.now().isoformat()}

@router.post("/enrich-product", response_model=EnrichResponse)
async def enrich_product(request: EnrichRequest):
    """
    Generate marketing description and features for a product.
    Mocked implementation for demo.
    """
    # Simulate network delay
    time.sleep(1.5)
    
    # Mock Logic
    product_name = request.product_name
    category = request.category or "General"
    
    generated_description = (
        f"Experience the premium quality of {product_name}. "
        f"Designed for excellence in the {category} category, this product delivers outstanding performance and reliability. "
        "Perfect for daily use, it combines durability with modern aesthetics to meet all your needs."
    )
    
    features = [
        "Premium build quality for long-lasting durability",
        "Eco-friendly materials used in manufacturing",
        "Optimized for performance and efficiency",
        "Sleek, modern design that fits any environment",
        "Backed by our standard quality guarantee"
    ]
    
    # Generate mock SEO tags
    keywords = [k.strip().lower() for k in product_name.split()] + [category.lower(), "premium", "best value"]
    
    return {
        "success": True,
        "data": {
            "description": generated_description,
            "features": features,
            "seo_title": f"{product_name} | Best Price & Quality",
            "seo_description": generated_description[:160],
            "keywords": keywords,
            "specifications": {
                "Material": "Premium Composite",
                "Origin": "Imported",
                "Warranty": "1 Year Limited"
            }
        }
    }

@router.post("/parse-invoice", response_model=InvoiceParsedResponse)
async def parse_invoice(
    file: Optional[UploadFile] = File(None),
    imageUrl: Optional[str] = Form(None)
):
    """
    Parse an invoice file or image URL to extract vendor and product data using OpenAI GPT-4o.
    """
    from ..config import settings
    import openai
    import base64
    import io
    from pdf2image import convert_from_bytes

    if not settings.openai_api_key:
        # Fallback to mock if no key
        return {
            "success": False,
            "data": {"error": "OpenAI API Key not configured"}
        }

    client = openai.OpenAI(api_key=settings.openai_api_key)
    
    encoded_images = []
    
    try:
        if file:
            content = await file.read()
            
            # Handle PDF
            if file.content_type == "application/pdf" or file.filename.lower().endswith(".pdf"):
                # Convert first page of PDF to image
                try:
                    images = convert_from_bytes(content, first_page=1, last_page=1)
                    if images:
                        # Convert PIL image to bytes
                        img_byte_arr = io.BytesIO()
                        images[0].save(img_byte_arr, format='JPEG')
                        encoded_images.append(base64.b64encode(img_byte_arr.getvalue()).decode('utf-8'))
                except Exception as e:
                    print(f"PDF Conversion Error: {e}")
                    raise HTTPException(status_code=400, detail="Failed to convert PDF invoice")
            else:
                # Handle Image directly
                encoded_images.append(base64.b64encode(content).decode('utf-8'))
                
        elif imageUrl:
            # Simplified: just pass URL to OpenAI if supported or download/encode here
            # For now, let's assume we need a file upload for best results
            pass

        if not encoded_images:
             return {
                "success": False,
                "data": {"error": "No valid invoice image provided"}
            }

        # Prompt for OpenAI
        prompt = """
        Extract the following data from this invoice image:
        1. Vendor Name
        2. Invoice Date (YYYY-MM-DD)
        3. Total Amount
        4. Line Items (Product Name, Quantity, Unit Cost, UPC/SKU if available)

        Return ONLY raw JSON with this structure:
        {
            "vendor_name": "string",
            "invoice_date": "YYYY-MM-DD",
            "total_amount": number,
            "items": [
                {
                    "product_name": "string",
                    "quantity": number,
                    "unit_cost": number,
                    "upc": "string" (or null),
                    "notes": "string" (optional)
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
                                "url": f"data:image/jpeg;base64,{encoded_images[0]}"
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
        
        return {
            "success": True,
            "data": extracted_data
        }

    except Exception as e:
        print(f"AI Parse Error: {e}")
        return {
            "success": False,
            "data": {"error": f"Failed to parse invoice: {str(e)}"}
        }

class GenerateImageRequest(BaseModel):
    prompt: str
    apiKey: Optional[str] = None

@router.post("/generate-image")
async def generate_image(request: GenerateImageRequest):
    """
    Generate an AI image based on prompt.
    Mock implementation for demo.
    """
    # Simulate processing
    time.sleep(2.0)
    
    # Return a high-quality mock image from Unsplash based on simple keywords in prompt
    # Fallback to a generic tech/business image
    image_url = "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1000&auto=format&fit=crop"
    
    if "food" in request.prompt.lower():
         image_url = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
    elif "tech" in request.prompt.lower():
         image_url = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop"
    
    return {
        "success": True,
        "imageUrl": image_url
    }
