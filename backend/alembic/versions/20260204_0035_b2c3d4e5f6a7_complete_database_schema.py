"""Complete database schema migration

Revision ID: b2c3d4e5f6a7
Revises: e67bbb8b5363
Create Date: 2026-02-04 00:35:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'e67bbb8b5363'
branch_labels = None
depends_on = None


def upgrade():
    # ==================== MASTER DATABASE TABLES ====================
    
    # Tenant Registry
    op.create_table(
        'tenant-registry',
        sa.Column('tenant-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('subdomain', sa.String(100), unique=True, nullable=False, index=True),
        sa.Column('store-name', sa.String(255), nullable=False),
        sa.Column('database-name', sa.String(100), unique=True, nullable=False),
        sa.Column('latitude', sa.Numeric(10, 8), nullable=True),
        sa.Column('longitude', sa.Numeric(11, 8), nullable=True),
        sa.Column('store-address', sa.Text),
        sa.Column('store-phone', sa.String(50)),
        sa.Column('store-email', sa.String(255)),
        sa.Column('is-active', sa.Boolean, default=True),
        sa.Column('database-created', sa.Boolean, default=False),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated-at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Global Product Master Catalog
    op.create_table(
        'global-product-master-catalog',
        sa.Column('product-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('product-name', sa.String(500), nullable=False, index=True),
        sa.Column('brand-name', sa.String(255), index=True),
        sa.Column('manufacturer-name', sa.String(255)),
        sa.Column('category-name', sa.String(255), index=True),
        sa.Column('subcategory-name', sa.String(255)),
        sa.Column('upc-ean-code', sa.String(50), unique=True, index=True),
        sa.Column('image-url', sa.Text),
        sa.Column('description-text', sa.Text),
        sa.Column('base-unit-name', sa.String(50), default='piece'),
        sa.Column('pack-size', sa.Integer, default=1),
        sa.Column('pack-unit-name', sa.String(50)),
        sa.Column('bulk-pack-product-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('global-product-master-catalog.product-id')),
        sa.Column('is-bulk-pack', sa.Boolean, default=False),
        sa.Column('enriched-by-superadmin', sa.Boolean, default=False),
        sa.Column('last-enriched-at', sa.DateTime(timezone=True)),
        sa.Column('enrichment-source', sa.String(50)),
        sa.Column('metadata-json', sa.JSON),
        sa.Column('status', sa.String(20), default='active', index=True),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated-at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # ==================== TENANT DATABASE TABLES ====================
    
    # Users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('email', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('encrypted_password', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), default='customer'),
        sa.Column('email_confirmed_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('is_active', sa.Boolean, default=True),
    )
    
    # Store Info
    op.create_table(
        'store-info',
        sa.Column('store-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('store-name', sa.String(255)),
        sa.Column('subdomain', sa.String(100)),
        sa.Column('store-address', sa.Text),
        sa.Column('store-phone', sa.String(50)),
        sa.Column('store-email', sa.String(255)),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Inventory Items
    op.create_table(
        'inventory-items',
        sa.Column('inventory-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('global-product-id', postgresql.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column('quantity-on-hand', sa.Numeric(10, 2), default=0),
        sa.Column('reorder-level', sa.Numeric(10, 2)),
        sa.Column('unit-cost', sa.Numeric(10, 2)),
        sa.Column('selling-price', sa.Numeric(10, 2)),
        sa.Column('local-enrichment-json', sa.JSON),
        sa.Column('override-image-url', sa.Text),
        sa.Column('override-description', sa.Text),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated-at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Add computed column for product name from global
    op.execute("""
        ALTER TABLE "inventory-items" 
        ADD COLUMN "product-name-from-global" VARCHAR(500) 
        GENERATED ALWAYS AS (
            (SELECT "product-name" FROM "global-product-master-catalog" WHERE "product-id" = "global-product-id")
        ) STORED
    """)
    
    # Customers
    op.create_table(
        'customers',
        sa.Column('customer-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('full-name', sa.String(255)),
        sa.Column('email', sa.String(255)),
        sa.Column('phone', sa.String(50)),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Customer Orders
    op.create_table(
        'customer-orders',
        sa.Column('order-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('customer-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('customers.customer-id')),
        sa.Column('order-status', sa.String(50), default='pending'),
        sa.Column('payment-status', sa.String(50), default='unpaid'),
        sa.Column('total-amount', sa.Numeric(10, 2)),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated-at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Order Line Items
    op.create_table(
        'order-line-items',
        sa.Column('line-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('order-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('customer-orders.order-id')),
        sa.Column('global-product-id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('quantity', sa.Numeric(10, 2), nullable=False),
        sa.Column('unit-price', sa.Numeric(10, 2)),
        sa.Column('line-total', sa.Numeric(10, 2)),
    )
    
    # Delivery Addresses
    op.create_table(
        'delivery-addresses',
        sa.Column('address-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('order-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('customer-orders.order-id')),
        sa.Column('customer-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('customers.customer-id')),
        sa.Column('full-name', sa.String(255)),
        sa.Column('address-line1', sa.Text),
        sa.Column('address-line2', sa.Text),
        sa.Column('city', sa.String(100)),
        sa.Column('state', sa.String(100)),
        sa.Column('postal-code', sa.String(20)),
        sa.Column('country', sa.String(100)),
        sa.Column('phone', sa.String(50)),
    )
    
    # Vendors
    op.create_table(
        'vendors',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('ein', sa.String(50)),
        sa.Column('address', sa.Text),
        sa.Column('website', sa.String(255)),
        sa.Column('email', sa.String(255)),
        sa.Column('contact-phone', sa.String(50)),
        sa.Column('fax', sa.String(50)),
        sa.Column('poc-name', sa.String(255)),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Uploaded Invoices
    op.create_table(
        'uploaded-invoices',
        sa.Column('invoice-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('file-url-path', sa.Text),
        sa.Column('processing-status', sa.String(50)),
        sa.Column('supplier-name', sa.String(255)),
        sa.Column('invoice-number', sa.String(100)),
        sa.Column('invoice-date', sa.DateTime(timezone=True)),
        sa.Column('total-amount-value', sa.Numeric(10, 2)),
        sa.Column('ai-extracted-data-json', sa.JSON),
        sa.Column('total-pages', sa.Integer, default=0),
        sa.Column('pages-scanned', sa.Integer, default=0),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
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
    
    # Shelf Audit Records
    op.create_table(
        'shelf-audit-records',
        sa.Column('audit-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('audited-by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('audit-date', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('notes', sa.Text),
    )
    
    # Shelf Audit Items
    op.create_table(
        'shelf-audit-items',
        sa.Column('item-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('audit-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('shelf-audit-records.audit-id')),
        sa.Column('global-product-id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('expected-quantity', sa.Numeric(10, 2)),
        sa.Column('actual-quantity', sa.Numeric(10, 2)),
        sa.Column('discrepancy', sa.Numeric(10, 2)),
    )
    
    # POS Item Mappings
    op.create_table(
        'pos-item-mappings',
        sa.Column('mapping-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('pos-item-code', sa.String(100)),
        sa.Column('pos-item-name', sa.String(500)),
        sa.Column('global-product-id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('confidence-score', sa.Numeric(3, 2)),
        sa.Column('is-verified', sa.Boolean, default=False),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Social Media Posts
    op.create_table(
        'social-media-posts',
        sa.Column('post-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('platform', sa.String(50)),
        sa.Column('content', sa.Text),
        sa.Column('media-urls', sa.JSON),
        sa.Column('scheduled-time', sa.DateTime(timezone=True)),
        sa.Column('published-at', sa.DateTime(timezone=True)),
        sa.Column('status', sa.String(50)),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Social Media Accounts
    op.create_table(
        'social-media-accounts',
        sa.Column('account-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('platform', sa.String(50)),
        sa.Column('account-name', sa.String(255)),
        sa.Column('access-token', sa.Text),
        sa.Column('is-active', sa.Boolean, default=True),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Payment Config
    op.create_table(
        'payment-config',
        sa.Column('config-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('stripe-publishable-key', sa.Text),
        sa.Column('stripe-secret-key', sa.Text),
        sa.Column('is-active', sa.Boolean, default=True),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Marketing Campaigns
    op.create_table(
        'marketing-campaign-master',
        sa.Column('campaign-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('title-text', sa.String(255), nullable=False),
        sa.Column('subtitle-text', sa.String(255)),
        sa.Column('badge-label', sa.String(50)),
        sa.Column('badge-color', sa.String(50)),
        sa.Column('tagline-text', sa.String(255)),
        sa.Column('campaign-type', sa.String(50)),
        sa.Column('sort-order', sa.Integer),
        sa.Column('is-active-flag', sa.Boolean, default=False),
        sa.Column('start-date-time', sa.DateTime(timezone=True)),
        sa.Column('end-date-time', sa.DateTime(timezone=True)),
        sa.Column('campaign-slug', sa.String(255)),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # Campaign Products
    op.create_table(
        'campaign-product-segment-group',
        sa.Column('link-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('campaign-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('marketing-campaign-master.campaign-id')),
        sa.Column('inventory-id', postgresql.UUID(as_uuid=True), sa.ForeignKey('inventory-items.inventory-id')),
    )
    
    # Expenses
    op.create_table(
        'expenses',
        sa.Column('expense-id', postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('expense-date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('payment-method', sa.String(50)),
        sa.Column('receipt-url', sa.Text),
        sa.Column('created-by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('created-at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    
    # ==================== INDICES ====================
    
    # Committed invoices indices
    op.create_index('ix_committed_invoices_vendor_id', 'committed-invoices', ['vendor-id'])
    op.create_index('ix_committed_invoices_created_at', 'committed-invoices', ['created-at'])
    op.create_index('ix_committed_invoice_items_invoice_id', 'committed-invoice-items', ['invoice-id'])
    
    # Other useful indices
    op.create_index('ix_inventory_items_global_product', 'inventory-items', ['global-product-id'])
    op.create_index('ix_orders_customer', 'customer-orders', ['customer-id'])
    op.create_index('ix_orders_created', 'customer-orders', ['created-at'])


def downgrade():
    # Drop tables in reverse order (respecting foreign keys)
    op.drop_table('expenses')
    op.drop_table('campaign-product-segment-group')
    op.drop_table('marketing-campaign-master')
    op.drop_table('payment-config')
    op.drop_table('social-media-accounts')
    op.drop_table('social-media-posts')
    op.drop_table('pos-item-mappings')
    op.drop_table('shelf-audit-items')
    op.drop_table('shelf-audit-records')
    op.drop_table('committed-invoice-items')
    op.drop_table('committed-invoices')
    op.drop_table('uploaded-invoices')
    op.drop_table('vendors')
    op.drop_table('delivery-addresses')
    op.drop_table('order-line-items')
    op.drop_table('customer-orders')
    op.drop_table('customers')
    op.drop_table('inventory-items')
    op.drop_table('store-info')
    op.drop_table('users')
    op.drop_table('global-product-master-catalog')
    op.drop_table('tenant-registry')
