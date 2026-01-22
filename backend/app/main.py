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
    invoices, sales, analytics, audits, restock, profits, superadmin, shop, reports, campaigns, settings, social, tenants, expenses
)

# ... (rest of imports)

# ...

# Inventory Management Features
app.include_router(invoices.router, prefix="/api/invoices", tags=["📥 Inventory IN"])
app.include_router(sales.router, prefix="/api/sales", tags=["📤 Inventory OUT"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["💸 Expenses"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["📊 Health & Campaigns"])
app.include_router(audits.router, prefix="/api/audits", tags=["✅ Shelf Audits"])
app.include_router(restock.router, prefix="/api/restock", tags=["🔄 Restock Automation"])
app.include_router(profits.router, prefix="/api/profits", tags=["💰 Profit Tracking"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["📣 Campaigns"])
app.include_router(settings.router, prefix="/api/settings", tags=["⚙️ Settings"])
app.include_router(ai.router, prefix="/api/ai", tags=["🧠 AI Features"])


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
