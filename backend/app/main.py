from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import time
from pathlib import Path

from .config import settings
from .database_manager import db_manager
from .models.master_models import MasterBase
from .models.tenant_models import TenantBase
from .routers import (
    auth, products, inventory, orders, customers, vendors, files,
    invoices, sales, analytics, audits, restock, profits, superadmin, shop, reports, campaigns, settings
)

# Create master database tables
MasterBase.metadata.create_all(bind=db_manager.master_engine)

# Ensure uploads directory exists
uploads_dir = Path(settings.upload_dir)
uploads_dir.mkdir(parents=True, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="Retail Store API - Database Per Tenant",
    description="Complete inventory management system with separate database per tenant",
    version="3.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time header to responses."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.debug else "An error occurred"
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "environment": settings.environment,
        "version": "3.0.0",
        "architecture": "database-per-tenant"
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Retail Store Multi-Tenant API",
        "version": "3.0.0",
        "architecture": "separate database per tenant",
        "docs": "/api/docs",
        "features": [
            "Database-per-tenant architecture",
            "JWT Authentication with RBAC",
            "Inventory Management (6 features)",
            "Multi-tenant isolation",
            "SuperAdmin tenant provisioning"
        ]
    }


# Mount routers
# Authentication
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# SuperAdmin
app.include_router(superadmin.router, prefix="/api/superadmin", tags=["👑 SuperAdmin"])

# Shop (Customer-facing)
app.include_router(shop.router, prefix="/api/shop", tags=["🛒 Shop"])

# Core functionality
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["Vendors"])
app.include_router(files.router, prefix="/api/files", tags=["File Storage"])

# Inventory Management Features
app.include_router(invoices.router, prefix="/api/invoices", tags=["📥 Inventory IN"])
app.include_router(sales.router, prefix="/api/sales", tags=["📤 Inventory OUT"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["📊 Health & Campaigns"])
app.include_router(audits.router, prefix="/api/audits", tags=["✅ Shelf Audits"])
app.include_router(restock.router, prefix="/api/restock", tags=["🔄 Restock Automation"])
app.include_router(profits.router, prefix="/api/profits", tags=["💰 Profit Tracking"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["📣 Campaigns"])
app.include_router(settings.router, prefix="/api/settings", tags=["⚙️ Settings"])


# Shutdown event
@app.on_event("shutdown")
def shutdown_event():
    """Close all database connections on shutdown."""
    db_manager.close_all()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
