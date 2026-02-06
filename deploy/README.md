# One-Click Production Deployment

## 🚀 Quick Start

### Prerequisites
1. **Server** with Docker and Docker Compose installed
2. **DNS** configured (see below)
3. **Ports** 80 and 443 open in firewall

### Deploy in 3 Steps

#### Step 1: Clone & Configure
```bash
git clone <your-repo-url>
cd RetailStore
cp .env.production.example .env.production
nano .env.production  # Edit with your values
```

#### Step 2: One-Click Deploy
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

```cmd
REM Windows
deploy.bat
```

#### Step 3: Access Your Application
- **RetailOS Admin**: https://retailos.cloud
- **Store Finder**: https://indumart.us
- **Store Sites**: https://[subdomain].indumart.us

**That's it!** 🎉 Caddy handles SSL automatically!

---

## 📋 DNS Configuration

Configure these DNS records **before deployment**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | retailos.cloud | YOUR_SERVER_IP | 300 |
| A | www.retailos.cloud | YOUR_SERVER_IP | 300 |
| A | indumart.us | YOUR_SERVER_IP | 300 |
| A | www.indumart.us | YOUR_SERVER_IP | 300 |
| A | *.indumart.us | YOUR_SERVER_IP | 300 |

**Verify DNS:**
```bash
dig retailos.cloud
dig indumart.us
```

---

## 🔧 Configuration (.env.production)

### Required Settings

```bash
# Domains
NEXT_PUBLIC_RETAILOS_DOMAIN=retailos.cloud
NEXT_PUBLIC_INDUMART_DOMAIN=indumart.us

# Database - CHANGE PASSWORD!
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DATABASE_URL=postgresql://retailstore:YOUR_PASSWORD@db:5432/retailstore

# SSL Email (for Let's Encrypt)
CERTBOT_EMAIL=youremail@example.com

# API URL
NEXT_PUBLIC_API_URL=https://retailos.cloud/api
```

### Optional Settings
- Supabase credentials (if using)
- OpenAI API key
- Email service (Resend)
- Social media integrations

---

## 🏗️ What Gets Deployed

The `deploy.sh` script automatically:

1. ✅ Checks prerequisites (Docker, Docker Compose)
2. ✅ Validates DNS configuration
3. ✅ Builds Docker images:
   - Frontend (Next.js)
   - Backend (FastAPI)
   - Database (PostgreSQL)
   - Reverse Proxy (Caddy)
4. ✅ Starts all services
5. ✅ Obtains SSL certificates (automatic via Caddy)
6. ✅ Configures multi-domain routing

---

## 📊 Services Included

### Caddy (Port 80/443)
- Automatic HTTPS with Let's Encrypt
- Multi-domain routing
- Zero manual SSL configuration
- HTTP/3 support

### Next.js Web App
- Frontend application
- Server-side rendering
- API routes

### FastAPI Backend
- REST API
- Database integration
- Business logic

### PostgreSQL Database
- Persistent data storage
- Automatic backups

---

## 🗄️ Database Migrations

### Automatic on Startup

Database migrations run **automatically** when the backend container starts:

1. Waits for PostgreSQL to be ready (up to 60 seconds)
2. Runs `alembic upgrade head` to apply pending migrations
3. Starts the FastAPI application

**No manual migration commands needed!**

### Creating Migrations

```bash
# Enter backend container
docker-compose exec backend bash

# Create new migration
alembic revision --autogenerate -m "add new table"

# Restart backend to apply (or it auto-applies on next deploy)
docker-compose restart backend
```

### Manual Migration Commands

```bash
# View migration status
docker-compose exec backend alembic current

# View history
docker-compose exec backend alembic history

# Rollback one migration
docker-compose exec backend alembic downgrade -1
```

See [backend/MIGRATIONS.md](../backend/MIGRATIONS.md) for complete guide.

---

## 🔍 Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f caddy
docker-compose logs -f web
docker-compose logs -f backend
```

### Check Status
```bash
docker-compose ps
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart web
```

### Stop Everything
```bash
docker-compose down
```

### Update & Redeploy
```bash
git pull
docker-compose up -d --build
```

### Backup Database
```bash
docker-compose exec db pg_dump -U retailstore retailstore > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U retailstore retailstore < backup.sql
```

---

## 🔐 SSL Certificates

### Automatic SSL with Caddy

Caddy automatically:
1. Obtains SSL certificates from Let's Encrypt
2. Renews certificates before expiration
3. Configures HTTPS on all domains

**No manual certificate management needed!**

### Check SSL Status
```bash
# View Caddy logs
docker-compose logs caddy

# Test SSL
curl -I https://retailos.cloud
```

### Certificate Storage
Certificates are stored in Docker volume: `caddy-data`

---

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend

# Restart
docker-compose restart
```

### SSL Certificate Errors
**Issue**: Caddy can't obtain certificate

**Solutions**:
1. Verify DNS is propagated: `dig yourdomain.com`
2. Check ports 80/443 are open: `netstat -tuln | grep :80`
3. Check Caddy logs: `docker-compose logs caddy`
4. Verify email in `.env.production`

### Database Connection Errors
```bash
# Check database is running
docker-compose ps db

# Check connection
docker-compose exec db psql -U retailstore -c "SELECT 1"

# Verify credentials in .env.production
```

### 502 Bad Gateway
```bash
# Check if all services are healthy
docker-compose ps

# Restart services
docker-compose restart

# Check application logs
docker-compose logs web
docker-compose logs backend
```

---

## 🔒 Security Checklist

- [ ] Changed default database password in `.env.production`
- [ ] Generated secure JWT/SESSION secrets
- [ ] Configured firewall (only 80, 443, 22 open)
- [ ] SSL certificates obtained automatically
- [ ] Regular database backups configured
- [ ] Reviewed CORS settings
- [ ] Updated Docker images regularly

---

## 📈 Monitoring

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
df -h
```

### Application Health
```bash
# Health checks
docker-compose ps

# Test endpoints
curl https://retailos.cloud/api/health
```

---

## 🔄 Updates

### Update Application Code
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Update Docker Images
```bash
# Pull latest base images
docker-compose pull

# Rebuild
docker-compose up -d --build
```

---

## 🆘 Support

### Check Logs First
```bash
docker-compose logs -f
```

### Common Log Locations
- Caddy: `docker-compose logs caddy`
- Web: `docker-compose logs web`
- Backend: `docker-compose logs backend`
- Database: `docker-compose logs db`

### Get Help
- Check this documentation
- Review application logs
- Check GitHub issues
- Contact support

---

## 📂 Architecture

```
RetailStore/
├── Caddyfile              # Reverse proxy config (automatic SSL)
├── docker-compose.yml     # Service orchestration
├── deploy.sh              # One-click deployment (Linux/Mac)
├── deploy.bat             # One-click deployment (Windows)
├── Dockerfile             # Next.js production image
├── backend/
│   └── Dockerfile         # FastAPI production image
└── .env.production        # Production configuration
```

---

## ✅ Deployment Checklist

1. [ ] Server prepared with Docker installed
2. [ ] DNS records configured and propagated
3. [ ] Firewall ports 80/443 open
4. [ ] `.env.production` configured with real values
5. [ ] Database password changed from default
6. [ ] Email configured for SSL certificates
7. [ ] Run `./deploy.sh`
8. [ ] Verify all services running: `docker-compose ps`
9. [ ] Test domains in browser
10. [ ] Configure backups

---

**That's all you need!** The entire application will be running with automatic HTTPS. 🚀
