
import sys
import os
import logging

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database_manager import db_manager
from app.models.master_models import TenantRegistry

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_tenants():
    """
    Iterate over all tenants and initialize their schema.
    This ensures new tables (like uploaded-invoices) are created in existing tenant DBs.
    """
    logger.info("Starting tenant migration...")
    
    # Get master session to list tenants
    master_db = db_manager.get_master_session()
    
    try:
        tenants = master_db.query(TenantRegistry).all()
        logger.info(f"Found {len(tenants)} tenants.")
        
        for tenant in tenants:
            logger.info(f"Migrating tenant: {tenant.store_name} (Subdomain: {tenant.subdomain}, DB: {tenant.database_name})")
            
            try:
                # This function uses metadata.create_all() which skips existing tables
                # but creates missing ones (like uploaded-invoices)
                db_manager.init_tenant_schema(tenant.database_name)
                logger.info(f"✅ Successfully migrated {tenant.subdomain}")
            except Exception as e:
                logger.error(f"❌ Failed to migrate {tenant.subdomain}: {e}")
                
    except Exception as e:
        logger.error(f"Critical error listing tenants: {e}")
    finally:
        master_db.close()
        db_manager.close_all()

if __name__ == "__main__":
    migrate_tenants()
