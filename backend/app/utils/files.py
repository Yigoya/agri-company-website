import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException

from app.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_image_file(file: UploadFile) -> None:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )


async def save_upload_file(file: UploadFile, subfolder: str) -> str:
    validate_image_file(file)

    upload_dir = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(upload_dir, exist_ok=True)

    ext = Path(file.filename).suffix.lower() if file.filename else ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB")
        buffer.write(content)

    return f"/uploads/{subfolder}/{filename}"


def delete_upload_file(file_url: str) -> bool:
    if not file_url or not file_url.startswith("/uploads/"):
        return False

    file_path = os.path.join(settings.UPLOAD_DIR, file_url.replace("/uploads/", ""))
    if os.path.exists(file_path):
        os.remove(file_path)
        return True
    return False
