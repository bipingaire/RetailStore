"""
Expenses router - Business expense tracking
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

from ..database import get_db
from ..models.tenant_models import Expense
from ..dependencies import TenantFilter, get_current_user

router = APIRouter()


# Pydantic schemas
class ExpenseBase(BaseModel):
    expense_date: datetime
    category: str
    amount: float
    description: Optional[str] = None
    payment_method: Optional[str] = None
    receipt_url: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    expense_id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    tenant_filter: TenantFilter = Depends(),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record a new business expense."""
    expense = Expense(
        **expense_data.model_dump(),
        created_by=current_user.id
    )
    
    db.add(expense)
    db.commit()
    db.refresh(expense)
    
    return expense


@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    category: Optional[str] = None,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get list of expenses with optional filtering."""
    query = db.query(Expense)
    
    if start_date:
        query = query.filter(Expense.expense_date >= start_date)
    
    if end_date:
        query = query.filter(Expense.expense_date <= end_date)
        
    if category:
        query = query.filter(Expense.category == category)
        
    expenses = query.order_by(Expense.expense_date.desc()).offset(skip).limit(limit).all()
    
    return expenses


@router.get("/categories", response_model=List[str])
async def get_expense_categories(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get list of unique expense categories used."""
    categories = db.query(Expense.category).distinct().all()
    return [c[0] for c in categories]
