"""
New models for Invoice Scanner with Review Workflow
"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .tenant_models import TenantBase

# ==================== INVOICE SCANNING (REVIEW WORKFLOW) ====================

class InvoiceScanSession(TenantBase):
    """
    Temporary storage for AI-extracted invoice data.
    NOT saved to committed history until admin reviews and commits.
    """
    __tablename__ = "invoice-scan-sessions"
    
    session_id = Column("session-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # AI-extracted header data
    supplier_name = Column("supplier-name", String(255))
    invoice_number = Column("invoice-number", String(100))
    invoice_date = Column("invoice-date", DateTime(timezone=True))
    total_amount = Column("total-amount", Numeric(10, 2))
    
    # Processing status
    status = Column(String(50), default="pending_review")  # pending_review, committed, rejected
    
    # Duplicate detection
    is_duplicate = Column("is-duplicate", Boolean, default=False)
    duplicate_of_session_id = Column("duplicate-of-session-id", UUID(as_uuid=True), nullable=True)
    invoice_hash = Column("invoice-hash", String(64))  # SHA256 hash for duplicate detection
    
    # Processing metadata
    total_pages = Column("total-pages", Integer, default=0)
    pages_processed = Column("pages-processed", Integer, default=0)
    processing_status = Column("processing-status", String(50))  # scanning, completed, failed
    error_message = Column("error-message", Text, nullable=True)
    
    # Temp file storage
    temp_file_path = Column("temp-file-path", Text)  # Will be deleted after commit
    
    # Timestamps
    scanned_at = Column("scanned-at", DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column("reviewed-at", DateTime(timezone=True), nullable=True)
    committed_at = Column("committed-at", DateTime(timezone=True), nullable=True)
    
    # Relationships
    extracted_items = relationship("InvoiceExtractedItem", back_populates="session", cascade="all, delete-orphan")


class InvoiceExtractedItem(TenantBase):
    """
    Individual line items extracted by AI from invoice.
    Admin can modify dates before committing to inventory.
    """
    __tablename__ = "invoice-extracted-items"
    
    item_id = Column("item-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column("session-id", UUID(as_uuid=True), ForeignKey("invoice-scan-sessions.session-id"))
    
    # AI-extracted data
    product_name = Column("product-name", String(500))
    quantity = Column(Numeric(10, 2))
    unit_cost = Column("unit-cost", Numeric(10, 2))
    line_total = Column("line-total", Numeric(10, 2))
    product_code = Column("product-code", String(100), nullable=True)
    
    # AI-extracted dates (optional)
    extracted_expiry_date = Column("extracted-expiry-date", DateTime(timezone=True), nullable=True)
    extracted_manufacture_date = Column("extracted-manufacture-date", DateTime(timezone=True), nullable=True)
    
    # Admin-modified dates (before commit)
    modified_expiry_date = Column("modified-expiry-date", DateTime(timezone=True), nullable=True)
    modified_health_date = Column("modified-health-date", DateTime(timezone=True), nullable=True)
    
    # Product matching
    matched_global_product_id = Column("matched-global-product-id", UUID(as_uuid=True), nullable=True)
    match_confidence = Column("match-confidence", Numeric(3, 2), nullable=True)  # 0.00 to 1.00
    
    # Flags
    include_in_commit = Column("include-in-commit", Boolean, default=True)
    
    # Relationship
    session = relationship("InvoiceScanSession", back_populates="extracted_items")


class CommittedInvoice(TenantBase):
    """
    HISTORY TABLE - Only invoices that have been reviewed and committed.
    This is what shows in the Invoice History page.
    """
    __tablename__ = "committed-invoices"
    
    committed_invoice_id = Column("committed-invoice-id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Invoice metadata (copied from session on commit)
    supplier_name = Column("supplier-name", String(255))
    invoice_number = Column("invoice-number", String(100))
    invoice_date = Column("invoice-date", DateTime(timezone=True))
    total_amount = Column("total-amount", Numeric(10, 2))
    invoice_hash = Column("invoice-hash", String(64), unique=True)  # Prevent duplicate commits
    
    # Commit metadata
    items_count = Column("items-count", Integer)
    committed_by_user_id = Column("committed-by-user-id", UUID(as_uuid=True))
    committed_at = Column("committed-at", DateTime(timezone=True), server_default=func.now())
    
    # Original session reference (for audit trail)
    original_session_id = Column("original-session-id", UUID(as_uuid=True))
    
    # Committed items snapshot (JSON for history)
    committed_items_json = Column("committed-items-json", JSON)
