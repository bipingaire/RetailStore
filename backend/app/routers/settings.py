from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.dependencies import get_db, require_admin
from app.models.tenant_models import TenantPaymentConfig

router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"],
    dependencies=[Depends(require_admin)]
)

# --- Schemas ---

class PaymentConfigUpdate(BaseModel):
    stripe_publishable_key: str
    stripe_secret_key: str

class PaymentConfigResponse(BaseModel):
    publishable_key: Optional[str]
    secret_key: Optional[str] # Masked in real apps, but returning here for simple edit logic if needed, or handle masking in frontend
    payment_enabled: bool

# --- Endpoints ---

@router.get("/payment", response_model=PaymentConfigResponse)
def get_payment_settings(db: Session = Depends(get_db)):
    config = db.query(TenantPaymentConfig).first() # One config per tenant DB
    
    if not config:
        return PaymentConfigResponse(
            publishable_key="",
            secret_key="",
            payment_enabled=False
        )
    
    return PaymentConfigResponse(
        publishable_key=config.stripe_publishable_key,
        secret_key=config.stripe_secret_key,
        payment_enabled=config.is_active
    )

@router.put("/payment", response_model=PaymentConfigResponse)
def update_payment_settings(settings: PaymentConfigUpdate, db: Session = Depends(get_db)):
    config = db.query(TenantPaymentConfig).first()
    
    if not config:
        config = TenantPaymentConfig(
            stripe_publishable_key=settings.stripe_publishable_key,
            stripe_secret_key=settings.stripe_secret_key,
            is_active=True
        )
        db.add(config)
    else:
        config.stripe_publishable_key = settings.stripe_publishable_key
        config.stripe_secret_key = settings.stripe_secret_key
        config.is_active = True
    
    db.commit()
    db.refresh(config)
    
    return PaymentConfigResponse(
        publishable_key=config.stripe_publishable_key,
        secret_key=config.stripe_secret_key,
        payment_enabled=config.is_active
    )
