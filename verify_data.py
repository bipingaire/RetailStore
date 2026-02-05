import sys
import os

# Add backend directory to path so we can import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.master_models import GlobalProduct
from app.models.tenant_models import InventoryItem, UploadedInvoice
from app.database_manager import db_manager

def check_data():
    print("Checking database state...")
    
    # 1. Check Master DB for Global Products
    master_db = list(db_manager.get_master_db())[0]
    global_count = master_db.query(GlobalProduct).count()
    print(f"\n[Master DB] Global Products Count: {global_count}")
    
    if global_count < 10:
        products = master_db.query(GlobalProduct).all()
        for p in products:
            print(f" - {p.product_name}")
    
    # 2. Check Tenant DB for Inventory
    # We need to know which tenant. For now, we'll try to get the 'highpoint' tenant if possible, 
    # or just use the first available tenant connection string if we can resolve it.
    # Since we are running outside the request context, we need to manually create a session for the tenant.
    
    # HACK: Hardcoding the tenant DB connection for 'highpoint' based on previous logs:
    # postgresql://retailstore:retailstore_password@db:5432/retailstore_highpoint
    
    try:
        tenant_engine = create_engine("postgresql://retailstore:retailstore_password@localhost:5432/retailstore_highpoint")
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=tenant_engine)
        db = SessionLocal()
        
        inventory_count = db.query(InventoryItem).count()
        print(f"\n[Tenant DB] Inventory Items Count: {inventory_count}")
        
        items = db.query(InventoryItem).all()
        for i in items:
            print(f" - Item ID: {i.inventory_id}, Global ID: {i.global_product_id}, Qty: {i.quantity_on_hand}")
            
        # 3. Check Uploaded Invoices
        invoice_count = db.query(UploadedInvoice).count()
        print(f"\n[Tenant DB] Uploaded Invoices Count: {invoice_count}")
        
        invoices = db.query(UploadedInvoice).order_by(UploadedInvoice.created_at.desc()).limit(1).all()
        if invoices:
            inv = invoices[0]
            print(f"Latest Invoice: {inv.invoice_number} (Status: {inv.processing_status})")
            print(f"Extracted Data: {inv.ai_extracted_data_json}")
            
    except Exception as e:
        print(f"Error connecting to tenant DB: {e}")

if __name__ == "__main__":
    check_data()
