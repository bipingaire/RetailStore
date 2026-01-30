# Port Configuration

## Service Ports

The application uses custom ports to avoid conflicts with other services:

### External Access (from your computer/browser)
- **Frontend**: http://your-server-ip:3010 (HTTP) or https://your-server-ip:3443 (HTTPS)
- **Backend API**: http://your-server-ip:8010

### Internal Docker Network
- Frontend (Next.js): port 3000 (internal)
- Backend (FastAPI): port 8000 (internal)
- PostgreSQL: port 5432 (internal)
- Caddy: port 80 & 443 (internal)

## Port Mapping

```
3010 (external) -> 80 (caddy) -> 3000 (frontend)
3443 (external) -> 443 (caddy) -> 3000 (frontend)
8010 (external) -> 8000 (backend)
```

## Accessing Your Application

After deployment, access your application at:
- `http://your-server-ip:3010` (HTTP)
- `https://your-server-ip:3443` (HTTPS)
- API: `http://your-server-ip:8010`

**Note**: SSL certificates will work on ports 3443 when using Caddy's automatic HTTPS with proper domain configuration.

## For Production Domains

If you want to use your domains (retailos.cloud, indumart.us) on standard ports (80/443):

1. Set up a reverse proxy (nginx/apache) on the host
2. Forward ports 80/443 to 3010/3443
3. Or reconfigure docker-compose.yml to use ports 80/443 (requires stopping conflicting services)

## Firewall Configuration

Make sure these ports are open in your firewall:
```bash
sudo ufw allow 3010/tcp
sudo ufw allow 3443/tcp
sudo ufw allow 8010/tcp
```
