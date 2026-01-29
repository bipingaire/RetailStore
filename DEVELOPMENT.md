# Local Development Guide

## Quick Start (No Docker Needed)

### Prerequisites
- Node.js 18+ installed
- Python 3.10+ (for FastAPI backend)

### 1. Frontend (Next.js)

```bash
# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local

# Edit .env.local with your settings
# For local development, you can use query params to test domains

# Run development server
npm run dev
```

The app will run on `http://localhost:3000`

### 2. Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

The API will run on `http://localhost:8000`

## Testing Multi-Domain Locally

Since you don't have real domains locally, use **query parameters** to simulate different domains:

### RetailOS Domain (Admin Platform)

```bash
# Business landing page
http://localhost:3000/business?domain=retailos.cloud

# Super admin login
http://localhost:3000/super-admin?domain=retailos.cloud

# Tenant admin
http://localhost:3000/admin?domain=retailos.cloud
```

### Indumart Domain (Customer Stores)

```bash
# Parent domain (store finder)
http://localhost:3000?domain=indumart.us

# Specific store
http://localhost:3000/shop?domain=indumart.us&subdomain=store1
http://localhost:3000/shop?domain=indumart.us&subdomain=highpoint
```

## Environment Variables (.env.local)

For local development, create `.env.local`:

```bash
# Domains (for display only, use query params)
NEXT_PUBLIC_RETAILOS_DOMAIN=retailos.cloud
NEXT_PUBLIC_INDUMART_DOMAIN=indumart.us

# API (local FastAPI)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Other services...
OPENAI_API_KEY=your_key_here
```

## File Structure

```
RetailStore/
├── app/                    # Next.js pages
│   ├── admin/             # Tenant admin dashboard
│   ├── super-admin/       # Platform admin
│   ├── business/          # Landing page
│   ├── find-store/        # Store locator
│   ├── shop/              # Ecommerce
│   └── api/               # Next.js API routes
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI entry point
│   │   ├── api/          # API endpoints
│   │   └── models/       # Database models
│   └── requirements.txt
├── lib/                   # Utilities
│   ├── domain-utils.ts   # Domain routing logic
│   └── geolocation.ts    # Location services
└── middleware.ts          # Request routing
```

## Common Development Tasks

### Add New Page
```bash
# Create new page in app directory
mkdir app/my-page
# Create page.tsx file
```

### Add API Endpoint (Next.js)
```bash
# Create API route
mkdir -p app/api/my-endpoint
# Create route.ts file
```

### Add Backend API (FastAPI)
```bash
# Edit backend/app/api/
# Add new router file
```

### Test Geolocation
```bash
# Navigate to find-store page
http://localhost:3000/find-store?domain=indumart.us

# Browser will request location permission
# It will find nearby stores and redirect
```

## Debugging

### Frontend Issues
```bash
# Check Next.js logs in terminal
# Check browser console (F12)
# Verify middleware routing in Network tab
```

### Backend Issues
```bash
# Check FastAPI logs in terminal
# Access API docs: http://localhost:8000/docs
# Test endpoints directly with Swagger UI
```

### Middleware Routing
```bash
# The middleware.ts file handles domain routing
# It checks query params in development mode
# Add console.log() to debug routing decisions
```

## Testing Before Production

### 1. Test with /etc/hosts (Optional)

Add to `C:\Windows\System32\drivers\etc\hosts` (Windows) or `/etc/hosts` (Linux/Mac):

```
127.0.0.1 retailos.cloud
127.0.0.1 indumart.us
127.0.0.1 store1.indumart.us
```

Then access: `http://retailos.cloud:3000`

### 2. Build Production Bundle

```bash
# Test production build locally
npm run build
npm start
```

## Production Deployment

**The Docker setup is ONLY for production servers!**

See these files for server deployment:
- `deploy/README.md` - Full deployment guide
- `docker-compose.yml` - Production container orchestration
- `Dockerfile` - Next.js production image
- `backend/Dockerfile` - FastAPI production image

**Do not use Docker for local development** - just run `npm run dev` and the FastAPI server directly.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Next.js)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### FastAPI Not Connecting

```bash
# Verify FastAPI is running
curl http://localhost:8000/health

# Check CORS settings in backend
# Ensure localhost:3000 is allowed
```

### Geolocation Not Working

```bash
# Use HTTPS for geolocation API to work
# Or allow localhost in browser settings
# Chrome: chrome://flags/#unsafely-treat-insecure-origin-as-secure
```

## Next Steps

1. **Local Development**: Use `npm run dev` + FastAPI backend
2. **Test Features**: Use query params to test multi-domain routing
3. **Production Deploy**: Use Docker setup on your server (see `deploy/README.md`)

---

**Local Development**: This guide  
**Production Deployment**: See `deploy/README.md`  
**Architecture Overview**: See `README.md`
