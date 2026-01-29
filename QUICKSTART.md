# 🚀 RetailStore - Quick Reference

## One-Click Deployment

### Linux/Mac Server
```bash
./deploy.sh
```

### Windows Server
```cmd
deploy.bat
```

## What You Get

- ✅ **retailos.cloud** - Admin platform
- ✅ **indumart.us** - Store network  
- ✅ **Automatic HTTPS** - via Caddy
- ✅ **Full stack** - Frontend + Backend + Database

## Before Deploy

1. Configure DNS records (see deploy/README.md)
2. Edit `.env.production`:
   ```bash
   NEXT_PUBLIC_RETAILOS_DOMAIN=retailos.cloud
   NEXT_PUBLIC_INDUMART_DOMAIN=indumart.us
   POSTGRES_PASSWORD=ChangeMeToSecurePassword
   CERTBOT_EMAIL=youremail@example.com
   ```

## After Deploy

Access your application:
- https://retailos.cloud/business
- https://retailos.cloud/super-admin  
- https://indumart.us

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart
docker-compose restart

# Stop
docker-compose down

# Update
git pull && docker-compose up -d --build
```

## Local Development

**Don't use Docker locally!**

```bash
npm run dev                          # Frontend
cd backend && uvicorn app.main:app --reload  # Backend
```

---

**Full Docs**: See `deploy/README.md` and `DEVELOPMENT.md`
