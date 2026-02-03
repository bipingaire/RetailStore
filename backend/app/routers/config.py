"""
Config endpoint - Provide frontend with necessary API keys
"""

from fastapi import APIRouter, Depends
from ..dependencies import TenantFilter
from ..config import settings

router = APIRouter()

@router.get("/openai-key")
async def get_openai_key(tenant_filter: TenantFilter = Depends()):
    """
    Provide OpenAI API key to frontend for client-side processing.
    Only accessible to authenticated users.
    """
    return {
        "api_key": settings.openai_api_key or "",
        "available": bool(settings.openai_api_key)
    }
