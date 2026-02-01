"""
Unified models export.

This file exports models from master_models.py and tenant_models.py
to ensure a single source of truth for model definitions.
"""

# Import Master Models (Shared)
from .master_models import (
    MasterBase,
    TenantRegistry,
    GlobalProduct,
    User as MasterUser,  # Alias to avoid conflict if needed, though they are distinct classes
)

# Import Tenant Models (Isolated)
from .tenant_models import (
    TenantBase,
    User,
    StoreInfo,
    InventoryItem,
    Customer,
    CustomerOrder,
    OrderLineItem,
    DeliveryAddress,
    Vendor,
    UploadedInvoice,
    ShelfAuditRecord,
    ShelfAuditItem,
    PosItemMapping,
    SocialMediaPost,
    SocialMediaAccount,
    TenantPaymentConfig,
    MarketingCampaign,
    CampaignProduct,
    Expense
)

# Export all models for easy access via `from app.models import ...`
__all__ = [
    # Master Models
    "MasterBase",
    "TenantRegistry",
    "GlobalProduct",
    "MasterUser",
    
    # Tenant Models
    "TenantBase",
    "User",
    "StoreInfo",
    "InventoryItem",
    "Customer",
    "CustomerOrder",
    "OrderLineItem",
    "DeliveryAddress",
    "Vendor",
    "UploadedInvoice",
    "ShelfAuditRecord",
    "ShelfAuditItem",
    "PosItemMapping",
    "SocialMediaPost",
    "SocialMediaAccount",
    "TenantPaymentConfig",
    "MarketingCampaign",
    "CampaignProduct",
    "Expense"
]
