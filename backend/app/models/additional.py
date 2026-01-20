"""
Extended SQLAlchemy models for the retail store application.
These additional models complete the database schema.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base


# ==================== BILLING MODELS ====================

class TenantSubscription(Base):
    """Tenant subscription plans."""
    __tablename__ = "tenant-subscriptions"
    
    subscription_id = Column("subscription-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    plan_name = Column("plan-name", String(100))
    status = Column(String(50))
    billing_cycle = Column("billing-cycle", String(50))
    amount = Column(Numeric(10, 2))
    start_date = Column("start-date", DateTime(timezone=True))
    end_date = Column("end-date", DateTime(timezone=True))
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


class BillingTransaction(Base):
    """Billing transaction history."""
    __tablename__ = "billing-transactions"
    
    transaction_id = Column("transaction-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    amount = Column(Numeric(10, 2))
    transaction_type = Column("transaction-type", String(50))
    status = Column(String(50))
    payment_method = Column("payment-method", String(50))
    transaction_date = Column("transaction-date", DateTime(timezone=True), server_default=func.now())


class TenantPaymentConfig(Base):
    """Tenant payment configuration (Stripe, etc.)."""
    __tablename__ = "tenant-payment-config"
    
    config_id = Column("config-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False, unique=True)
    stripe_publishable_key = Column("stripe-publishable-key", Text)
    stripe_secret_key = Column("stripe-secret-key", Text)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== ENRICHMENT & PENDING MODELS ====================

class ProductEnrichmentHistory(Base):
    """Product enrichment history log."""
    __tablename__ = "product-enrichment-history"
    
    enrichment_id = Column("enrichment-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column("product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    enriched_by_user_id = Column("enriched-by-user-id", UUID(as_uuid=True), ForeignKey("auth.users.id"))
    enrichment_type = Column("enrichment-type", String(50))
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"))
    changes_json = Column("changes-json", JSON)
    previous_data_json = Column("previous-data-json", JSON)
    enrichment_source = Column("enrichment-source", String(50))
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


class PendingProductAddition(Base):
    """Pending product additions for approval."""
    __tablename__ = "pending-product-additions"
    
    pending_id = Column("pending-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    added_by_user_id = Column("added-by-user-id", UUID(as_uuid=True), ForeignKey("auth.users.id"))
    product_name = Column("product-name", String(500))
    upc_ean_code = Column("upc-ean-code", String(50))
    brand_name = Column("brand-name", String(255))
    manufacturer_name = Column("manufacturer-name", String(255))
    category_name = Column("category-name", String(255))
    description_text = Column("description-text", Text)
    image_url = Column("image-url", Text)
    suggested_match_product_id = Column("suggested-match-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    ai_confidence_score = Column("ai-confidence-score", Numeric(3, 2))
    ai_analysis_json = Column("ai-analysis-json", JSON)
    status = Column(String(50), default="pending")
    reviewed_by = Column("reviewed-by", UUID(as_uuid=True), ForeignKey("auth.users.id"))
    reviewed_at = Column("reviewed-at", DateTime(timezone=True))
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== AUDIT & POS MODELS ====================

class ShelfAuditRecord(Base):
    """Shelf audit records."""
    __tablename__ = "shelf-audit-record"
    
    audit_id = Column("audit-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    audited_by = Column("audited-by", UUID(as_uuid=True), ForeignKey("auth.users.id"))
    audit_date = Column("audit-date", DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    
    # Relationship
    items = relationship("ShelfAuditItem", back_populates="audit")


class ShelfAuditItem(Base):
    """Individual items in shelf audit."""
    __tablename__ = "shelf-audit-item"
    
    item_id = Column("item-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_id = Column("audit-id", UUID(as_uuid=True), ForeignKey("shelf-audit-record.audit-id"), nullable=False)
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    expected_quantity = Column("expected-quantity", Numeric(10, 2))
    actual_quantity = Column("actual-quantity", Numeric(10, 2))
    discrepancy = Column(Numeric(10, 2))
    
    # Relationship
    audit = relationship("ShelfAuditRecord", back_populates="items")


class PosItemMapping(Base):
    """POS system item mapping."""
    __tablename__ = "pos-item-mapping"
    
    mapping_id = Column("mapping-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    pos_item_code = Column("pos-item-code", String(100))
    pos_item_name = Column("pos-item-name", String(500))
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    confidence_score = Column("confidence-score", Numeric(3, 2))
    is_verified = Column("is-verified", Boolean, default=False)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== INVOICE & DELIVERY MODELS ====================

class UploadedInvoice(Base):
    """Uploaded vendor invoices."""
    __tablename__ = "uploaded-vendor-invoice-document"
    
    invoice_id = Column("invoice-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    file_url_path = Column("file-url-path", Text)
    processing_status = Column("processing-status", String(50))
    supplier_name = Column("supplier-name", String(255))
    invoice_number = Column("invoice-number", String(100))
    invoice_date = Column("invoice-date", DateTime(timezone=True))
    total_amount_value = Column("total-amount-value", Numeric(10, 2))
    ai_extracted_data_json = Column("ai-extracted-data-json", JSON)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


class DeliveryAddress(Base):
    """Delivery address for orders."""
    __tablename__ = "delivery-address-information"
    
    address_id = Column("address-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column("order-id", UUID(as_uuid=True), ForeignKey("customer-order-header.order-id"))
    customer_id = Column("customer-id", UUID(as_uuid=True), ForeignKey("retail-store-customer.customer-id"))
    full_name = Column("full-name", String(255))
    address_line1 = Column("address-line1", Text)
    address_line2 = Column("address-line2", Text)
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column("postal-code", String(20))
    country = Column(String(100))
    phone = Column(String(50))


# ==================== WEBSITE & SOCIAL MODELS ====================

class MasterWebsiteConfig(Base):
    """Master website configuration."""
    __tablename__ = "master-website-config"
    
    config_id = Column("config-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False, unique=True)
    theme_settings = Column("theme-settings", JSON)
    navigation_menu = Column("navigation-menu", JSON)
    footer_content = Column("footer-content", JSON)
    seo_settings = Column("seo-settings", JSON)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())


class SocialMediaPost(Base):
    """Social media posts."""
    __tablename__ = "social-media-posts"
    
    post_id = Column("post-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    platform = Column(String(50))
    content = Column(Text)
    media_urls = Column("media-urls", JSON)
    scheduled_time = Column("scheduled-time", DateTime(timezone=True))
    published_at = Column("published-at", DateTime(timezone=True))
    status = Column(String(50))
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


class SocialMediaAccount(Base):
    """Connected social media accounts."""
    __tablename__ = "social-media-accounts"
    
    account_id = Column("account-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    platform = Column(String(50))
    account_name = Column("account-name", String(255))
    access_token = Column("access-token", Text)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== SUBDOMAIN MAPPING ====================

class SubdomainTenantMapping(Base):
    """Subdomain to tenant mapping."""
    __tablename__ = "subdomain-tenant-mapping"
    
    mapping_id = Column("mapping-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subdomain = Column(String(100), nullable=False, unique=True, index=True)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
