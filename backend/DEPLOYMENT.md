# Retail Store Backend - Deployment Guide

## Architecture

**Hybrid Database Model:**
- 🌍 **Master Database** (`retailstore_master`) - Global product catalog (shared)
- 🔒 **Tenant Databases** (`retailstore_*`) - Isolated per store (users, customers, inventory, orders)

---

## Quick Start with Docker

### 1. Start Services

```bash
cd backend
docker-compose up -d
```

This starts:
- Master PostgreSQL database (port 5432)
- FastAPI backend (port 8000)
- Redis cache (port 6379)

### 2. Create First Tenant

```bash
docker-compose exec backend python create_tenant.py demo1 \
  --name "Demo Store" \
  --admin-email admin@demo1.com \
  --admin-password admin123
```

### 3. Access API

- API Docs: http://localhost:8000/api/docs
- Health Check: http://localhost:8000/health

---

## Manual Deployment

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- pip

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

**Required Settings:**
```env
MASTER_DATABASE_URL=postgresql://user:pass@localhost:5432/retailstore_master
DB_USER=postgres
DB_PASSWORD=your-password
SECRET_KEY=your-secret-key
```

### Step 3: Create Master Database

```sql
CREATE DATABASE retailstore_master;
```

### Step 4: Initialize Master Schema

```python
python3 << END
from app.database_manager import db_manager
db_manager.init_master_schema()
END
```

### Step 5: Create Tenant

```bash
python create_tenant.py mystore \
  --name "My Store" \
  --admin-email admin@mystore.com
# Will prompt for password
```

### Step 6: Start Server

**Development:**
```bash
uvicorn app.main:app --reload
```

**Production:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Creating Additional Tenants

### Method 1: CLI Script

```bash
python create_tenant.py store2 \
  --name "Store 2" \
  --admin-email admin@store2.com \
  --admin-password pass123
```

### Method 2: Python

```python
from app.database_manager import db_manager
from app.models.master_models import TenantRegistry
from app.models.tenant_models import User, StoreInfo
from app.utils.auth import get_password_hash

# Create database
db_name = db_manager.create_tenant_database("store2")
db_manager.init_tenant_schema(db_name)

# Register in master
master_db = db_manager.get_master_session()
tenant = TenantRegistry(
    subdomain="store2",
    store_name="Store 2",
    database_name=db_name,
    database_created=True
)
master_db.add(tenant)
master_db.commit()

# Create admin in tenant DB
tenant_db = db_manager.get_tenant_session(db_name)
admin = User(
    email="admin@store2.com",
    encrypted_password=get_password_hash("password"),
    role="admin"
)
tenant_db.add(admin)
tenant_db.commit()
```

---

## Database Management

### Backup Master Database

```bash
pg_dump -U postgres retailstore_master > master_backup.sql
```

### Backup Tenant Database

```bash
pg_dump -U postgres retailstore_store1 > store1_backup.sql
```

### Restore Database

```bash
psql -U postgres retailstore_master < master_backup.sql
psql -U postgres retailstore_store1 < store1_backup.sql
```

### List All Tenant Databases

```sql
SELECT datname FROM pg_database WHERE datname LIKE 'retailstore_%';
```

---

## Production Deployment

### Environment Variables

```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-with-openssl-rand-hex-32>
MASTER_DATABASE_URL=postgresql://user:pass@prod-host:5432/retailstore_master
DB_HOST=prod-host
DB_PASSWORD=<strong-password>
CORS_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

### Using systemd

Create `/etc/systemd/system/retailstore.service`:

```ini
[Unit]
Description=Retail Store API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/retailstore/backend
Environment="PATH=/opt/retailstore/venv/bin"
ExecStart=/opt/retailstore/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable retailstore
sudo systemctl start retailstore
sudo systemctl status retailstore
```

### Using Nginx

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Monitoring

### Health Check

```bash
curl http://localhost:8000/health
```

### Database Connections

```sql
SELECT datname, count(*) 
FROM pg_stat_activity 
WHERE datname LIKE 'retailstore_%' 
GROUP BY datname;
```

### Logs

```bash
# Docker
docker-compose logs -f backend

# systemd
journalctl -u retailstore -f
```

---

## Troubleshooting

### Cannot connect to master database

```bash
# Check if database exists
psql -U postgres -l | grep retailstore_master

# Create if missing
createdb -U postgres retailstore_master
```

### Tenant database not found

```python
from app.database_manager import db_manager
db_manager.create_tenant_database("missing-tenant")
db_manager.init_tenant_schema("retailstore_missing-tenant")
```

### Reset tenant database

```sql
DROP DATABASE retailstore_store1;
CREATE DATABASE retailstore_store1;
```

Then reinitialize schema:
```python
from app.database_manager import db_manager
db_manager.init_tenant_schema("retailstore_store1")
```

---

## Migration from Old System

If migrating from single-database to hybrid:

1. **Export tenant data:**
```sql
COPY (SELECT * FROM users WHERE tenant_id = 'uuid') TO '/tmp/tenant1_users.csv' CSV HEADER;
```

2. **Create new tenant:**
```bash
python create_tenant.py tenant1 --name "Tenant 1" --admin-email admin@tenant1.com
```

3. **Import data:**
```bash
psql -U postgres -d retailstore_tenant1 -c "\COPY users FROM '/tmp/tenant1_users.csv' CSV HEADER"
```

---

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Configure CORS properly
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity
- [ ] Limit database user permissions
- [ ] Enable firewall rules

---

## Support

For issues, check:
1. Logs: `docker-compose logs backend`
2. Database: `psql -U postgres -l`
3. Health: `curl http://localhost:8000/health`
4. API Docs: http://localhost:8000/api/docs
