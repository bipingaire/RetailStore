# 🐳 VPS Docker Deployment Guide (Hostinger + GoDaddy)

This guide covers deploying the multi-domain RetailStore architecture on a Hostinger VPS using Docker and Caddy for automatic SSL.

## 📋 Prerequisites

1. **Hostinger VPS** running Ubuntu 22.04 or similar.
2. **GoDaddy Domain Access** for `indumart.us`.
3. **Hostinger Domain Access** for `retail.cloud`.
4. **SSH Access** to your VPS.

---

## Step 1: DNS Configuration 🌐

You need to point both domains to your VPS IP Address. Find your VPS IP (e.g., `123.45.67.89`) in Hostinger panel.

### 1. Hostinger DNS (for retailOS.cloud)

Go to Hostinger DNS Zone Editor for `retailOS.cloud`:

| Type | Name | Content/Value | TTL |
|------|------|---------------|-----|
| **A** | @ | `YOUR_VPS_IP` | 300 |
| **CNAME** | www | `retailOS.cloud` | 300 |
| **CNAME** | * | `retailOS.cloud` | 300 |

### 2. GoDaddy DNS (for indumart.us)

Go to GoDaddy DNS Management for `indumart.us`:

| Type | Name | Content/Value | TTL |
|------|------|---------------|-----|
| **A** | @ | `YOUR_VPS_IP` | 600 |
| **CNAME** | www | `indumart.us` | 600 |
| **CNAME** | * | `indumart.us` | 600 |

> **Note:** The wildcard (*) CNAME is critical for subdomains like `highpoint.indumart.us`.

---

## Step 2: Prepare Server 🛠️

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
```

Clone your repository (or copy files):
```bash
git clone https://github.com/bipingaire/RetailStore.git
cd RetailStore
```

---

## Step 3: Configure Environment 📝

Create the production environment file:

```bash
cp .env.example .env.production
nano .env.production
```

**Required Variables for Multi-Domain:**
Fill in these values in `.env.production`:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Domain Configuration
NEXT_PUBLIC_RETAILOS_DOMAIN=retailOS.cloud
NEXT_PUBLIC_INDUMART_DOMAIN=indumart.us
NEXT_PUBLIC_GEOLOCATION_FALLBACK_STORE=highpoint

# App URL (Primary)
NEXT_PUBLIC_APP_URL=https://retailOS.cloud

# OpenAI (Optional)
OPENAI_API_KEY=sk-...
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

---

## Step 4: Run Setup & Deploy 🚀

We have provided a specialized setup script in `deploy/setup.sh`.

1. **Make generic setup script executable:**
   ```bash
   chmod +x deploy/setup.sh
   ```

2. **Run the deployment:**
   ```bash
   cd deploy
   ./setup.sh
   ```

**What this does:**
- Updates system packages.
- Installs Docker & Docker Compose (if missing).
- Builds the Next.js application container.
- Starts Caddy web server.
- Automatically provisions SSL certificates for all domains.

---

## Step 5: Verify Deployment ✅

### 1. Check Containers
```bash
docker compose -f docker-compose.prod.yml ps
```
You should see `retailstore-app` and `retailstore-caddy` running.

### 2. Test Domains

- **Admin/Business:** Visit `https://retailOS.cloud`
  - Should show Business Landing Page.
  
- **Geolocation Redirect:** Visit `https://indumart.us`
  - Should auto-redirect to nearest store (e.g., `https://highpoint.indumart.us`).
  
- **Store Subdomain:** Visit `https://highpoint.indumart.us`
  - Should show the Store E-commerce site.

---

## Troubleshooting 🔧

**Logs:**
View application logs:
```bash
docker compose -f docker-compose.prod.yml logs -f app
```
View web server (Caddy) logs:
```bash
docker compose -f docker-compose.prod.yml logs -f caddy
```

**SSL Issues:**
If SSL fails (red lock), restart Caddy to retry challenges:
```bash
docker compose -f docker-compose.prod.yml restart caddy
```

**Updates:**
To deploy new changes from git:
```bash
git pull origin main
cd deploy
./setup.sh
```
