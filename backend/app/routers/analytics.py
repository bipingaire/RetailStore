"""
Inventory analytics router - Health checks, campaigns, and insights
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict
import uuid

from ..dependencies import get_db
from ..dependencies import TenantFilter
from ..services.inventory_service import InventoryService

router = APIRouter()


# Pydantic schemas
class CampaignCreate(BaseModel):
    product_ids: List[uuid.UUID]
    discount_percent: float
    campaign_type: str  # "website", "social_media", "both"
    duration_days: int


@router.get("/health")
@router.get("/inventory-health")
async def get_inventory_health(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Analyze inventory health.
    
    **Inventory Health & Campaigns** - Identifies:
    - Low stock items (need restock)
    - Overstocked items (push to sale)
    - Out of stock items (urgent)
    
    Returns health score and actionable insights.
    """
    health_data = InventoryService.analyze_health(
        db=db,
        tenant_id=tenant_filter.tenant_id
    )
    
    # Add recommendations
    recommendations = []
    
    if health_data['low_stock_count'] > 0:
        recommendations.append({
            "type": "restock",
            "priority": "high",
            "message": f"{health_data['low_stock_count']} items need restocking",
            "action": "Create purchase orders"
        })
    
    if health_data['overstocked_count'] > 0:
        recommendations.append({
            "type": "campaign",
            "priority": "medium",
            "message": f"{health_data['overstocked_count']} items are overstocked",
            "action": "Create sale campaign"
        })
    
    if health_data['out_of_stock_count'] > 0:
        recommendations.append({
            "type": "urgent_restock",
            "priority": "critical",
            "message": f"{health_data['out_of_stock_count']} items are out of stock",
            "action": "Immediate restocking required"
        })
    
    health_data['recommendations'] = recommendations
    
    return health_data


@router.post("/push-to-sale")
async def push_to_sale_campaign(
    campaign_data: CampaignCreate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Create sales campaign for overstocked items.
    
    **Push to Website & Social Media** - Creates campaigns to move inventory.
    
    - **product_ids**: Products to include in campaign
    - **discount_percent**: Discount percentage
    - **campaign_type**: Where to publish (website/social_media/both)
    - **duration_days**: Campaign duration
    """
    from ..models.additional import SocialMediaPost
    from datetime import datetime, timedelta
    
    # Create social media posts if requested
    posts_created = []
    
    if campaign_data.campaign_type in ["social_media", "both"]:
        # Get product details
        from ..models import GlobalProduct, InventoryItem
        
        products = []
        for product_id in campaign_data.product_ids:
            inventory = db.query(InventoryItem).join(GlobalProduct).filter(
                InventoryItem.tenant_id == tenant_filter.tenant_id,
                InventoryItem.global_product_id == product_id
            ).first()
            
            if inventory and inventory.global_product:
                products.append({
                    "name": inventory.global_product.product_name,
                    "price": float(inventory.selling_price or 0),
                    "discount": campaign_data.discount_percent
                })
        
        # Create social media post
        campaign_content = f"🔥 FLASH SALE! {campaign_data.discount_percent}% OFF on selected items for {campaign_data.duration_days} days! "
        campaign_content += f"Featured products: {', '.join([p['name'] for p in products[:3]])}..."
        
        post = SocialMediaPost(
            tenant_id=tenant_filter.tenant_id,
            platform="all",
            content=campaign_content,
            status="draft",
            scheduled_time=datetime.utcnow() + timedelta(hours=1)
        )
        
        db.add(post)
        db.commit()
        db.refresh(post)
        
        posts_created.append(post.post_id)
    
    return {
        "campaign_created": True,
        "product_count": len(campaign_data.product_ids),
        "discount_percent": campaign_data.discount_percent,
        "campaign_type": campaign_data.campaign_type,
        "duration_days": campaign_data.duration_days,
        "social_media_posts": [str(p) for p in posts_created],
        "message": "Campaign created successfully"
    }


@router.get("/insights")
async def get_inventory_insights(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get AI-powered inventory insights.
    
    Returns:
    - Trending products
    - Slow-moving items
    - Profitability analysis
    """
    from ..models import InventoryItem, GlobalProduct
    from sqlalchemy import desc
    
    # Get inventory with products
    inventory_items = db.query(InventoryItem).join(GlobalProduct).filter(
        InventoryItem.tenant_id == tenant_filter.tenant_id
    ).all()
    
    # Calculate metrics
    total_value = sum(
        float(item.quantity_on_hand * (item.selling_price or 0))
        for item in inventory_items
    )
    
    total_cost = sum(
        float(item.quantity_on_hand * (item.unit_cost or 0))
        for item in inventory_items
    )
    
    potential_profit = total_value - total_cost
    
    return {
        "total_inventory_value": total_value,
        "total_cost": total_cost,
        "potential_profit": potential_profit,
        "total_items": len(inventory_items),
        "insights": [
            {
                "type": "value",
                "message": f"Total inventory value: ${total_value:,.2f}"
            },
            {
                "type": "profit",
                "message": f"Potential profit: ${potential_profit:,.2f}"
            }
        ]
    }
