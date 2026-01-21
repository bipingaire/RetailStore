"""
Reports router - Sales and Analytics
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ..dependencies import TenantContext
from ..models.tenant_models import CustomerOrder

router = APIRouter()

@router.get("/sales/daily")
async def get_daily_sales(
    days: int = Query(7),
    context: TenantContext = Depends()
):
    """Get daily sales totals for the last N days."""
    since_date = datetime.utcnow() - timedelta(days=days)
    
    results = context.db.query(
        func.date_trunc('day', CustomerOrder.created_at).label('date'),
        func.sum(CustomerOrder.total_amount).label('total')
    ).filter(
        CustomerOrder.created_at >= since_date,
        CustomerOrder.order_status == 'confirmed'
    ).group_by(
        func.date_trunc('day', CustomerOrder.created_at)
    ).order_by('date').all()

    return [
        {
            "date": r.date.strftime("%Y-%m-%d"),
            "total": float(r.total or 0)
        } 
        for r in results
    ]

@router.get("/sales/summary")
async def get_sales_summary(
    context: TenantContext = Depends()
):
    """Get overall sales summary."""
    total_sales = context.db.query(func.sum(CustomerOrder.total_amount)).filter(
        CustomerOrder.order_status == 'confirmed'
    ).scalar() or 0
    
    total_orders = context.db.query(func.count(CustomerOrder.order_id)).filter(
        CustomerOrder.order_status == 'confirmed'
    ).scalar() or 0
    
    return {
        "total_sales": float(total_sales),
        "total_orders": total_orders,
        "average_order_value": float(total_sales / total_orders) if total_orders > 0 else 0
    }
