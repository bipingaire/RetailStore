"""
Shop router - Customer-facing product listing and checkout.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
import uuid

from ..dependencies import TenantContext, get_master_db, require_customer
from ..models.tenant_models import InventoryItem, CustomerOrder, OrderLineItem, Customer
from ..models.master_models import GlobalProduct

router = APIRouter()


# Pydantic schemas
class ShopProductResponse(BaseModel):
    inventory_id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    brand_name: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    price: Decimal
    stock: Decimal
    in_stock: bool


class CategoryResponse(BaseModel):
    name: str
    count: int


class CheckoutItem(BaseModel):
    inventory_id: uuid.UUID
    quantity: int


class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]
    delivery_address: Optional[dict] = None
    payment_method: Optional[str] = "cash"


@router.get("/products", response_model=List[ShopProductResponse])
async def list_shop_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    in_stock_only: bool = Query(True),
    context: TenantContext = Depends()
):
    """
    Get products available in this store's inventory.
    
    Customer-facing product listing.
    """
    # Query tenant inventory
    query = context.db.query(InventoryItem)
    
    if in_stock_only:
        query = query.filter(InventoryItem.quantity_on_hand > 0)
    
    inventory_items = query.all()
    
    # Get product IDs
    product_ids = [item.global_product_id for item in inventory_items]
    
    # Fetch product details from master DB
    products_query = context.master_db.query(GlobalProduct).filter(
        GlobalProduct.product_id.in_(product_ids)
    )
    
    if search:
        products_query = products_query.filter(
            GlobalProduct.product_name.ilike(f"%{search}%") |
            GlobalProduct.brand_name.ilike(f"%{search}%")
        )
    
    if category:
        products_query = products_query.filter(
            GlobalProduct.category_name == category
        )
    
    products = {p.product_id: p for p in products_query.all()}
    
    # Combine inventory + product data
    result = []
    for item in inventory_items:
        product = products.get(item.global_product_id)
        if product:
            result.append({
                "inventory_id": item.inventory_id,
                "product_id": product.product_id,
                "product_name": product.product_name,
                "brand_name": product.brand_name,
                "category": product.category_name,
                "image_url": item.override_image_url or product.image_url,
                "price": item.selling_price or 0,
                "stock": item.quantity_on_hand,
                "in_stock": item.quantity_on_hand > 0,
            })
    
    return result


@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(
    context: TenantContext = Depends()
):
    """Get available product categories in this store."""
    # Get inventory items
    inventory_items = context.db.query(InventoryItem).filter(
        InventoryItem.quantity_on_hand > 0
    ).all()
    
    product_ids = [item.global_product_id for item in inventory_items]
    
    # Get categories from products
    products = context.master_db.query(GlobalProduct).filter(
        GlobalProduct.product_id.in_(product_ids)
    ).all()
    
    # Count by category
    categories = {}
    for product in products:
        cat = product.category_name or "Uncategorized"
        categories[cat] = categories.get(cat, 0) + 1
    
    return [
        {"name": cat, "count": count}
        for cat, count in sorted(categories.items())
    ]


@router.post("/checkout")
async def checkout(
    checkout_data: CheckoutRequest,
    context: TenantContext = Depends()
):
    """
    Process checkout and create order.
    
    Validates inventory, creates order, and deducts stock.
    """
    if not checkout_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )
    
    # Get customer
    customer = context.db.query(Customer).filter(
        Customer.user_id == context.user.id
    ).first()
    
    if not customer:
        # Create customer if doesn't exist
        customer = Customer(
            user_id=context.user.id,
            email=context.user.email
        )
        context.db.add(customer)
        context.db.flush()
    
    # Validate inventory and calculate total
    total_amount = Decimal(0)
    order_items = []
    
    for item in checkout_data.items:
        inventory_item = context.db.query(InventoryItem).filter(
            InventoryItem.inventory_id == item.inventory_id
        ).first()
        
        if not inventory_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product not found: {item.inventory_id}"
            )
        
        if inventory_item.quantity_on_hand < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {inventory_item.global_product_id}"
            )
        
        line_total = inventory_item.selling_price * item.quantity
        total_amount += line_total
        
        order_items.append({
            "inventory_item": inventory_item,
            "quantity": item.quantity,
            "unit_price": inventory_item.selling_price,
            "line_total": line_total,
        })
    
    # Create order
    order = CustomerOrder(
        customer_id=customer.customer_id,
        order_status="confirmed",
        payment_status="pending",
        total_amount=total_amount,
    )
    context.db.add(order)
    context.db.flush()
    
    # Create line items and deduct inventory
    for item_data in order_items:
        line_item = OrderLineItem(
            order_id=order.order_id,
            global_product_id=item_data["inventory_item"].global_product_id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            line_total=item_data["line_total"],
        )
        context.db.add(line_item)
        
        # Deduct inventory
        item_data["inventory_item"].quantity_on_hand -= item_data["quantity"]
    
    context.db.commit()
    context.db.refresh(order)
    
    return {
        "success": True,
        "order_id": str(order.order_id),
        "total_amount": float(total_amount),
        "order_status": order.order_status,
    }
