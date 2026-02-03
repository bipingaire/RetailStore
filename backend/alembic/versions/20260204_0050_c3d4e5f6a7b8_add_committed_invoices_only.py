"""Add committed invoice tables only

Revision ID: c3d4e5f6a7b8
Revises: e67bbb8b5363
Create Date: 2026-02-04 00:50:00.000000

This migration only adds the NEW tables (committed invoices).
All other tables already exist in the database.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers, used by Alembic.
revision = 'c3d4e5f6a7b8'
down_revision = 'e67bbb8b5363'
branch_labels = None
depends_on = None


def upgrade():
    # Only create the NEW tables that don't exist yet
    
    # Committed Invoices
    op.create_table(
        'committed-invoices',
        sa.Column('invoice-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('vendor-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id')),
        sa.Column('supplier-name', sa.String(255)),
        sa.Column('invoice-number', sa.String(100)),
        sa.Column('invoice-date', sa.DateTime(timezone=True)),
        sa.Column('total-amount', sa.Numeric(12, 2)),
        sa.Column('total-tax', sa.Numeric(12, 2), default=0),
        sa.Column('total-transport', sa.Numeric(12, 2), default=0),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Committed Invoice Items
    op.create_table(
        'committed-invoice-items',
        sa.Column('item-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('invoice-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('committed-invoices.invoice-id'), nullable=False),
        sa.Column('product-name', sa.String(255)),
        sa.Column('vendor-code', sa.String(100)),
        sa.Column('upc', sa.String(100)),
        sa.Column('quantity', sa.Numeric(10, 2), nullable=False),
        sa.Column('unit-cost', sa.Numeric(10, 2), nullable=False),
        sa.Column('line-total', sa.Numeric(12, 2)),
        sa.Column('expiry-date', sa.DateTime(timezone=True)),
    )
    
    # Create indices
    op.create_index('ix_committed_invoices_vendor_id', 'committed-invoices', ['vendor-id'])
    op.create_index('ix_committed_invoices_created_at', 'committed-invoices', ['created-at'])
    op.create_index('ix_committed_invoice_items_invoice_id', 'committed-invoice-items', ['invoice-id'])


def downgrade():
    # Drop indices
    op.drop_index('ix_committed_invoice_items_invoice_id', table_name='committed-invoice-items')
    op.drop_index('ix_committed_invoices_created_at', table_name='committed-invoices')
    op.drop_index('ix_committed_invoices_vendor_id', table_name='committed-invoices')
    
    # Drop tables
    op.drop_table('committed-invoice-items')
    op.drop_table('committed-invoices')
