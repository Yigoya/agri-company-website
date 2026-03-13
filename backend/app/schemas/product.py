from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False
    sort_order: int = 0

    class Config:
        from_attributes = True


class ProductCategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class ProductCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    origin: Optional[str] = None
    harvest_season: Optional[str] = None
    packaging_info: Optional[str] = None
    specifications: Optional[str] = None
    is_featured: bool = False
    category_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    origin: Optional[str] = None
    harvest_season: Optional[str] = None
    packaging_info: Optional[str] = None
    specifications: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    origin: Optional[str] = None
    harvest_season: Optional[str] = None
    packaging_info: Optional[str] = None
    specifications: Optional[str] = None
    is_featured: bool
    is_active: bool
    category_id: Optional[int] = None
    category: Optional[ProductCategoryResponse] = None
    images: List[ProductImageResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    id: int
    name: str
    slug: str
    short_description: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    is_featured: bool
    category: Optional[ProductCategoryResponse] = None
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True
