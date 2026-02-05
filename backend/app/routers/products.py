"""
Product search endpoint for product matching
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..dependencies import get_master_db
from ..models import GlobalProduct

router = APIRouter()

@router.get("/")
async def list_products(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_master_db)
):
    """
    List global products with pagination.
    """
    products = db.query(GlobalProduct).limit(limit).offset(offset).all()
    
    results = []
    for product in products:
        results.append({
            "id": str(product.product_id),
            "name": product.product_name,
            "sku": product.upc_ean_code or '',
            "brand": product.brand_name,
            "category": product.category_name,
            "image_url": product.image_url
        })
        
    return {
        "success": True,
        "results": results,
        "count": len(results)
    }

@router.get("/")
async def list_products(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_master_db)
):
    """
    List global products with pagination.
    """
    products = db.query(GlobalProduct).limit(limit).offset(offset).all()
    
    results = []
    for product in products:
        results.append({
            "id": str(product.product_id),
            "name": product.product_name,
            "sku": product.upc_ean_code or '',
            # SAFE GUARDS: Ensure these are never None
            "brand": product.brand_name or "",
            "category": product.category_name or "Uncategorized", 
            "image_url": product.image_url
        })
        
    return {
        "success": True,
        "results": results,
        "count": len(results)
    }

@router.get("/search")
async def search_products(
    q: str = Query(..., description="Search query"),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_master_db)
):
    """
    Search global product catalog for fuzzy matching.
    Returns products sorted by relevance.
    """
    
    if not q or len(q.strip()) == 0:
        return {
            "success": True,
            "results": [],
            "count": 0
        }
    
    search_term = q.strip()
    
    # 1. Try exact match first
    exact_match = db.query(GlobalProduct).filter(
        GlobalProduct.product_name.ilike(search_term)
    ).first()
    
    if exact_match:
        return {
            "success": True,
            "results": [{
                "id": str(exact_match.product_id),
                "name": exact_match.product_name,
                "sku": exact_match.upc_ean_code or '',
                "brand": exact_match.brand_name or "",
                "category": exact_match.category_name or "Uncategorized",
                "confidence": 1.0
            }],
            "count": 1
        }
    
    # 2. Try UPC/SKU match
    upc_match = db.query(GlobalProduct).filter(
        GlobalProduct.upc_ean_code.ilike(search_term)
    ).first()
    
    if upc_match:
        return {
            "success": True,
            "results": [{
                "id": str(upc_match.product_id),
                "name": upc_match.product_name,
                "sku": upc_match.upc_ean_code or '',
                "brand": upc_match.brand_name or "",
                "category": upc_match.category_name or "Uncategorized",
                "confidence": 1.0
            }],
            "count": 1
        }
    
    # 3. Fuzzy search by partial name
    keywords = search_term.split()
    if len(keywords) > 0:
        # Build ILIKE pattern for all keywords
        filters = [GlobalProduct.product_name.ilike(f"%{kw}%") for kw in keywords]
        
        # Query with AND logic (all keywords must match)
        from sqlalchemy import and_
        fuzzy_results = db.query(GlobalProduct).filter(
            and_(*filters)
        ).limit(limit).all()
        
        if fuzzy_results:
            results = []
            for idx, product in enumerate(fuzzy_results):
                # Simple confidence scoring based on position
                confidence = max(0.5, 0.9 - (idx * 0.1))
                results.append({
                    "id": str(product.product_id),
                    "name": product.product_name,
                    "sku": product.upc_ean_code or '',
                    "brand": product.brand_name or "",
                    "category": product.category_name or "Uncategorized",
                    "confidence": confidence
                })
            
            return {
                "success": True,
                "results": results,
                "count": len(results)
            }
    
    # 4. No matches found
    return {
        "success": True,
        "results": [],
        "count": 0
    }
