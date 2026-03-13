import math
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.schemas.gallery import GalleryImageUpdate, GalleryImageResponse
from app.schemas.common import PaginatedResponse, MessageResponse
from app.crud import gallery as gallery_crud
from app.core.deps import get_current_superuser
from app.models.user import User
from app.utils.files import save_upload_file

router = APIRouter(prefix="/gallery", tags=["Gallery"])


@router.get("", response_model=PaginatedResponse[GalleryImageResponse])
def list_images(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    images, total = gallery_crud.get_gallery_images(
        db, page=page, page_size=page_size, category=category,
    )
    return PaginatedResponse(
        items=images, total=total, page=page, page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/categories", response_model=List[str])
def list_gallery_categories(db: Session = Depends(get_db)):
    return gallery_crud.get_gallery_categories(db)


@router.post("", response_model=GalleryImageResponse)
async def upload_gallery_image(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    sort_order: int = Form(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    image_url = await save_upload_file(file, "gallery")
    return gallery_crud.create_gallery_image(
        db, image_url=image_url, title=title, description=description,
        category=category, sort_order=sort_order,
    )


@router.put("/{image_id}", response_model=GalleryImageResponse)
def update_image(
    image_id: int,
    data: GalleryImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    image = gallery_crud.update_gallery_image(db, image_id, data)
    if not image:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return image


@router.delete("/{image_id}", response_model=MessageResponse)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    success = gallery_crud.delete_gallery_image(db, image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return MessageResponse(message="Gallery image deleted successfully")
