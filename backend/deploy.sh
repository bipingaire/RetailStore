#!/bin/bash

# Deployment script for Hybrid Database Architecture
# Creates master database and initializes tenant databases

set -e

echo "🚀 Starting Retail Store Backend Deployment"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
MASTER_DB_NAME="retailstore_master"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-password}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo -e "${BLUE}📊 Database Configuration:${NC}"
echo "  Master DB: $MASTER_DB_NAME"
echo "  Host: $DB_HOST:$DB_PORT"
echo "  User: $DB_USER"

# Step 1: Create Master Database
echo -e "\n${BLUE}Step 1: Creating Master Database${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$MASTER_DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $MASTER_DB_NAME"
echo -e "${GREEN}✓ Master database ready${NC}"

# Step 2: Initialize Master Schema
echo -e "\n${BLUE}Step 2: Initializing Master Schema${NC}"
python3 << END
from app.database_manager import db_manager
print("Initializing master schema...")
db_manager.init_master_schema()
print("✓ Master schema initialized")
END
echo -e "${GREEN}✓ Master schema ready${NC}"

# Step 3: Create Example Tenants (Optional)
echo -e "\n${BLUE}Step 3: Create Example Tenants? (y/n)${NC}"
read -p "Create example tenants (demo1, demo2)? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    python3 << END
from app.database_manager import db_manager
from app.models.master_models import TenantRegistry
from sqlalchemy.orm import Session

master_db = db_manager.get_master_session()

# Create demo tenants
for subdomain in ['demo1', 'demo2']:
    # Check if exists
    existing = master_db.query(TenantRegistry).filter(
        TenantRegistry.subdomain == subdomain
    ).first()
    
    if not existing:
        # Create database
        db_name = db_manager.create_tenant_database(subdomain)
        
        # Initialize schema
        db_manager.init_tenant_schema(db_name)
        
        # Register tenant
        tenant = TenantRegistry(
            subdomain=subdomain,
            store_name=f"Demo Store {subdomain[-1].upper()}",
            database_name=db_name,
            database_created=True,
            is_active=True
        )
        master_db.add(tenant)
        print(f"✓ Created tenant: {subdomain} -> {db_name}")
    else:
        print(f"⚠ Tenant already exists: {subdomain}")

master_db.commit()
master_db.close()
END
    echo -e "${GREEN}✓ Example tenants created${NC}"
fi

# Step 4: Install Python Dependencies
echo -e "\n${BLUE}Step 4: Installing Python Dependencies${NC}"
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 5: Start Application
echo -e "\n${BLUE}Step 5: Starting Application${NC}"
echo "Run one of the following commands:"
echo ""
echo "  Development:"
echo "    uvicorn app.main:app --reload"
echo ""
echo "  Production:"
echo "    uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4"
echo ""
echo "  Docker:"
echo "    docker-compose up -d"
echo ""

echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "  1. Update .env file with production settings"
echo "  2. Create superadmin user (manual)"
echo "  3. Start the application"
echo "  4. Access API docs at http://localhost:8000/api/docs"
