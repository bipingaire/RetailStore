"""
Master database models - Shared across all tenants.

Stored in: retailstore_master database

Contains:
- Global product catalog (all tenants can read)
- Tenant registry
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, JSON, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
import uuid

# Base for master database
MasterBase = declarative_base()


# ==================== TENANT REGISTRY ====================

class TenantRegistry(MasterBase):
    """
    Registry of all tenants.
    
    Stores metadata about each tenant's database.
    """
    __tablename__ = "tenant-registry"
    
    tenant_id = Column("tenant-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subdomain = Column(String(100), unique=True, nullable=False, index=True)
    store_name = Column("store-name", String(255), nullable=False)
    database_name = Column("database-name", String(100), unique=True, nullable=False)
    
    # Location for geo-routing
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    
    # Store contact info
    store_address = Column("store-address", Text)
    store_phone = Column("store-phone", String(50))
    store_email = Column("store-email", String(255))
    
    # Status
    is_active = Column("is-active", Boolean, default=True)
    database_created = Column("database-created", Boolean, default=False)
    
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())


# ==================== GLOBAL PRODUCT CATALOG ====================

class GlobalProduct(MasterBase):
    """
    Global product master catalog.
    
    **SHARED ACROSS ALL TENANTS**
    
    All tenants can:
    - Read from this catalog
    - Add products to their inventory (references this catalog)
    - Cannot modify (read-only for tenants)
    
    Only SuperAdmins can add/edit global products.
    """
    __tablename__ = "global-product-master-catalog"
    
    product_id = Column("product-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_name = Column("product-name", String(500), nullable=False, index=True)
    brand_name = Column("brand-name", String(255), index=True)
    manufacturer_name = Column("manufacturer-name", String(255))
    category_name = Column("category-name", String(255), index=True)
    subcategory_name = Column("subcategory-name", String(255))
    upc_ean_code = Column("upc-ean-code", String(50), unique=True, index=True)
    
    # Product details
    image_url = Column("image-url", Text)
    description_text = Column("description-text", Text)
    
    # UOM (Unit of Measurement)
    base_unit_name = Column("base-unit-name", String(50), default="piece")
    pack_size = Column("pack-size", Integer, default=1)
    pack_unit_name = Column("pack-unit-name", String(50))
    bulk_pack_product_id = Column(
        "bulk-pack-product-id",
        UUID(as_uuid=True),
        ForeignKey("global-product-master-catalog.product-id")
    )
    is_bulk_pack = Column("is-bulk-pack", Boolean, default=False)
    
    # Enrichment
    enriched_by_superadmin = Column("enriched-by-superadmin", Boolean, default=False)
    last_enriched_at = Column("last-enriched-at", DateTime(timezone=True))
    enrichment_source = Column("enrichment-source", String(50))
    metadata_json = Column("metadata-json", JSON)
    
    # Status: active, pending, rejected
    status = Column(String(20), default="active", index=True)
    
    # Timestamps
    created_at = Column("created-at", DateTime(timezone=True), server_default=func.now())
    updated_at = Column("updated-at", DateTime(timezone=True), onupdate=func.now())


class User(MasterBase):
    """
    Global Users (SuperAdmins & System Users).
    
    Stored in Master Database.
    Tenants have their own separate User table in their schemas.
    """
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    encrypted_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="superadmin")
    email_confirmed_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Alias for compatibility with superadmin router
Tenant = TenantRegistry
