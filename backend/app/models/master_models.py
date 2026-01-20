"""
Master database models - Stored in master database.

These models contain global data shared across all tenants:
- User accounts
- Tenant definitions
- Global product catalog
- SuperAdmin users
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import uuid

# Base for master database models
MasterBase = declarative_base()


# ==================== AUTH & USER MODELS ====================

class User(MasterBase):
    """User model - global user accounts."""
    __tablename__ = "users"
    
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


# ==================== TENANT MODELS ====================

class Tenant(MasterBase):
    """Retail store tenant - stored in master DB."""
    __tablename__ = "retail-store-tenant"
    
    tenant_id = Column("tenant-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    store_name = Column("store-name", String(255), nullable=False)
    store_address = Column("store-address", Text)
    store_phone = Column("store-phone", String(50))
    store_email = Column("store-email", String(255))
    subdomain = Column(String(100), unique=True, nullable=False, index=True)
    
    # NEW: Database name for this tenant
    database_name = Column("database-name", String(100), unique=True, nullable=False)
    database_created = Column("database-created", Boolean, default=False)
    
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("TenantUser", back_populates="tenant")


class TenantUser(MasterBase):
    """Junction table for tenant-user relationships."""
    __tablename__ = "tenant-user-role-assignment"
    
    assignment_id = Column("assignment-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column("tenant-id", UUID(as_uuid=True), ForeignKey("retail-store-tenant.tenant-id"), nullable=False)
    user_id = Column("user-id", UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role_name = Column("role-name", String(50), default="admin")
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    user = relationship("User", back_populates="tenant_users")


class SuperadminUser(MasterBase):
    """Superadmin users with global access."""
    __tablename__ = "superadmin-users"
    
    superadmin_id = Column("superadmin-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column("user-id", UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column("full-name", String(255))
    email = Column(String(255))
    permissions_json = Column("permissions-json", JSON)
    is_active = Column("is-active", Boolean, default=True)
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="superadmin")


# ==================== GLOBAL PRODUCT CATALOG ====================

class GlobalProduct(MasterBase):
    """Global product master catalog - shared across all tenants."""
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
    last_enriched_by = Column("last-enriched-by", UUID(as_uuid=True), ForeignKey("users.id"))
    enrichment_source = Column("enrichment-source", String(50))
    metadata_json = Column("metadata-json", JSON)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())
