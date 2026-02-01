"""
Sales/POS router - Handle Z-reports and POS sales data (Inventory OUT)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict
import uuid
from decimal import Decimal

from ..database import get_db
from ..dependencies import TenantFilter
from ..services.inventory_service import InventoryService

router = APIRouter()


# Pydantic schemas
class SaleItem(BaseModel):
    product_id: uuid.UUID
    quantity: float
    price: float


class ZReportData(BaseModel):
    report_date: str
    items: List[SaleItem]
    total_sales: float
    transaction_count: int


class SalesResponse(BaseModel):
    items_deducted: int
    total_revenue: float
    timestamp: str


@router.post("/z-report", response_model=SalesResponse)
async def process_z_report(
    report_data: ZReportData,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Process Z-Report (end-of-day sales report).
    
    **Inventory OUT** - Automatically deducts sold items from inventory.
    
    - **report_date**: Date of sales
    - **items**: List of sold items
    - **total_sales**: Total revenue
    - **transaction_count**: Number of transactions
    """
    # Convert to format expected by service
    sales_data = [
        {
            "product_id": str(item.product_id),
            "quantity": item.quantity,
            "price": item.price
        }
        for item in report_data.items
    ]
    
    result = InventoryService.process_sales(
        db=db,
        sales_data=sales_data
    )
    
    return result


@router.post("/pos-sync", response_model=SalesResponse)
async def sync_pos_sales(
    sales_items: List[SaleItem],
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Sync sales from POS system.
    
    **Inventory OUT** - Real-time deduction from inventory.
    
    This endpoint can be called by your POS system to immediately
    update inventory when items are sold.
    """
    sales_data = [
        {
            "product_id": str(item.product_id),
            "quantity": item.quantity,
            "price": item.price
        }
        for item in sales_items
    ]
    
    result = InventoryService.process_sales(
        db=db,
        sales_data=sales_data
    )
    
    return result


@router.get("/daily-summary")
async def get_daily_sales_summary(
    date: str,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get daily sales summary.
    
    - **date**: Date in YYYY-MM-DD format
    """
    from datetime import datetime
    from ..models import CustomerOrder
    
    target_date = datetime.fromisoformat(date).date()
    
    orders = db.query(CustomerOrder).filter(
        CustomerOrder.created_at >= target_date,
        CustomerOrder.created_at < target_date.replace(day=target_date.day + 1)
    ).all()
    
    total_revenue = sum(order.total_amount or 0 for order in orders)
    
    return {
        "date": date,
        "total_orders": len(orders),
        "total_revenue": float(total_revenue),
        "orders": [
            {
                "order_id": str(order.order_id),
                "amount": float(order.total_amount or 0),
                "status": order.payment_status
            }
            for order in orders
        ]
    }
