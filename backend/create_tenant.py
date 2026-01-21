"""
Tenant provisioning script.

Creates new tenant with isolated database.
"""

import sys
import argparse
from getpass import getpass

from app.database_manager import db_manager
from app.models.master_models import TenantRegistry, MasterBase
from app.utils.auth import get_password_hash
from app.models.tenant_models import User, StoreInfo, TenantBase


def create_tenant(subdomain: str, store_name: str, admin_email: str, admin_password: str):
    """Create a new tenant with database and admin user."""
    
    print(f"\n🏪 Creating tenant: {subdomain}")
    print(f"   Store: {store_name}")
    print(f"   Admin: {admin_email}")
    
    # Step 1: Create database
    print("\n📊 Step 1: Creating database...")
    database_name = db_manager.create_tenant_database(subdomain)
    print(f"   ✓ Database created: {database_name}")
    
    # Step 2: Initialize schema
    print("\n📋 Step 2: Initializing schema...")
    db_manager.init_tenant_schema(database_name)
    print(f"   ✓ Schema initialized")
    
    # Step 3: Register in master DB
    print("\n📝 Step 3: Registering tenant...")
    master_db = db_manager.get_master_session()
    
    tenant = TenantRegistry(
        subdomain=subdomain,
        store_name=store_name,
        database_name=database_name,
        database_created=True,
        is_active=True
    )
    master_db.add(tenant)
    master_db.commit()
    print(f"   ✓ Tenant registered: {tenant.tenant_id}")
    master_db.close()
    
    # Step 4: Create admin user in tenant DB
    print("\n👤 Step 4: Creating admin user...")
    tenant_db = db_manager.get_tenant_session(database_name)
    
    admin_user = User(
        email=admin_email,
        encrypted_password=get_password_hash(admin_password),
        role="admin",
        is_active=True
    )
    tenant_db.add(admin_user)
    
    # Add store info
    store_info = StoreInfo(
        store_name=store_name,
        subdomain=subdomain
    )
    tenant_db.add(store_info)
    
    tenant_db.commit()
    print(f"   ✓ Admin user created: {admin_user.id}")
    tenant_db.close()
    
    print(f"\n✅ Tenant creation complete!")
    print(f"\n📍 Access Information:")
    print(f"   Subdomain: {subdomain}")
    print(f"   Database: {database_name}")
    print(f"   Admin Email: {admin_email}")
    print(f"\n🔗 Login URL:")
    print(f"   POST http://localhost:8000/api/auth/login")
    print(f"   Headers: X-Subdomain: {subdomain}")
    print(f"   Body: {{ \"username\": \"{admin_email}\", \"password\": \"***\" }}")


def main():
    parser = argparse.ArgumentParser(description='Create a new tenant')
    parser.add_argument('subdomain', help='Tenant subdomain (e.g., store1)')
    parser.add_argument('--name', required=True, help='Store name')
    parser.add_argument('--admin-email', required=True, help='Admin email')
    parser.add_argument('--admin-password', help='Admin password (will prompt if not provided)')
    
    args = parser.parse_args()
    
    # Get password if not provided
    if args.admin_password:
        password = args.admin_password
    else:
        password = getpass("Admin password: ")
        confirm = getpass("Confirm password: ")
        if password != confirm:
            print("❌ Passwords do not match!")
            sys.exit(1)
    
    # Validate subdomain
    if not args.subdomain.isalnum():
        print("❌ Subdomain must be alphanumeric!")
        sys.exit(1)
    
    try:
        # Initialize master schema first
        print("Initializing master database...")
        db_manager.init_master_schema()
        
        create_tenant(
            subdomain=args.subdomain,
            store_name=args.name,
            admin_email=args.admin_email,
            admin_password=password
        )
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
