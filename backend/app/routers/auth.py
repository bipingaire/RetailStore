"""
Authentication router - Updated for database-per-tenant architecture.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

from ..database_manager import get_master_db, db_manager
from ..models.master_models import User, TenantUser, SuperadminUser, Tenant
from ..models.tenant_models import Customer
from ..utils.auth import verify_password, get_password_hash, create_access_token, create_refresh_token
from ..dependencies import get_current_user

router = APIRouter()


# Pydantic schemas
class CustomerRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    subdomain: str


class AdminRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    subdomain: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: str
    is_active: bool
    created_at: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_role: str
    user_id: str


# ==================== CUSTOMER AUTHENTICATION ====================

@router.post("/customer/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_customer(
    customer_data: CustomerRegister,
    master_db: Session = Depends(get_master_db)
):
    """Register a new customer for a specific store."""
    # Check if user exists
    existing_user = master_db.query(User).filter(User.email == customer_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Find tenant
    tenant = master_db.query(Tenant).filter(Tenant.subdomain == customer_data.subdomain).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Store '{customer_data.subdomain}' not found"
        )
    
    # Create user in master DB
    new_user = User(
        email=customer_data.email,
        encrypted_password=get_password_hash(customer_data.password),
        is_active=True
    )
    master_db.add(new_user)
    master_db.flush()
    
    # Create customer in tenant DB
    tenant_db = db_manager.get_tenant_session(tenant.database_name)
    try:
        customer = Customer(
            user_id=new_user.id,
            full_name=customer_data.full_name,
            email=customer_data.email,
            phone=customer_data.phone
        )
        tenant_db.add(customer)
        tenant_db.commit()
        
        # Store customer_id in master DB commit
        master_db.commit()
        master_db.refresh(new_user)
        
        return {
            "id": new_user.id,
            "email": new_user.email,
            "role": "customer",
            "is_active": new_user.is_active,
            "created_at": new_user.created_at.isoformat()
        }
    finally:
        tenant_db.close()


@router.post("/customer/login", response_model=TokenResponse)
async def login_customer(
    form_data: OAuth2PasswordRequestForm = Depends(),
    master_db: Session = Depends(get_master_db)
):
    """Customer login endpoint."""
    user = master_db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.encrypted_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive account"
        )
    
    # Find customer in any tenant DB (search all tenants)
    tenants = master_db.query(Tenant).filter(Tenant.is_active == True).all()
    customer = None
    tenant_id = None
    customer_id = None
    
    for tenant in tenants:
        tenant_db = db_manager.get_tenant_session(tenant.database_name)
        try:
            customer = tenant_db.query(Customer).filter(Customer.user_id == user.id).first()
            if customer:
                tenant_id = tenant.tenant_id
                customer_id = customer.customer_id
                break
        finally:
            tenant_db.close()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a customer account. Use appropriate login endpoint."
        )
    
    # Create tokens
    access_token = create_access_token(data={
        "sub": str(user.id),
        "role": "customer",
        "customer_id": str(customer_id),
        "tenant_id": str(tenant_id)
    })
    refresh_token = create_refresh_token(data={
        "sub": str(user.id),
        "role": "customer"
    })
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_role": "customer",
        "user_id": str(user.id)
    }


# ==================== ADMIN AUTHENTICATION ====================

@router.post("/admin/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_admin(
    admin_data: AdminRegister,
    master_db: Session = Depends(get_master_db)
):
    """Register a new store admin."""
    # Check if user exists
    existing_user = master_db.query(User).filter(User.email == admin_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Find tenant
    tenant = master_db.query(Tenant).filter(Tenant.subdomain == admin_data.subdomain).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Store '{admin_data.subdomain}' not found"
        )
    
    # Create user
    new_user = User(
        email=admin_data.email,
        encrypted_password=get_password_hash(admin_data.password),
        is_active=True
    )
    master_db.add(new_user)
    master_db.flush()
    
    # Link to tenant
    tenant_user = TenantUser(
        tenant_id=tenant.tenant_id,
        user_id=new_user.id,
        role_name="admin",
        is_active=True
    )
    master_db.add(tenant_user)
    master_db.commit()
    master_db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "role": "admin",
        "is_active": new_user.is_active,
        "created_at": new_user.created_at.isoformat()
    }


@router.post("/admin/login", response_model=TokenResponse)
async def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    master_db: Session = Depends(get_master_db)
):
    """Admin login endpoint."""
    user = master_db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.encrypted_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify admin
    tenant_user = master_db.query(TenantUser).filter(
        TenantUser.user_id == user.id,
        TenantUser.is_active == True
    ).first()
    
    if not tenant_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not an admin account. Use appropriate login endpoint."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive account"
        )
    
    # Create tokens
    access_token = create_access_token(data={
        "sub": str(user.id),
        "role": "admin",
        "tenant_id": str(tenant_user.tenant_id)
    })
    refresh_token = create_refresh_token(data={
        "sub": str(user.id),
        "role": "admin"
    })
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_role": "admin",
        "user_id": str(user.id)
    }


# ==================== SUPERADMIN AUTHENTICATION ====================

@router.post("/superadmin/login", response_model=TokenResponse)
async def login_superadmin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    master_db: Session = Depends(get_master_db)
):
    """SuperAdmin login endpoint."""
    user = master_db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.encrypted_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify superadmin
    superadmin = master_db.query(SuperadminUser).filter(
        SuperadminUser.user_id == user.id,
        SuperadminUser.is_active == True
    ).first()
    
    if not superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a superadmin account."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive account"
        )
    
    # Create tokens
    access_token = create_access_token(data={
        "sub": str(user.id),
        "role": "superadmin",
        "superadmin_id": str(superadmin.superadmin_id)
    })
    refresh_token = create_refresh_token(data={
        "sub": str(user.id),
        "role": "superadmin"
    })
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_role": "superadmin",
        "user_id": str(user.id)
    }


# ==================== COMMON ENDPOINTS ====================

@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    master_db: Session = Depends(get_master_db)
):
    """Get current user information with role details."""
    role = "user"
    role_details = {}
    
    # Check roles
    superadmin = master_db.query(SuperadminUser).filter(SuperadminUser.user_id == current_user.id).first()
    if superadmin:
        role = "superadmin"
        role_details = {
            "superadmin_id": str(superadmin.superadmin_id),
            "permissions": superadmin.permissions_json
        }
    
    tenant_user = master_db.query(TenantUser).filter(TenantUser.user_id == current_user.id).first()
    if tenant_user:
        role = "admin"
        role_details = {
            "tenant_id": str(tenant_user.tenant_id),
            "role_name": tenant_user.role_name
        }
    
    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "role": role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat(),
        "role_details": role_details
    }
