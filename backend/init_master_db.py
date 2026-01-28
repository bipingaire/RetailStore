"""
Initialize master database schema
"""
from app.database_manager import db_manager
from app.models.master_models import MasterBase

# Initialize master database
engine = db_manager.get_master_engine()
MasterBase.metadata.create_all(bind=engine)
print("✅ Master database schema initialized successfully!")
print("   - TenantRegistry table created")
print("   - GlobalProduct table created")
