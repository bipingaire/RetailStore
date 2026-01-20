from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from decimal import Decimal
from datetime import datetime

from ..database import get_db
from ..models import CustomerOrder, OrderLineItem, Customer, DeliveryAddress
from ..dependencies import TenantFilter

router = APIRouter()


# Pydantic schemas
class OrderLineItemCreate(BaseModel):
    global_product_id: uuid.UUID
    quantity: Decimal
    unit_price: Decimal


class OrderLineItemResponse(BaseModel):
    line_id: uuid.UUID
    global_product_id: uuid.UUID
    quantity: Decimal
    unit_price: Decimal
    line_total: Decimal
    
    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_id: Optional[uuid.UUID] = None
    line_items: List[OrderLineItemCreate]
    delivery_address: Optional[dict] = None


class OrderResponse(BaseModel):
    order_id: uuid.UUID
    customer_id: Optional[uuid.UUID]
    order_status: str
    payment_status: str
    total_amount: Decimal
    created_at: datetime
    line_items: List[OrderLineItemResponse] = []
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    List orders for the current tenant.
    
    - **skip**: Pagination offset
    - **limit**: Maximum results
    - **status**: Filter by order status
    """
    query = db.query(CustomerOrder).filter(
        CustomerOrder.tenant_id == tenant_filter.tenant_id
    )
    
    if status:
        query = query.filter(CustomerOrder.order_status == status)
    
    orders = query.order_by(CustomerOrder.created_at.desc()).offset(skip).limit(limit).all()
    
    # Load line items for each order
    result = []
    for order in orders:
        order_dict = {
            "order_id": order.order_id,
            "customer_id": order.customer_id,
            "order_status": order.order_status,
            "payment_status": order.payment_status,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "line_items": order.line_items or []
        }
        result.append(order_dict)
    
    return result


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: uuid.UUID,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Get a specific order by ID."""
    order = db.query(CustomerOrder).filter(
        CustomerOrder.order_id == order_id,
        CustomerOrder.tenant_id == tenant_filter.tenant_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """
    Create a new order.
    
    - **customer_id**: Optional customer ID
    - **line_items**: List of order items
    - **delivery_address**: Optional delivery address
    """
    # Calculate total
    total = sum(item.quantity * item.unit_price for item in order_data.line_items)
    
    # Create order
    new_order = CustomerOrder(
        tenant_id=tenant_filter.tenant_id,
        customer_id=order_data.customer_id,
        order_status="pending",
        payment_status="unpaid",
        total_amount=total
    )
    
    db.add(new_order)
    db.flush()  # Get order ID without committing
    
    # Create line items
    for item_data in order_data.line_items:
        line_total = item_data.quantity * item_data.unit_price
        line_item = OrderLineItem(
            order_id=new_order.order_id,
            global_product_id=item_data.global_product_id,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            line_total=line_total
        )
        db.add(line_item)
    
    # Add delivery address if provided
    if order_data.delivery_address:
        delivery = DeliveryAddress(
            order_id=new_order.order_id,
            customer_id=order_data.customer_id,
            **order_data.delivery_address
        )
        db.add(delivery)
    
    db.commit()
    db.refresh(new_order)
    
    return new_order


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: uuid.UUID,
    order_status: str = Query(..., description="New order status"),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Update order status."""
    order = db.query(CustomerOrder).filter(
        CustomerOrder.order_id == order_id,
        CustomerOrder.tenant_id == tenant_filter.tenant_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.order_status = order_status
    db.commit()
    
    return {"message": "Order status updated", "order_id": order_id, "status": order_status}


@router.put("/{order_id}/payment-status")
async def update_payment_status(
    order_id: uuid.UUID,
    payment_status: str = Query(..., description="New payment status"),
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    """Update payment status."""
    order = db.query(CustomerOrder).filter(
        CustomerOrder.order_id == order_id,
        CustomerOrder.tenant_id == tenant_filter.tenant_id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.payment_status = payment_status
    db.commit()
    
    return {"message": "Payment status updated", "order_id": order_id, "status": payment_status}
