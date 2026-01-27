"""
Minimal backend startup - imports routers one by one to identify issues
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys

from app.config import settings
from app.database_manager import db_manager
from app.models.master_models import MasterBase

# Create FastAPI app
app = FastAPI(
    title="RetailStore API",
    description="Multi-tenant retail store management system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for container orchestration."""
    return {"status": "healthy", "service": "retailstore-backend"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "RetailStore API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database connections and create tables."""
    try:
        db_manager.init_master_schema()
        print("✅ Master database initialized")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise

# Shutdown event
@app.on_event("shutdown")
def shutdown_event():
    """Close all database connections on shutdown."""
    db_manager.close_all()

# Try importing routers one by one
routers_to_import = [
    ("auth", "/api/auth", "🔐 Authentication"),
    ("tenants", "/api/tenants", "🏢 Tenants"),
    ("products", "/api/products", "📦 Products"),
]

for router_name, prefix, tag in routers_to_import:
    try:
        module = __import__(f"app.routers.{router_name}", fromlist=[router_name])
        app.include_router(module.router, prefix=prefix, tags=[tag])
        print(f"✅ Loaded router: {router_name}")
    except Exception as e:
        print(f"⚠️  Failed to load router {router_name}: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "minimal_app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
