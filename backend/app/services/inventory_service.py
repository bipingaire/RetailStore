"""
Inventory management service - Business logic for inventory operations
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from ..models import (
    InventoryItem, GlobalProduct, UploadedInvoice, 
    CustomerOrder, OrderLineItem, ShelfAuditRecord, ShelfAuditItem
)


class InventoryService:
    """Business logic for inventory management."""
    
    @staticmethod
    def process_invoice(
        db: Session,
        master_db: Session,
        invoice_data: Dict,
        supplier_name: str
    ) -> Dict:
        """
        Process scanned invoice and update inventory.
        
        Args:
            db: Tenant Database session
            master_db: Master Database session (for global products)
            invoice_data: Parsed invoice data from OCR
            supplier_name: Vendor name
            
        Returns:
            Summary of inventory updates
        """
        items_updated = 0
        items_created = 0
        
        for item in invoice_data.get('items', []):
            product_name = item.get('product_name')
            quantity = Decimal(item.get('quantity', 0))
            unit_cost = Decimal(item.get('unit_cost', 0))
            total_price = Decimal(item.get('total_price', 0))
            category_name = item.get('category') or item.get('category_name') or "Uncategorized"
            
            # Smart Cost Calculation (AI Fallback)
            if quantity > 0:
                if unit_cost == 0 and total_price > 0:
                    unit_cost = total_price / quantity
                    print(f"DEBUG INVENTORY: Calculated missing unit_cost from total ({total_price}/{quantity} = {unit_cost})")
                elif total_price == 0 and unit_cost > 0:
                    total_price = unit_cost * quantity

            
            # Try to find existing product in MASTER DB
            print(f"DEBUG INVENTORY: Searching Master DB for logic: '{product_name}'")
            product = master_db.query(GlobalProduct).filter(
                GlobalProduct.product_name.ilike(f"%{product_name}%")
            ).first()
            
            if not product:
                # Create NEW Global Product if not found
                # This ensures we capture new items from invoices
                print(f"DEBUG INVENTORY: Product '{product_name}' NOT FOUND in Master DB. Creating it now with Category: {category_name}")
                new_global_product = GlobalProduct(
                    product_name=product_name,
                    category_name=category_name, # Use AI Category
                    description_text=f"Imported from invoice from {supplier_name}",
                    status="active"
                )
                master_db.add(new_global_product)
                master_db.flush() # flush to get product_id
                product = new_global_product
                print(f"DEBUG INVENTORY: Created new GlobalProduct ID={product.product_id} Name='{product.product_name}'")
            else:
                print(f"DEBUG INVENTORY: Found match! ID={product.product_id} Name='{product.product_name}'")

            # Now product exists (either found or created)
            # Find or create inventory item
            inventory = db.query(InventoryItem).filter(
                InventoryItem.global_product_id == product.product_id
            ).first()
            
            if inventory:
                print(f"DEBUG INVENTORY: Updating existing Tenant Inventory Item {inventory.inventory_id}")
                # Update existing
                inventory.quantity_on_hand += quantity
                # Update cost with moving average or just latest? Using latest for now
                inventory.unit_cost = unit_cost
                items_updated += 1
            else:
                print(f"DEBUG INVENTORY: Creating NEW Tenant Inventory Item for Product ID {product.product_id}")
                # Create new inventory item
                inventory = InventoryItem(
                    global_product_id=product.product_id,
                    quantity_on_hand=quantity,
                    unit_cost=unit_cost
                )
                db.add(inventory)
                items_created += 1
        
        db.commit()
        
        return {
            "items_updated": items_updated,
            "items_created": items_created,
            "supplier": supplier_name,
            "total_items": items_updated + items_created
        }
    
    @staticmethod
    def process_sales(
        db: Session,
        sales_data: List[Dict]
    ) -> Dict:
        """
        Process sales data (Z-report/POS) and deduct from inventory.
        
        Args:
            db: Database session
            sales_data: List of sold items
            
        Returns:
            Summary of inventory updates
        """
        items_deducted = 0
        total_revenue = Decimal(0)
        
        for sale in sales_data:
            product_id = sale.get('product_id')
            quantity_sold = Decimal(sale.get('quantity', 0))
            sale_price = Decimal(sale.get('price', 0))
            
            # Find inventory item
            inventory = db.query(InventoryItem).filter(
                InventoryItem.global_product_id == product_id
            ).first()
            
            if inventory and inventory.quantity_on_hand >= quantity_sold:
                inventory.quantity_on_hand -= quantity_sold
                items_deducted += 1
                total_revenue += (quantity_sold * sale_price)
        
        db.commit()
        
        return {
            "items_deducted": items_deducted,
            "total_revenue": float(total_revenue),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def analyze_health(
        db: Session,
        tenant_id: uuid.UUID
    ) -> Dict:
        """
        Analyze inventory health and identify issues.
        
        Returns:
            Health metrics and recommendations
        """
        # Get all inventory for this tenant
        # Note: No need to filter by tenant_id as we are already in the tenant's isolated DB
        inventory_items = db.query(InventoryItem).all()
        
        low_stock = []
        overstocked = []
        zero_stock = []
        
        for item in inventory_items:
            qty = float(item.quantity_on_hand)
            reorder = float(item.reorder_level) if item.reorder_level else 10
            
            if qty == 0:
                zero_stock.append({
                    "inventory_id": str(item.inventory_id),
                    "product_id": str(item.global_product_id),
                    "quantity": qty
                })
            elif qty < reorder:
                low_stock.append({
                    "inventory_id": str(item.inventory_id),
                    "product_id": str(item.global_product_id),
                    "quantity": qty,
                    "reorder_level": reorder
                })
            elif qty > (reorder * 5):  # More than 5x reorder level
                overstocked.append({
                    "inventory_id": str(item.inventory_id),
                    "product_id": str(item.global_product_id),
                    "quantity": qty,
                    "reorder_level": reorder
                })
        
        return {
            "total_items": len(inventory_items),
            "low_stock_count": len(low_stock),
            "overstocked_count": len(overstocked),
            "out_of_stock_count": len(zero_stock),
            "low_stock": low_stock[:10],  # Top 10
            "overstocked": overstocked[:10],
            "out_of_stock": zero_stock[:10],
            "health_score": max(0, 100 - (len(low_stock) + len(zero_stock)) * 2)
        }

    
    @staticmethod
    def calculate_profits(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict:
        """
        Calculate profits for a given period.
        
        Returns:
            Profit metrics including expenses.
        """
        from ..models.tenant_models import Expense  # Import here to avoid circular dependency
        
        # Default to last 30 days
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        
        # Get orders in period
        orders = db.query(CustomerOrder).filter(
            CustomerOrder.created_at >= start_date,
            CustomerOrder.created_at <= end_date,
            CustomerOrder.payment_status == 'paid'
        ).all()
        
        total_revenue = Decimal(0)
        total_cost = Decimal(0)
        
        for order in orders:
            total_revenue += order.total_amount or 0
            
            # Calculate cost of goods sold
            for line_item in order.line_items:
                # Get inventory item to find cost
                inventory = db.query(InventoryItem).filter(
                    InventoryItem.global_product_id == line_item.global_product_id
                ).first()
                
                if inventory and inventory.unit_cost:
                    total_cost += (line_item.quantity * inventory.unit_cost)
        
        # Calculate Expenses
        expenses = db.query(Expense).filter(
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date
        ).all()
        
        total_expenses = sum(e.amount for e in expenses) if expenses else Decimal(0)
        
        gross_profit = total_revenue - total_cost
        net_profit = gross_profit - total_expenses
        
        gross_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0
        net_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return {
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "revenue": float(total_revenue),
            "cost_of_goods_sold": float(total_cost),
            "gross_profit": float(gross_profit),
            "total_expenses": float(total_expenses),
            "net_profit": float(net_profit),
            "gross_margin_percent": float(gross_margin),
            "net_margin_percent": float(net_margin),
            "order_count": len(orders),
            "expense_count": len(expenses)
        }
    
    @staticmethod
    def process_shelf_audit(
        db: Session,
        audit_id: uuid.UUID,
        auto_adjust: bool = True
    ) -> Dict:
        """
        Process shelf audit and calculate discrepancies.
        
        Args:
            db: Database session
            audit_id: Audit record ID
            auto_adjust: Whether to auto-adjust inventory
            
        Returns:
            Audit summary
        """
        audit = db.query(ShelfAuditRecord).filter(
            ShelfAuditRecord.audit_id == audit_id
        ).first()
        
        if not audit:
            return {"error": "Audit not found"}
        
        total_discrepancy = Decimal(0)
        items_adjusted = 0
        
        for item in audit.items:
            discrepancy = item.actual_quantity - item.expected_quantity
            item.discrepancy = discrepancy
            total_discrepancy += abs(discrepancy)
            
            if auto_adjust and discrepancy != 0:
                # Update inventory
                inventory = db.query(InventoryItem).filter(
                    InventoryItem.global_product_id == item.global_product_id
                ).first()
                
                if inventory:
                    inventory.quantity_on_hand = item.actual_quantity
                    items_adjusted += 1
        
        db.commit()
        
        return {
            "audit_id": str(audit_id),
            "total_items": len(audit.items),
            "items_adjusted": items_adjusted,
            "total_discrepancy": float(total_discrepancy),
            "auto_adjusted": auto_adjust
        }
