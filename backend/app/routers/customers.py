from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid

from ..database import get_db
from ..models import Customer
from ..dependencies import TenantFilter

router = APIRouter()


# Pydantic schemas
class CustomerCreate(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerResponse(BaseModel):
    customer_id: uuid.UUID
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[CustomerResponse])
async def list_customers(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """List customers for the current tenant."""
    query = db.query(Customer)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Customer.full_name.ilike(search_filter)) |
            (Customer.email.ilike(search_filter)) |
            (Customer.phone.ilike(search_filter))
        )
    
    customers = query.offset(skip).limit(limit).all()
    return customers


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get a specific customer."""
    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return customer


@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CustomerCreate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Create a new customer."""
    new_customer = Customer(
        **customer_data.model_dump()
    )
    
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    
    return new_customer


@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: uuid.UUID,
    customer_data: CustomerUpdate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Update customer information."""
    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    for field, value in customer_data.model_dump(exclude_unset=True).items():
        setattr(customer, field, value)
    
    db.commit()
    db.refresh(customer)
    
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Delete a customer."""
    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    db.delete(customer)
    db.commit()
    
    return None
