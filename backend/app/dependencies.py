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
    # Try header first
    if x_subdomain:
        return x_subdomain
    
    # Try host parsing
    host = request.headers.get("host", "")
    if "." in host and not host.startswith("localhost"):
        subdomain = host.split(".")[0]
        if subdomain not in ["www", "api"]:
            return subdomain
    
    # Try query parameter
    subdomain = request.query_params.get("subdomain")
    if subdomain:
        return subdomain
    
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Subdomain required. Provide via X-Subdomain header, subdomain in URL, or ?subdomain= parameter"
    )


def get_db(subdomain: str = Depends(get_subdomain)) -> Session:
    """
    Get database session for the tenant.
    
    This automatically routes to the correct tenant database.
    """
    database_name = db_manager.get_database_name(subdomain)
    db = db_manager.get_tenant_session(database_name)
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
        subdomain: str = Depends(get_subdomain)
    ):
        self.user = user
        self.db = db
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
