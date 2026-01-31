from app.database_manager import db_manager
from app.models.master_models import User
from app.utils.auth import hash_password
from sqlalchemy.orm import Session
import sys

# SuperAdmin credentials
SUPERADMIN_EMAIL = "superadmin@retailos.cloud"
SUPERADMIN_PASSWORD = "SuperAdmin@2026"

print("Starting SuperAdmin creation script...")

# Get master database session
try:
    engine = db_manager.get_master_engine()
    session = Session(engine)
    print("Database connection established.")
except Exception as e:
    print(f"Error connecting to database: {e}")
    sys.exit(1)

try:
    # Check if superadmin already exists
    existing = session.query(User).filter(User.email == SUPERADMIN_EMAIL).first()
    
    if existing:
        print(f"⚠️  SuperAdmin already exists: {SUPERADMIN_EMAIL}")
    else:
        # Create superadmin user
        superadmin = User(
            email=SUPERADMIN_EMAIL,
            encrypted_password=hash_password(SUPERADMIN_PASSWORD),
            name="Super Administrator",
            role="superadmin",
            is_active=True
        )
        
        session.add(superadmin)
        session.commit()
        
        print("✅ SuperAdmin created successfully!")
        print(f"   Email: {SUPERADMIN_EMAIL}")
        print(f"   Password: {SUPERADMIN_PASSWORD}")
        print("\n⚠️  IMPORTANT: Change this password after first login!")
        
except Exception as e:
    print(f"An error occurred: {e}")
    session.rollback()
finally:
    session.close()
