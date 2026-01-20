from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pathlib import Path
import uuid
import shutil
from typing import Optional

from ..config import settings
from ..dependencies import get_current_user

router = APIRouter()

# Ensure upload directory exists
UPLOAD_DIR = Path(settings.upload_dir)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: Optional[str] = "general",
    current_user = Depends(get_current_user)
):
    """
    Upload a file to local storage.
    
    - **file**: File to upload
    - **folder**: Optional subfolder (e.g., 'products', 'invoices')
    
    Returns the file URL/path.
    """
    # Validate file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get position (size)
    file.file.seek(0)  # Reset to start
    
    max_size = settings.max_upload_size_mb * 1024 * 1024
    if file_size > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_upload_size_mb}MB"
        )
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Create folder path
    folder_path = UPLOAD_DIR / folder
    folder_path.mkdir(parents=True, exist_ok=True)
    
    # Save file
    file_path = folder_path / unique_filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return relative path
    relative_path = f"/uploads/{folder}/{unique_filename}"
    
    return {
        "filename": file.filename,
        "path": relative_path,
        "size": file_size,
        "content_type": file.content_type
    }


@router.delete("/delete")
async def delete_file(
    path: str,
    current_user = Depends(get_current_user)
):
    """
    Delete an uploaded file.
    
    - **path**: Relative path to the file (e.g., '/uploads/products/file.jpg')
    """
    # Remove leading slash and 'uploads/' prefix
    clean_path = path.lstrip("/").replace("uploads/", "")
    file_path = UPLOAD_DIR / clean_path
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Security: ensure file is within upload directory
    if not str(file_path.resolve()).startswith(str(UPLOAD_DIR.resolve())):
        raise HTTPException(status_code=403, detail="Invalid file path")
    
    file_path.unlink()
    
    return {"message": "File deleted successfully", "path": path}
