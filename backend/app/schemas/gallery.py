from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GalleryImageCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    sort_order: int = 0


class GalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class GalleryImageResponse(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    category: Optional[str] = None
    sort_order: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
