# 🚀 RetailOS - Docker Deployment Guide

## 1. Server Prerequisites
- **OS**: Ubuntu 22.04 LTS (Recommended) or Windows Server
- **Software**: 
  - [Docker](https://docs.docker.com/engine/install/)
  - [Docker Compose](https://docs.docker.com/compose/install/)
  - [Git](https://git-scm.com/downloads)

## 2. DNS Configuration
Point the following domains to your server's IP address (A Record):

| Domain | Purpose | Target |
|--------|---------|--------|
| `retailos.cloud` | Business Landing Page | Server IP |
| `www.retailos.cloud` | Business Landing Page | Server IP |
| `we.retailos.cloud` | Super Admin Dashboard | Server IP |
| `indumart.us` | Nearest Store Redirect | Server IP |
| `www.indumart.us` | Nearest Store Redirect | Server IP |
| `*.indumart.us` | Tenant Stores & Admin | Server IP |

## 3. Installation & Deployment

### Linux / Mac
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd RetailStore
   ```

2. **Run Deployment Script**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Windows (PowerShell)
1. **Clone the repository**:
   ```powershell
   git clone <your-repo-url>
   cd RetailStore
   ```

2. **Run Deployment Script**:
   ```powershell
   .\deploy.ps1
   ```

## 4. Environment Variables
Ensure you have the correct `.env` files or Docker environment variables set up.
By default, `docker-compose.yml` sets:
- `NODE_ENV=production`
- `DATABASE_URL` (pointing to the internal postgres container)

**Important**: 
- For production, update `JWT_SECRET` in `docker-compose.yml` to a secure random string.
- If using external services (Stripe, OpenAI), add them to `docker-compose.yml` under `environment`.

## 5. Verification
- **Business Page**: Visit `http://retailos.cloud` -> Should show Business Landing Page.
- **Super Admin**: Visit `http://we.retailos.cloud/super-admin` -> Should show Login.
- **Tenant Store**: Visit `http://demo.indumart.us/shop` -> Should show Tenant Shop.
- **Tenant Admin**: Visit `http://demo.indumart.us/admin` -> Should show Tenant Admin Login.
- **Nearest Store**: Visit `http://www.indumart.us` -> Should redirect to `/find-store`.

## 6. Maintenance
To update the application with the latest code:
- Run `./deploy.sh` (Linux) or `.\deploy.ps1` (Windows).
- This will pull the latest changes, rebuild containers, and restart them with zero downtime (if using a orchestrator, but minimal downtime with compose).

## 7. Troubleshooting
- **Containers not starting**: Run `docker-compose logs -f` to see errors.
- **Database connection failed**: Ensure `db` container is healthy and `DATABASE_URL` matches the internal docker network address (`postgres://...:@db:5432/...`).
