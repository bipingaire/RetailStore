
import sys
import os
import logging
from sqlalchemy import text

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database_manager import db_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_invoice_table(subdomain="highpoint"):
    """
    Force create the uploaded-invoices table using raw SQL.
    This bypasses SQLAlchemy's caching mechanisms.
    """
    logger.info(f"🔧 Starting Manual Repair for: {subdomain}")
    
    database_name = db_manager.get_database_name(subdomain)
    engine = db_manager.get_tenant_engine(database_name)
    
    with engine.connect() as conn:
        # 1. Check if table exists
        logger.info("🔍 Checking existing tables...")
        result = conn.execute(text(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        ))
        tables = [row[0] for row in result.fetchall()]
        logger.info(f"Found tables: {tables}")
        
        if "uploaded-invoices" in tables:
            logger.info("✅ Table 'uploaded-invoices' ALREADY EXISTS.")
        else:
            logger.warning("❌ Table 'uploaded-invoices' is MISSING. Creating it now...")
            
            # 2. Create Table SQL
            create_sql = """
            CREATE TABLE IF NOT EXISTS "uploaded-invoices" (
                "invoice-id" UUID PRIMARY KEY,
                "file-url-path" TEXT,
                "processing-status" VARCHAR(50),
                "supplier-name" VARCHAR(255),
                "invoice-number" VARCHAR(100),
                "invoice-date" TIMESTAMP WITH TIME ZONE,
                "total-amount-value" NUMERIC(10, 2),
                "ai-extracted-data-json" JSON,
                "created-at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            
            try:
                conn.execute(text(create_sql))
                conn.commit()
                logger.info("✅ Successfully created 'uploaded-invoices' table.")
            except Exception as e:
                logger.error(f"❌ Failed to create table: {e}")
                return

        # 3. Verify
        verify_result = conn.execute(text(
            "SELECT table_name FROM information_schema.tables WHERE table_name = 'uploaded-invoices'"
        ))
        if verify_result.fetchone():
            logger.info("🎉 VERIFICATION PASSED: Table exists and is ready.")
        else:
            logger.error("💀 VERIFICATION FAILED: Table still not found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        fix_invoice_table(sys.argv[1])
    else:
        fix_invoice_table()
