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

# Add standalone invoice models (these don't need to be in tenant_models.py)
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .tenant_models import TenantBase

class CommittedInvoice(TenantBase):
    """Committed invoice history - stores invoices after review and approval."""
    __tablename__ = "committed-invoices"
    
    invoice_id = Column("invoice-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vendor_id = Column("vendor-id", UUID(as_uuid=True), ForeignKey("vendors.id"))
    supplier_name = Column("supplier-name", String(255))
    invoice_number = Column("invoice-number", String(100))
    invoice_date = Column("invoice-date", DateTime(timezone=True))
    total_amount = Column("total-amount", Numeric(12, 2))
    total_tax = Column("total-tax", Numeric(12, 2), default=0)
    total_transport = Column("total-transport", Numeric(12, 2), default=0)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    
    # Relationship to line items
    items = relationship("CommittedInvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


class CommittedInvoiceItem(TenantBase):
    """Line items for committed invoices."""
    __tablename__ = "committed-invoice-items"
    
    item_id = Column("item-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id = Column("invoice-id", UUID(as_uuid=True), ForeignKey("committed-invoices.invoice-id"), nullable=False)
    
    product_name = Column("product-name", String(255))
    vendor_code = Column("vendor-code", String(100))
    upc = Column(String(100))
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_cost = Column("unit-cost", Numeric(10, 2), nullable=False)
    line_total = Column("line-total", Numeric(12, 2))
    expiry_date = Column("expiry-date", DateTime(timezone=True))
    
    # Relationship back to invoice
    invoice = relationship("CommittedInvoice", back_populates="items")

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
    "Expense",
    
    # Invoice Models
    "CommittedInvoice",
    "CommittedInvoiceItem"
]
