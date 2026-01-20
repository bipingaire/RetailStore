"""
SQLAlchemy models for the retail store application.
These models replace Supabase tables with equivalent SQLAlchemy models.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Numeric, ARRAY, JSON, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base


# ==================== AUTH & USER MODELS ====================

class User(Base):
    """User model - maps to auth.users in Supabase."""
    __tablename__ = "users"
    __table_args__ = {"schema": "auth"}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    encrypted_password = Column(String(255), nullable=False)
    email_confirmed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    tenant_users = relationship("TenantUser", back_populates="user")
    superadmin = relationship("SuperadminUser", back_populates="user", uselist=False)


# ==================== MULTI-TENANT MODELS ====================

class Tenant(Base):
    """Retail store tenant."""
    __tablename__ = "retail-store-tenant"
    
    tenant_id = Column("tenant-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    store_name = Column("store-name", String(255), nullable=False)
    store_address = Column("store-address", Text)
    store_phone = Column("store-phone", String(50))
    store_email = Column("store-email", String(255))
    subdomain = Column(String(100), unique=True)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("TenantUser", back_populates="tenant")
    inventory = relationship("InventoryItem", back_populates="tenant")
    orders = relationship("CustomerOrder", back_populates="tenant")


class TenantUser(Base):
    """Junction table for tenant-user relationships."""
    __tablename__ = "tenant-user-role-assignment"
    
    assignment_id = Column("assignment-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    user_id = Column("user-id", UUID(as_uuid=True), ForeignKey("auth.users.id"), nullable=False)
    role_name = Column("role-name", String(50), default="admin")
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    user = relationship("User", back_populates="tenant_users")


class SuperadminUser(Base):
    """Superadmin users with global access."""
    __tablename__ = "superadmin-users"
    
    superadmin_id = Column("superadmin-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column("user-id", UUID(as_uuid=True), ForeignKey("auth.users.id"), unique=True, nullable=False)
    full_name = Column("full-name", String(255))
    email = Column(String(255))
    permissions_json = Column("permissions-json", JSON)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="superadmin")


# ==================== PRODUCT MODELS ====================

class GlobalProduct(Base):
    """Global product master catalog."""
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
    
    # Enrichment fields
    enriched_by_superadmin = Column("enriched-by-superadmin", Boolean, default=False)
    last_enriched_at = Column("last-enriched-at", DateTime(timezone=True))
    last_enriched_by = Column("last-enriched-by", UUID(as_uuid=True), ForeignKey("auth.users.id"))
    enrichment_source = Column("enrichment-source", String(50))
    metadata_json = Column("metadata-json", JSON)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    inventory_items = relationship("InventoryItem", back_populates="global_product")


class InventoryItem(Base):
    """Store-specific inventory."""
    __tablename__ = "retail-store-inventory-item"
    
    inventory_id = Column("inventory-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    
    quantity_on_hand = Column("quantity-on-hand", Numeric(10, 2), default=0)
    reorder_level = Column("reorder-level", Numeric(10, 2))
    unit_cost = Column("unit-cost", Numeric(10, 2))
    selling_price = Column("selling-price", Numeric(10, 2))
    
    # Local enrichment
    local_enrichment_json = Column("local-enrichment-json", JSON)
    has_local_override = Column("has-local-override", Boolean, default=False)
    override_image_url = Column("override-image-url", Text)
    override_description = Column("override-description", Text)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tenant = relationship("Tenant", back_populates="inventory")
    global_product = relationship("GlobalProduct", back_populates="inventory_items")


# ==================== ORDER MODELS ====================

class CustomerOrder(Base):
    """Customer orders."""
    __tablename__ = "customer-order-header"
    
    order_id = Column("order-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    customer_id = Column("customer-id", UUID(as_uuid=True), ForeignKey("retail-store-customer.customer-id"))
    
    order_status = Column("order-status", String(50), default="pending")
    payment_status = Column("payment-status", String(50), default="unpaid")
    total_amount = Column("total-amount", Numeric(10, 2))
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tenant = relationship("Tenant", back_populates="orders")
    line_items = relationship("OrderLineItem", back_populates="order")


class OrderLineItem(Base):
    """Order line items."""
    __tablename__ = "order-line-item-detail"
    
    line_id = Column("line-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column("order-id", UUID(as_uuid=True), ForeignKey("customer-order-header.order-id"), nullable=False)
    global_product_id = Column("global-product-id", UUID(as_uuid=True), ForeignKey("global-product-master-catalog.product-id"))
    
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column("unit-price", Numeric(10, 2))
    line_total = Column("line-total", Numeric(10, 2))
    
    # Relationships
    order = relationship("CustomerOrder", back_populates="line_items")


class Customer(Base):
    """Retail store customers."""
    __tablename__ = "retail-store-customer"
    
    customer_id = Column("customer-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    user_id = Column("user-id", UUID(as_uuid=True), ForeignKey("auth.users.id"))
    
    full_name = Column("full-name", String(255))
    email = Column(String(255))
    phone = Column(String(50))
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())


# ==================== VENDOR MODELS ====================

class Vendor(Base):
    """Vendors for inventory."""
    __tablename__ = "vendors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    name = Column(String(255), nullable=False)
    ein = Column(String(50))
    address = Column(Text)
    website = Column(String(255))
    email = Column(String(255))
    contact_phone = Column("contact-phone", String(50))
    fax = Column(String(50))
    poc_name = Column("poc-name", String(255))
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
