# RetailStore - Multi-Domain E-commerce Platform

Production-ready multi-tenant retail platform with automatic HTTPS and one-click deployment.

## 🚀 One-Click Deployment

```bash
# 1. Configure
cp .env.production.example .env.production
nano .env.production

# 2. Deploy
./deploy.sh
```

**That's it!** Automatic SSL via Caddy, no manual configuration needed.

## 🌐 Domains

- **retailos.cloud** - Admin platform & business landing
  - `/business` - Marketing page
  - `/super-admin` - Platform management
  - `/admin` - Tenant dashboards

- **indumart.us** - Customer stores
  - `/` - Geolocation store finder
  - `[subdomain].indumart.us/shop` - Individual stores

## 💻 Local Development

No Docker needed for development:

```bash
# Frontend
npm install
npm run dev  # http://localhost:3000

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000
```

Test domains with query params: `?domain=retailos.cloud&subdomain=store1`

See [DEVELOPMENT.md](./DEVELOPMENT.md) for details.

## 📦 Production Stack

- **Caddy** - Automatic HTTPS reverse proxy
- **Next.js** - Frontend application
- **FastAPI** - Python backend API
- **PostgreSQL** - Database
- **Docker** - Containerization

## 📖 Documentation

- **Quick Deploy**: [deploy/README.md](./deploy/README.md)
- **Local Dev**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Architecture**: See this file

## 🔧 Management

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Update & redeploy
git pull && docker-compose up -d --build
```

## 📋 Prerequisites (Production)

1. Linux server with Docker & Docker Compose
2. DNS configured (A records + wildcard)
3. Ports 80 & 443 open

## 🔐 Security

- ✅ Automatic SSL with Let's Encrypt
- ✅ Security headers configured
- ✅ Tenant data isolation
- ✅ Database password protection
- ✅ CORS configured

## 📊 Features

- Multi-tenant architecture
- Geolocation-based store routing
- Automatic SSL certificate management
- One-click deployment
- Zero-downtime updates
- Database backups
- Health monitoring

## 🆘 Support

- **Issues**: Check `docker-compose logs`
- **Docs**: See deploy/README.md
- **Local Dev**: See DEVELOPMENT.md

---

**Local Dev**: Just `npm run dev` + FastAPI  
**Production**: Run `./deploy.sh` for everything 🚀
