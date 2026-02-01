from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.dependencies import get_db, require_admin
from app.models.tenant_models import TenantPaymentConfig

router = APIRouter(
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

# --- Stripe Integration ---
try:
    import stripe
except ImportError:
    stripe = None

class PaymentStatement(BaseModel):
    id: str
    amount: float
    currency: str
    status: str
    created: str
    description: str
    customerEmail: str

@router.get("/payment/statements", response_model=dict)
def get_payment_statements(db: Session = Depends(get_db)):
    """Fetch recent payment statements from Stripe."""
    config = db.query(TenantPaymentConfig).first()
    
    if not config or not config.stripe_secret_key:
        return {"statements": []}
        
    if not stripe:
        # Fallback if stripe lib not installed or for testing without it
        # Return empty or mock? Legacy returned empty if config missing.
        # Let's mock a few for demo purposes if secret key exists but lib missing (unlikely in prod)
        # or just error.
        print("Stripe library not installed.")
        return {"statements": []}
        
    try:
        stripe.api_key = config.stripe_secret_key
        # Limit to 100 as per legacy
        intents = stripe.PaymentIntent.list(limit=100)
        
        statements = []
        for pi in intents.data:
            statements.append({
                "id": pi.id,
                "amount": pi.amount / 100.0,
                "currency": pi.currency.upper(),
                "status": pi.status,
                "created": datetime.fromtimestamp(pi.created).isoformat(),
                "description": pi.description or 'No description',
                "customerEmail": pi.receipt_email or 'N/A'
            })
            
        return {"statements": statements}
        
    except Exception as e:
        print(f"Stripe Error: {e}")
        # In legacy, we returned 500. Here we returns empty or error.
        # Let's return empty to avoid breaking UI, or raise HTTP 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
