"""
Dependencies for fully isolated tenant authentication and data access.

Each tenant database has own users, customers, inventory, etc.
Authentication happens against specific tenant's database.
"""

from fastapi import Depends, HTTPException, status, Header, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import uuid

from .database_manager import db_manager
from .models import User
from .utils.auth import decode_token

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_subdomain(
    request: Request,
    x_subdomain: str | None = Header(default=None)
) -> str:
    """
    Extract subdomain from request.
    
    Can come from:
    1. X-Subdomain header (preferred)
    2. Host header (mystore.example.com -> mystore)
    3. Query parameter ?subdomain=mystore
    """
    # Debug logging for subdomain resolution (REMOVED)
    # print(f"DEBUG: get_subdomain called. URL: {request.url}")
    
    # Try header first
    if x_subdomain:
        return x_subdomain
    
    # Try host parsing
    host = request.headers.get("host", "")
    if "." in host and not host.startswith("localhost"):
        subdomain = host.split(".")[0]
        if subdomain not in ["www", "api"]:
            return subdomain
            
    # Try query parameter (LAST RESORT)
    subdomain = request.query_params.get("subdomain")
    if subdomain:
        return subdomain

    # SPECIAL CASE for internal docker networking (fastapi_backend)
    # When Next.js calls backend via docker service name, host is "fastapi_backend"
    if host in ["fastapi_backend", "backend", "localhost", "127.0.0.1"]:
        # Check if we can get it from Referer header as fallback
        referer = request.headers.get("referer", "")
        if referer and "://" in referer:
            try:
                # https://highpoint.indumart.us/admin/invoices -> highpoint
                from urllib.parse import urlparse
                netloc = urlparse(referer).netloc
                if "." in netloc:
                    subdomain = netloc.split(".")[0]
                    if subdomain not in ["www", "api"]:
                        return subdomain
            except Exception:
                pass

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Subdomain required. Provide via X-Subdomain header, subdomain in URL, or ?subdomain= parameter"
    )


def get_db(subdomain: str = Depends(get_subdomain)) -> Session:
    """
    Get database session for the tenant.
    
    This automatically routes to the correct tenant database.
    For system domains (retailos, system, admin), it returns the master database.
    """
    # System subdomains use the master database
    if subdomain in ["retailos", "system", "admin", "www", "api"]:
        print(f"DEBUG: get_db using MASTER DB for subdomain: '{subdomain}'")
        db = db_manager.get_master_session()
        try:
            yield db
        finally:
            db.close()
        return

    # Tenant subdomains use their isolated database
    database_name = db_manager.get_database_name(subdomain)
    print(f"DEBUG: get_db resolved subdomain '{subdomain}' to database '{database_name}'")
    db = db_manager.get_tenant_session(database_name)
    print(f"DEBUG: get_db YIELDING session for: {db.bind.url}")
    try:
        yield db
    finally:
        db.close()


# Master Database Access (for global catalog)
def get_master_db() -> Session:
    """
    Get database session for the master database (global product catalog).
    
    This is used for endpoints that need to access the global product catalog
    shared across all tenants.
    """
    db = db_manager.get_master_session()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get authenticated user from tenant database.
    
    User credentials are stored in the tenant's own database.
    """
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
    
    # Get user from THIS tenant's database
    user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Attach role info
    user.token_role = payload.get("role", user.role)
    user.token_payload = payload
    
    return user


async def require_admin(
    user: User = Depends(get_current_user)
) -> User:
    """Require admin role."""
    if user.role != "admin" and user.token_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user


async def require_customer(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    """Require customer role."""
    if user.role not in ["customer", "admin"] and user.token_role not in ["customer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    return user


async def require_admin_or_customer(
    user: User = Depends(get_current_user)
) -> User:
    """Allow both admin and customer."""
    if user.role not in ["admin", "customer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Customer access required"
        )
    return user



class TenantFilter:
    """
    Dependency to filter queries by current tenant.
    """
    def __init__(self, subdomain: str = Depends(get_subdomain)):
        self.tenant_id = subdomain
        self.subdomain = subdomain


# TenantContext for accessing both user and database
class TenantContext:
    """
    Provides tenant context with database and user access.
    
    Usage:
        @router.get("/inventory")
        def get_inventory(context: TenantContext = Depends()):
            items = context.db.query(InventoryItem).all()
    """
    
    def __init__(
        self,
        request: Request,
        user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
        master_db: Session = Depends(get_master_db),
        subdomain: str = Depends(get_subdomain)
    ):
        self.user = user
        self.db = db
        self.tenant_db = db  # Alias for clarity
        self.master_db = master_db
        self.subdomain = subdomain
        self.request = request
        self.role = user.role
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin."""
        return self.role == "admin"
    
    @property
    def is_customer(self) -> bool:
        """Check if user is customer."""
        return self.role == "customer"





# Superadmin Authorization
async def require_superadmin(
    user: User = Depends(get_current_user)
) -> User:
    """Require superadmin role."""
    if user.role != "superadmin" and user.token_role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin access required"
        )
    return user


async def require_admin_or_superadmin(
    user: User = Depends(get_current_user)
) -> User:
    """Require admin or superadmin role."""
    if user.role not in ["admin", "superadmin"] and user.token_role not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Superadmin access required"
        )
    return user
