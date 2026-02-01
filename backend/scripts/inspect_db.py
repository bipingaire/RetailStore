
import sys
import os
import logging
from sqlalchemy import inspect, text

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database_manager import db_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def inspect_database(subdomain="highpoint"):
    """List all tables in the tenant database."""
    logger.info(f"Inspecting database for subdomain: {subdomain}")
    
    database_name = db_manager.get_database_name(subdomain)
    engine = db_manager.get_tenant_engine(database_name)
    
    logger.info(f"Connecting to {database_name}...")
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    logger.info(f"--- Found {len(tables)} tables ---")
    for table in tables:
        logger.info(f"- {table}")
        
    # Check specifically for invoice variants
    invoice_variants = ["uploaded-invoices", "uploaded_invoices", "UploadedInvoice", "uploadedinvoice"]
    found = [t for t in tables if t in invoice_variants]
    
    if found:
        logger.info(f"✅ Found invoice table matches: {found}")
    else:
        logger.warning("❌ No invoice table found!")

    # Try a raw SQL query to be absolutely sure
    with engine.connect() as conn:
        try:
            result = conn.execute(text('SELECT count(*) FROM "uploaded-invoices"'))
            count = result.scalar()
            logger.info(f"✅ Raw SQL Select successful! Count: {count}")
        except Exception as e:
            logger.error(f"❌ Raw SQL Select failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        inspect_database(sys.argv[1])
    else:
        inspect_database()
