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
    invoices, sales, analytics, audits, restock, profits, superadmin, shop, reports, campaigns, settings as settings_router, social, tenants, expenses
)

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

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database connections and create tables."""
    try:
        # Initialize master database
        master_engine = db_manager.get_master_engine()
        MasterBase.metadata.create_all(bind=master_engine)
        print("✅ Master database initialized")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise

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

# Register routers
# Core Features
app.include_router(auth.router, prefix="/api/auth", tags=["🔐 Authentication"])
app.include_router(tenants.router, prefix="/api/tenants", tags=["🏢 Tenants"])
app.include_router(products.router, prefix="/api/products", tags=["📦 Products"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["📊 Inventory"])
app.include_router(orders.router, prefix="/api/orders", tags=["🛒 Orders"])
app.include_router(customers.router, prefix="/api/customers", tags=["👥 Customers"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["🏭 Vendors"])
app.include_router(files.router, prefix="/api/files", tags=["📁 Files"])
app.include_router(shop.router, prefix="/api/shop", tags=["🛍️ Shop"])
app.include_router(reports.router, prefix="/api/reports", tags=["📈 Reports"])
app.include_router(social.router, prefix="/api/social", tags=["📱 Social Media"])
app.include_router(superadmin.router, prefix="/api/superadmin", tags=["👑 Super Admin"])

# Inventory Management Features
app.include_router(invoices.router, prefix="/api/invoices", tags=["📥 Inventory IN"])
app.include_router(sales.router, prefix="/api/sales", tags=["📤 Inventory OUT"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["💸 Expenses"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["📊 Health & Campaigns"])
app.include_router(audits.router, prefix="/api/audits", tags=["✅ Shelf Audits"])
app.include_router(restock.router, prefix="/api/restock", tags=["🔄 Restock Automation"])
app.include_router(profits.router, prefix="/api/profits", tags=["💰 Profit Tracking"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["📣 Campaigns"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["⚙️ Settings"])

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
