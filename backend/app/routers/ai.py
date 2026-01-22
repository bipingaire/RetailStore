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
    prefix="/api/ai",
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
    Parse an invoice file or image URL to extract vendor and product data.
    Mocked implementation for demo.
    """
    # Simulate processing delay
    time.sleep(2.0)
    
    # Mock Data Groups
    mock_vendors = [
        {"name": "Global Foods Distributors", "type": "food"},
        {"name": "TechParts Solutions", "type": "tech"},
        {"name": "FreshFarm Supply", "type": "food"},
        {"name": "Office Basics Inc.", "type": "office"}
    ]
    
    mock_items_map = {
        "food": [
            {"name": "Organic Bananas", "sku": "BAN-ORG-001", "cost": 0.85},
            {"name": "Almond Milk", "sku": "ALM-US-32", "cost": 2.10},
            {"name": "Whole Wheat Bread", "sku": "BRD-WW-05", "cost": 1.50},
            {"name": "Avocados (Case)", "sku": "AVO-MX-20", "cost": 45.00},
        ],
        "tech": [
            {"name": "USB-C Cable 6ft", "sku": "CB-USC-6", "cost": 3.50},
            {"name": "Wireless Mouse", "sku": "MS-WL-01", "cost": 12.00},
            {"name": "Monitor Stand", "sku": "ST-MN-02", "cost": 25.00},
        ],
        "office": [
            {"name": "Printer Paper (Box)", "sku": "PPR-A4-500", "cost": 32.00},
            {"name": "Ballpoint Pens (Blue)", "sku": "PN-BL-12", "cost": 4.50},
        ]
    }
    
    # Select random vendor
    vendor = random.choice(mock_vendors)
    items_pool = mock_items_map.get(vendor["type"], mock_items_map["food"])
    
    # Generate random items
    num_items = random.randint(2, 5)
    selected_items = []
    total_goods = 0.0
    
    for i in range(num_items):
        item_template = random.choice(items_pool)
        qty = random.randint(5, 25)
        # Add some randomness to usage of template
        line_item = {
            "product_name": item_template["name"],
            "vendor_code": item_template["sku"],
            "upc": f"000{random.randint(1000,9999)}",
            "qty": qty,
            "unit_cost": item_template["cost"],
            "notes": "Demo: Extracted from image" if i == 0 else ""
        }
        selected_items.append(line_item)
        total_goods += (qty * item_template["cost"])
        
    tax = round(total_goods * 0.08, 2)
    shipping = 15.00
    grand_total = round(total_goods + tax + shipping, 2)
    
    return {
        "success": True,
        "data": result
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
