"""
RBAC dependencies with database-per-tenant routing.
"""

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from .database_manager import get_master_db, db_manager
from .models.master_models import User, TenantUser, SuperadminUser, Tenant
from .models.tenant_models import Customer
from .utils.auth import decode_token

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/admin/login")


# ==================== MASTER DB AUTHENTICATION ====================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    master_db: Session = Depends(get_master_db)
) -> User:
    """Get authenticated user from master database."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = master_db.query(User).filter(User.id == uuid.UUID(user_id)).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Attach role and payload
    user.token_role = payload.get("role", "user")
    user.token_payload = payload
    
    return user


# ==================== TENANT DATABASE ROUTING ====================

async def get_current_tenant_db(
    request: Request,
    user: User = Depends(get_current_user),
    master_db: Session = Depends(get_master_db)
) -> Session:
    """
    Get tenant database session based on user context.
    
    Routes to correct tenant database based on:
    - Token tenant_id (for customers/admins)
    - Subdomain (for superadmins)
    - Query parameter (fallback)
    """
    database_name = None
    
    # 1. Try to get tenant_id from token
    if hasattr(user, 'token_payload'):
        tenant_id_str = user.token_payload.get("tenant_id")
        if tenant_id_str:
            tenant = master_db.query(Tenant).filter(
                Tenant.tenant_id == uuid.UUID(tenant_id_str)
            ).first()
            if tenant:
                database_name = tenant.database_name
    
    # 2. For superadmins, try subdomain from request
    if not database_name and user.token_role == "superadmin":
        host = request.headers.get("host", "")
        if "." in host:
            subdomain = host.split(".")[0]
            tenant = master_db.query(Tenant).filter(Tenant.subdomain == subdomain).first()
            if tenant:
                database_name = tenant.database_name
        
        # Try query parameter
        if not database_name:
            subdomain = request.query_params.get("subdomain")
            if subdomain:
                tenant = master_db.query(Tenant).filter(Tenant.subdomain == subdomain).first()
                if tenant:
                    database_name = tenant.database_name
    
    if not database_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot determine tenant database. Please specify subdomain."
        )
    
    # Get tenant database session
    db = db_manager.get_tenant_session(database_name)
    try:
        yield db
    finally:
        db.close()


# ==================== ROLE-BASED DEPENDENCIES ====================

async def require_customer(
    user: User = Depends(get_current_user),
    tenant_db: Session = Depends(get_current_tenant_db)
) -> Customer:
    """Require customer role."""
    if user.token_role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    
    # Get customer from tenant DB
    customer_id_str = user.token_payload.get("customer_id")
    if not customer_id_str:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer ID not found in token"
        )
    
    customer = tenant_db.query(Customer).filter(
        Customer.customer_id == uuid.UUID(customer_id_str)
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer profile not found"
        )
    
    return customer


async def require_admin(
    user: User = Depends(get_current_user),
    master_db: Session = Depends(get_master_db)
) -> TenantUser:
    """Require admin role."""
    if user.token_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    tenant_user = master_db.query(TenantUser).filter(
        TenantUser.user_id == user.id,
        TenantUser.is_active == True
    ).first()
    
    if not tenant_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin profile not found"
        )
    
    return tenant_user


async def require_superadmin(
    user: User = Depends(get_current_user),
    master_db: Session = Depends(get_master_db)
) -> SuperadminUser:
    """Require superadmin role."""
    if user.token_role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin access required"
        )
    
    superadmin = master_db.query(SuperadminUser).filter(
        SuperadminUser.user_id == user.id,
        SuperadminUser.is_active == True
    ).first()
    
    if not superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin access required"
        )
    
    return superadmin


async def require_admin_or_superadmin(
    user: User = Depends(get_current_user)
):
    """Require either admin or superadmin role."""
    if user.token_role not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Superadmin access required"
        )
    return user


# ==================== TENANT CONTEXT ====================

class TenantContext:
    """
    Provides tenant context including database access.
    
    Usage:
        @router.get("/inventory")
        def get_inventory(context: TenantContext = Depends()):
            items = context.tenant_db.query(InventoryItem).all()
    """
    
    def __init__(
        self,
        request: Request,
        user: User = Depends(get_current_user),
        master_db: Session = Depends(get_master_db),
        tenant_db: Session = Depends(get_current_tenant_db)
    ):
        self.user = user
        self.master_db = master_db
        self.tenant_db = tenant_db
        self.request = request
        self.role = user.token_role if hasattr(user, 'token_role') else "user"
        
        # Get tenant info
        self._tenant = None
        tenant_id_str = user.token_payload.get("tenant_id") if hasattr(user, 'token_payload') else None
        if tenant_id_str:
            self._tenant = master_db.query(Tenant).filter(
                Tenant.tenant_id == uuid.UUID(tenant_id_str)
            ).first()
    
    @property
    def tenant(self) -> Optional[Tenant]:
        """Get current tenant."""
        return self._tenant
    
    @property
    def tenant_id(self) -> Optional[uuid.UUID]:
        """Get current tenant ID."""
        return self._tenant.tenant_id if self._tenant else None
    
    @property
    def is_superadmin(self) -> bool:
        """Check if current user is superadmin."""
        return self.role == "superadmin"
    
    @property
    def is_admin(self) -> bool:
        """Check if current user is admin."""
        return self.role == "admin"
    
    @property
    def is_customer(self) -> bool:
        """Check if current user is customer."""
        return self.role == "customer"


# Backward compatibility alias
TenantFilter = TenantContext
