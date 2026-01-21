"""
SQLAlchemy models for fully isolated tenant databases.

Each tenant database contains ALL data including:
- Users (login credentials)
- Customers
- Inventory
- Orders
- Vendors
- etc.

NO shared data between tenants.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import uuid

# Base for all models
Base = declarative_base()


# ==================== AUTH & USER MODELS ====================

class User(Base):
    """User model - stored in each tenant database separately."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    encrypted_password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")  # admin, customer, staff
    email_confirmed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)


# ==================== STORE INFO ====================

class StoreInfo(Base):
    """Store information - one record per tenant database."""
    __tablename__ = "store-info"
    
    store_id = Column("store-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    store_name = Column("store-name", String(255), nullable=False)
    subdomain = Column(String(100))
    store_address = Column("store-address", Text)
    store_phone = Column("store-phone", String(50))
    store_email = Column("store-email", String(255))
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== PRODUCT CATALOG ====================

class GlobalProduct(Base):
    """Product catalog - each tenant has their own copy."""
    __tablename__ = "global-product-master-catalog"
    
    product_id = Column("product-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_name = Column("product-name", String(500), nullable=False)
    brand_name = Column("brand-name", String(255))
    manufacturer_name = Column("manufacturer-name", String(255))
    category_name = Column("category-name", String(255))
    subcategory_name = Column("subcategory-name", String(255))
    upc_ean_code = Column("upc-ean-code", String(50), index=True)
    image_url = Column("image-url", Text)
    description_text = Column("description-text", Text)
    
    # UOM fields
    base_unit_name = Column("base-unit-name", String(50), default="piece")
    pack_size = Column("pack-size", Integer, default=1)
    pack_unit_name = Column("pack-unit-name", String(50))
    bulk_pack_product_id = Column("bulk-pack-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    is_bulk_pack = Column("is-bulk-pack", Boolean, default=False)
    
    # Enrichment
    enriched_by_superadmin = Column("enriched-by-superadmin", Boolean, default=False)
    last_enriched_at = Column("last-enriched-at", DateTime(timezone=True))
    metadata_json = Column("metadata-json", JSON)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())


# ==================== INVENTORY ====================

class InventoryItem(Base):
    """Store-specific inventory."""
    __tablename__ = "inventory-items"
    
    inventory_id = Column("inventory-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    
    quantity_on_hand = Column("quantity-on-hand", Numeric(10, 2), default=0)
    reorder_level = Column("reorder-level", Numeric(10, 2))
    unit_cost = Column("unit-cost", Numeric(10, 2))
    selling_price = Column("selling-price", Numeric(10, 2))
    
    local_enrichment_json = Column("local-enrichment-json", JSON)
    has_local_override = Column("has-local-override", Boolean, default=False)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    product = relationship("GlobalProduct")


# ==================== CUSTOMERS ====================

class Customer(Base):
    """Store customers."""
    __tablename__ = "customers"
    
    customer_id = Column("customer-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column("user-id", UUID(as_uuid=True), ForeignKey("users.id"))
    
    full_name = Column("full-name", String(255))
    email = Column(String(255))
    phone = Column(String(50))
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User")


# ==================== ORDERS ====================

class CustomerOrder(Base):
    """Customer orders."""
    __tablename__ = "customer-orders"
    
    order_id = Column("order-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column("customer-id", UUID(as_uuid=True), ForeignKey("customers.customer-id"))
    
    order_status = Column("order-status", String(50), default="pending")
    payment_status = Column("payment-status", String(50), default="unpaid")
    total_amount = Column("total-amount", Numeric(10, 2))
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    line_items = relationship("OrderLineItem", back_populates="order")
    customer = relationship("Customer")


class OrderLineItem(Base):
    """Order line items."""
    __tablename__ = "order-line-items"
    
    line_id = Column("line-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column("order-id", UUID(as_uuid=True), ForeignKey("customer-orders.order-id"))
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column("unit-price", Numeric(10, 2))
    line_total = Column("line-total", Numeric(10, 2))
    
    # Relationships
    order = relationship("CustomerOrder", back_populates="line_items")
    product = relationship("GlobalProduct")


class DeliveryAddress(Base):
    """Delivery addresses."""
    __tablename__ = "delivery-addresses"
    
    address_id = Column("address-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column("order-id", UUID(as_uuid=True), ForeignKey("customer-orders.order-id"))
    customer_id = Column("customer-id", UUID(as_uuid=True), ForeignKey("customers.customer-id"))
    
    full_name = Column("full-name", String(255))
    address_line1 = Column("address-line1", Text)
    address_line2 = Column("address-line2", Text)
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column("postal-code", String(20))
    country = Column(String(100))
    phone = Column(String(50))


# ==================== VENDORS ====================

class Vendor(Base):
    """Vendors."""
    __tablename__ = "vendors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    ein = Column(String(50))
    address = Column(Text)
    website = Column(String(255))
    email = Column(String(255))
    contact_phone = Column("contact-phone", String(50))
    fax = Column(String(50))
    poc_name = Column("poc-name", String(255))
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== INVOICES ====================

class UploadedInvoice(Base):
    """Uploaded vendor invoices."""
    __tablename__ = "uploaded-invoices"
    
    invoice_id = Column("invoice-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_url_path = Column("file-url-path", Text)
    processing_status = Column("processing-status", String(50))
    supplier_name = Column("supplier-name", String(255))
    invoice_number = Column("invoice-number", String(100))
    invoice_date = Column("invoice-date", DateTime(timezone=True))
    total_amount_value = Column("total-amount-value", Numeric(10, 2))
    ai_extracted_data_json = Column("ai-extracted-data-json", JSON)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== AUDITS ====================

class ShelfAuditRecord(Base):
    """Shelf audit records."""
    __tablename__ = "shelf-audit-records"
    
    audit_id = Column("audit-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audited_by = Column("audited-by", UUID(as_uuid=True), ForeignKey("users.id"))
    audit_date = Column("audit-date", DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    
    # Relationships
    items = relationship("ShelfAuditItem", back_populates="audit")
    user = relationship("User")


class ShelfAuditItem(Base):
    """Individual items in shelf audit."""
    __tablename__ = "shelf-audit-items"
    
    item_id = Column("item-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_id = Column("audit-id", UUID(as_uuid=True), ForeignKey("shelf-audit-records.audit-id"))
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    
    expected_quantity = Column("expected-quantity", Numeric(10, 2))
    actual_quantity = Column("actual-quantity", Numeric(10, 2))
    discrepancy = Column(Numeric(10, 2))
    
    # Relationships
    audit = relationship("ShelfAuditRecord", back_populates="items")
    product = relationship("GlobalProduct")


# ==================== POS & SOCIAL ====================

class PosItemMapping(Base):
    """POS system item mapping."""
    __tablename__ = "pos-item-mappings"
    
    mapping_id = Column("mapping-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pos_item_code = Column("pos-item-code", String(100))
    pos_item_name = Column("pos-item-name", String(500))
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    confidence_score = Column("confidence-score", Numeric(3, 2))
    is_verified = Column("is-verified", Boolean, default=False)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


class SocialMediaPost(Base):
    """Social media posts."""
    __tablename__ = "social-media-posts"
    
    post_id = Column("post-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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
    platform = Column(String(50))
    account_name = Column("account-name", String(255))
    access_token = Column("access-token", Text)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


class TenantPaymentConfig(Base):
    """Tenant payment configuration."""
    __tablename__ = "payment-config"
    
    config_id = Column("config-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stripe_publishable_key = Column("stripe-publishable-key", Text)
    stripe_secret_key = Column("stripe-secret-key", Text)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
