"""
Social Media Router
Handles social media integration, post publishing, and AI image generation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid

from ..database import get_db
from ..models.tenant_models import SocialMediaAccount, SocialMediaPost
from ..dependencies import TenantFilter, require_admin

router = APIRouter(
    tags=["Social"],
    dependencies=[Depends(require_admin)]
)

# --- Schemas ---

class SocialAccountSchema(BaseModel):
    instagram: Optional[str] = None
    instagram_token: Optional[str] = None
    facebook: Optional[str] = None
    facebook_token: Optional[str] = None
    tiktok: Optional[str] = None
    tiktok_token: Optional[str] = None
    canvaApiKey: Optional[str] = None
    imageApiKey: Optional[str] = None
    siteUrl: Optional[str] = None

class SaveSettingsRequest(BaseModel):
    accounts: SocialAccountSchema

class PublishRequest(BaseModel):
    campaignId: uuid.UUID
    platforms: List[str]

class GenerateImageRequest(BaseModel):
    prompt: str
    apiKey: Optional[str] = None
    
# --- Endpoints ---

@router.get("/accounts")
def get_social_accounts(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get all social media accounts for tenant."""
    accounts = db.query(SocialMediaAccount).all()
    
    # Map to frontend structure
    result = {
        "instagram": "", "instagram_token": "",
        "facebook": "", "facebook_token": "",
        "tiktok": "", "tiktok_token": "",
        "canvaApiKey": "", "imageApiKey": "",
        "siteUrl": ""
    }
    
    for acc in accounts:
        if acc.platform == 'facebook':
            result['facebook'] = acc.account_name
            result['facebook_token'] = acc.access_token
        elif acc.platform == 'instagram':
            result['instagram'] = acc.account_name
            result['instagram_token'] = acc.access_token
        elif acc.platform == 'tiktok':
            result['tiktok'] = acc.account_name
            result['tiktok_token'] = acc.access_token
        elif acc.platform == 'canva':
            result['canvaApiKey'] = acc.access_token
        elif acc.platform == 'openai':
            result['imageApiKey'] = acc.access_token
        elif acc.platform == 'site':
            result['siteUrl'] = acc.account_name
            
    return result

@router.post("/save-settings")
def save_social_settings(
    data: SaveSettingsRequest,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Save social media connection settings."""
    
    def update_or_create(platform, name, token):
        if not token and not name:
            return
            
        acc = db.query(SocialMediaAccount).filter(
            SocialMediaAccount.platform == platform
        ).first()
        
        if acc:
            acc.account_name = name
            acc.access_token = token
        else:
            acc = SocialMediaAccount(
                platform=platform,
                account_name=name,
                access_token=token
            )
            db.add(acc)

    update_or_create('facebook', data.accounts.facebook, data.accounts.facebook_token)
    update_or_create('instagram', data.accounts.instagram, data.accounts.instagram_token)
    update_or_create('tiktok', data.accounts.tiktok, data.accounts.tiktok_token)
    update_or_create('canva', 'Canva API', data.accounts.canvaApiKey)
    update_or_create('openai', 'OpenAI API', data.accounts.imageApiKey)
    update_or_create('site', data.accounts.siteUrl, 'url')
    
    db.commit()
    return {"success": True}

@router.post("/publish")
def publish_to_social(
    data: PublishRequest,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Publish campaign to selected social platforms (Mock)."""
    # In a real app, this would use the stored tokens to call FB/IG APIs.
    # For now, we simulate success and log a post record.
    
    for platform in data.platforms:
        post = SocialMediaPost(
            platform=platform,
            content=f"Campaign {data.campaignId} published to {platform}",
            status='published',
            published_at=datetime.utcnow()
        )
        db.add(post)
        
    db.commit()
    
    return {"success": True, "message": f"Published to {len(data.platforms)} platforms"}

@router.post("/generate-image")
def generate_ai_image(
    data: GenerateImageRequest,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Generate an AI image (Mock)."""
    # In a real app, call OpenAI DALL-E or similar using data.apiKey
    
    # Return a mock image URL
    return {
        "success": True,
        "imageUrl": "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
