from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

from app.dependencies import get_db, require_admin
from app.models.tenant_models import MarketingCampaign, CampaignProduct, InventoryItem, TenantBase

router = APIRouter(
    prefix="/api/campaigns",
    tags=["Start"],
    dependencies=[Depends(require_admin)]
)

# --- Schemas ---

class CampaignProductSchema(BaseModel):
    store_inventory_id: UUID

    class Config:
        from_attributes = True

class CampaignCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    badge_label: Optional[str] = None
    badge_color: Optional[str] = None
    tagline: Optional[str] = None
    campaign_type: Optional[str] = "flash_sale"
    sort_order: Optional[int] = 0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    campaign_slug: Optional[str] = None
    is_active: Optional[bool] = False

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    badge_label: Optional[str] = None
    badge_color: Optional[str] = None
    tagline: Optional[str] = None
    campaign_type: Optional[str] = None
    sort_order: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    campaign_slug: Optional[str] = None
    is_active: Optional[bool] = None

class CampaignResponse(BaseModel):
    id: UUID
    slug: Optional[str]
    title: str
    subtitle: Optional[str]
    badge_label: Optional[str]
    badge_color: Optional[str]
    tagline: Optional[str]
    segment_type: Optional[str]
    sort_order: Optional[int]
    is_active: bool
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    segment_products: List[dict] = []

    class Config:
        from_attributes = True

# --- Endpoints ---

@router.get("", response_model=List[CampaignResponse])
def get_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(MarketingCampaign).order_by(MarketingCampaign.sort_order).all()
    
    # Map to response format
    result = []
    for c in campaigns:
        # Fetch products
        products = db.query(CampaignProduct.inventory_id).filter(CampaignProduct.campaign_id == c.campaign_id).all()
        prod_list = [{"store_inventory_id": p.inventory_id} for p in products]
        
        result.append(CampaignResponse(
            id=c.campaign_id,
            slug=c.campaign_slug,
            title=c.title,
            subtitle=c.subtitle,
            badge_label=c.badge_label,
            badge_color=c.badge_color,
            tagline=c.tagline,
            segment_type=c.campaign_type,
            sort_order=c.sort_order,
            is_active=c.is_active,
            start_date=c.start_date,
            end_date=c.end_date,
            segment_products=prod_list
        ))
    
    return result

@router.post("", response_model=CampaignResponse)
def create_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    db_campaign = MarketingCampaign(
        title=campaign.title,
        subtitle=campaign.subtitle,
        badge_label=campaign.badge_label,
        badge_color=campaign.badge_color,
        tagline=campaign.tagline,
        campaign_type=campaign.campaign_type,
        sort_order=campaign.sort_order,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        campaign_slug=campaign.campaign_slug,
        is_active=campaign.is_active
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    return CampaignResponse(
        id=db_campaign.campaign_id,
        slug=db_campaign.campaign_slug,
        title=db_campaign.title,
        subtitle=db_campaign.subtitle,
        badge_label=db_campaign.badge_label,
        badge_color=db_campaign.badge_color,
        tagline=db_campaign.tagline,
        segment_type=db_campaign.campaign_type,
        sort_order=db_campaign.sort_order,
        is_active=db_campaign.is_active,
        start_date=db_campaign.start_date,
        end_date=db_campaign.end_date,
        segment_products=[]
    )

@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(campaign_id: UUID, campaign: CampaignUpdate, db: Session = Depends(get_db)):
    db_campaign = db.query(MarketingCampaign).filter(MarketingCampaign.campaign_id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_campaign, key, value)
    
    db.commit()
    db.refresh(db_campaign)
    
    products = db.query(CampaignProduct.inventory_id).filter(CampaignProduct.campaign_id == campaign_id).all()
    prod_list = [{"store_inventory_id": p.inventory_id} for p in products]
    
    return CampaignResponse(
        id=db_campaign.campaign_id,
        slug=db_campaign.campaign_slug,
        title=db_campaign.title,
        subtitle=db_campaign.subtitle,
        badge_label=db_campaign.badge_label,
        badge_color=db_campaign.badge_color,
        tagline=db_campaign.tagline,
        segment_type=db_campaign.campaign_type,
        sort_order=db_campaign.sort_order,
        is_active=db_campaign.is_active,
        start_date=db_campaign.start_date,
        end_date=db_campaign.end_date,
        segment_products=prod_list
    )

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: UUID, db: Session = Depends(get_db)):
    db_campaign = db.query(MarketingCampaign).filter(MarketingCampaign.campaign_id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    db.delete(db_campaign)
    db.commit()
    return {"message": "Campaign deleted successfully"}

class CampaignProductsUpdate(BaseModel):
    inventory_ids: List[UUID]

@router.put("/{campaign_id}/products")
def update_campaign_products(campaign_id: UUID, data: CampaignProductsUpdate, db: Session = Depends(get_db)):
    db_campaign = db.query(MarketingCampaign).filter(MarketingCampaign.campaign_id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Delete existing products
    db.query(CampaignProduct).filter(CampaignProduct.campaign_id == campaign_id).delete()
    
    # Add new products
    for inv_id in data.inventory_ids:
        # Check if inventory exists (optional but good practice)
        link = CampaignProduct(
            campaign_id=campaign_id,
            inventory_id=inv_id
        )
        db.add(link)
    
    db.commit()
    
    return {"message": "Campaign products updated"}

class GeneratePostRequest(BaseModel):
    products: List[dict]

@router.post("/generate-post")
def generate_campaign_post(data: GeneratePostRequest, db: Session = Depends(get_db)):
    """Generate AI social media post (Mock)."""
    # In real app: call OpenAI
    product_names = [p.get('global_products', {}).get('product_name', 'Product') for p in data.products]
    names_str = ", ".join(product_names)
    
    return {
        "post": f"🔥 FLASH SALE ALERT! 🔥\n\nGet amazing deals on {names_str}! Limited time only. \n\nShop now at our store! 🛍️ #sale #deal #{names_str.split(',')[0].replace(' ', '')}"
    }
