"""
Authentication router for fully isolated tenant databases.

Each tenant has its own users table with login credentials.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

from ..dependencies import get_db, get_subdomain
from ..models import User, Customer
from ..utils.auth import verify_password, get_password_hash, create_access_token, create_refresh_token
from ..dependencies import get_current_user

router = APIRouter()


# Pydantic schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "customer"  # customer or admin


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: str
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_role: str
    user_id: str
    subdomain: str


# ==================== REGISTRATION ====================

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    subdomain: str = Depends(get_subdomain),
    db: Session = Depends(get_db)
):
    """
    Register a new user in this tenant's database.
    
    **Role can be:**
    - `customer` - Regular customer account
    - `admin` - Store administrator (requires approval)
    """
    # Check if user exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered in this store"
        )
    
    # Create user in THIS tenant's database
    new_user = User(
        email=user_data.email,
        encrypted_password=get_password_hash(user_data.password),
        role=user_data.role,
        is_active=True
    )
    db.add(new_user)
    db.flush()
    
    # If customer, create customer profile
    if user_data.role == "customer":
        customer = Customer(
            user_id=new_user.id,
            full_name=user_data.full_name,
            email=user_data.email
        )
        db.add(customer)
    
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "role": new_user.role,
        "is_active": new_user.is_active
    }


# ==================== LOGIN ====================

@router.post("/login", response_model=TokenResponse)
async def login(
    subdomain: str = Depends(get_subdomain),
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login to this tenant's database.
    
    **Credentials are isolated per store.**
    Each store has completely separate user accounts.
    """
    # Find user in THIS tenant's database
    user = db.query(User).filter(User.email == form_data.username).first()
    
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
    
    # Create tokens
    access_token = create_access_token(data={
        "sub": str(user.id),
        "role": user.role,
        "subdomain": subdomain
    })
    refresh_token = create_refresh_token(data={
        "sub": str(user.id),
        "role": user.role,
        "subdomain": subdomain
    })
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_role": user.role,
        "user_id": str(user.id),
        "subdomain": subdomain
    }


# ==================== CURRENT USER ====================

@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
    subdomain: str = Depends(get_subdomain),
    db: Session = Depends(get_db)
):
    """Get current user information."""
    
    # Check if user is also a customer
    customer = None
    if current_user.role == "customer":
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    
    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "subdomain": subdomain,
        "customer_id": str(customer.customer_id) if customer else None,
        "full_name": customer.full_name if customer else None
    }


# ==================== TOKEN REFRESH ====================

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    subdomain: str = Depends(get_subdomain),
    db: Session = Depends(get_db)
):
    """Refresh access token."""
    from ..utils.auth import decode_token
    
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    new_access_token = create_access_token(data={
        "sub": str(user.id),
        "role": user.role,
        "subdomain": subdomain
    })
    new_refresh_token = create_refresh_token(data={
        "sub": str(user.id),
        "role": user.role,
        "subdomain": subdomain
    })
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user_role": user.role,
        "user_id": str(user.id),
        "subdomain": subdomain
    }
