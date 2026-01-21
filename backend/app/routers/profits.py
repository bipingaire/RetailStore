"""
Profits router - Bottom line tracking and financial reports
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..dependencies import TenantFilter
from ..services.inventory_service import InventoryService

router = APIRouter()


# Pydantic schemas
class ProfitReport(BaseModel):
    period_start: str
    period_end: str
    revenue: float
    cost_of_goods_sold: float
    gross_profit: float
    total_expenses: float
    net_profit: float
    gross_margin_percent: float
    net_margin_percent: float
    order_count: int
    expense_count: int


@router.get("/summary", response_model=ProfitReport)
async def get_profit_summary(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get profit summary for specified period.
    
    **Bottom Line** - Track store profitability.
    Calculates Revenue - COGS - Expenses = Net Profit.
    """
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    result = InventoryService.calculate_profits(
        db=db,
        tenant_id=tenant_filter.tenant_id,
        start_date=start_date,
        end_date=end_date
    )
    
    return ProfitReport(
        period_start=result['period']['start'],
        period_end=result['period']['end'],
        revenue=result['revenue'],
        cost_of_goods_sold=result['cost_of_goods_sold'],
        gross_profit=result['gross_profit'],
        total_expenses=result['total_expenses'],
        net_profit=result['net_profit'],
        gross_margin_percent=result['gross_margin_percent'],
        net_margin_percent=result['net_margin_percent'],
        order_count=result['order_count'],
        expense_count=result['expense_count']
    )


@router.get("/daily")
async def get_daily_profits(
    days_back: int = Query(7, ge=1, le=90),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get daily profit breakdown.
    
    - **days_back**: Number of days to show (default: 7)
    """
    daily_data = []
    
    for i in range(days_back):
        date = datetime.utcnow().date() - timedelta(days=i)
        start = datetime.combine(date, datetime.min.time())
        end = datetime.combine(date, datetime.max.time())
        
        result = InventoryService.calculate_profits(
            db=db,
            tenant_id=tenant_filter.tenant_id,
            start_date=start,
            end_date=end
        )
        
        daily_data.append({
            "date": date.isoformat(),
            "revenue": result['revenue'],
            "profit": result['gross_profit'],
            "orders": result['order_count']
        })
    
    return {
        "period": f"Last {days_back} days",
        "daily_breakdown": daily_data[::-1]  # Reverse to show oldest first
    }


@router.get("/trends")
async def get_profit_trends(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get profit trends and comparisons.
    
    Compares:
    - Last 7 days vs previous 7 days
    - Last 30 days vs previous 30 days
    """
    now = datetime.utcnow()
    
    # Last 7 days
    week_end = now
    week_start = now - timedelta(days=7)
    prev_week_end = week_start
    prev_week_start = week_start - timedelta(days=7)
    
    this_week = InventoryService.calculate_profits(
        db, tenant_filter.tenant_id, week_start, week_end
    )
    last_week = InventoryService.calculate_profits(
        db, tenant_filter.tenant_id, prev_week_start, prev_week_end
    )
    
    # Last 30 days
    month_end = now
    month_start = now - timedelta(days=30)
    prev_month_end = month_start
    prev_month_start = month_start - timedelta(days=30)
    
    this_month = InventoryService.calculate_profits(
        db, tenant_filter.tenant_id, month_start, month_end
    )
    last_month = InventoryService.calculate_profits(
        db, tenant_filter.tenant_id, prev_month_start, prev_month_end
    )
    
    # Calculate changes
    week_change = ((this_week['gross_profit'] - last_week['gross_profit']) / last_week['gross_profit'] * 100) if last_week['gross_profit'] > 0 else 0
    month_change = ((this_month['gross_profit'] - last_month['gross_profit']) / last_month['gross_profit'] * 100) if last_month['gross_profit'] > 0 else 0
    
    return {
        "weekly_comparison": {
            "this_week_profit": this_week['gross_profit'],
            "last_week_profit": last_week['gross_profit'],
            "change_percent": week_change,
            "trend": "up" if week_change > 0 else "down"
        },
        "monthly_comparison": {
            "this_month_profit": this_month['gross_profit'],
            "last_month_profit": last_month['gross_profit'],
            "change_percent": month_change,
            "trend": "up" if month_change > 0 else "down"
        }
    }


@router.get("/top-performers")
async def get_top_performers(
    limit: int = Query(10, ge=1, le=50),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Get top performing products by profit.
    
    - **limit**: Number of top products to show
    """
    from ..models import OrderLineItem, InventoryItem, GlobalProduct
    from sqlalchemy import func, desc
    
    # Get order line items with product details
    top_products = db.query(
        GlobalProduct.product_name,
        func.sum(OrderLineItem.quantity).label('total_sold'),
        func.sum(OrderLineItem.line_total).label('total_revenue')
    ).join(
        OrderLineItem, OrderLineItem.global_product_id == GlobalProduct.product_id
    ).join(
        InventoryItem, InventoryItem.global_product_id == GlobalProduct.product_id
    ).filter(
        InventoryItem.tenant_id == tenant_filter.tenant_id
    ).group_by(
        GlobalProduct.product_id,
        GlobalProduct.product_name
    ).order_by(
        desc('total_revenue')
    ).limit(limit).all()
    
    return {
        "top_products": [
            {
                "product_name": p.product_name,
                "units_sold": float(p.total_sold or 0),
                "revenue": float(p.total_revenue or 0)
            }
            for p in top_products
        ]
    }
