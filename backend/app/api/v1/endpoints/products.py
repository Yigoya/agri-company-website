import math
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    ProductCategoryCreate, ProductCategoryUpdate, ProductCategoryResponse,
    ProductImageResponse,
)
from app.schemas.common import PaginatedResponse, MessageResponse
from app.crud import product as product_crud
from app.core.deps import get_current_superuser
from app.models.user import User
from app.utils.files import save_upload_file, delete_upload_file

router = APIRouter(prefix="/products", tags=["Products"])


# --- Categories ---

@router.get("/categories", response_model=List[ProductCategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return product_crud.get_categories(db)


@router.get("/categories/{slug}", response_model=ProductCategoryResponse)
def get_category(slug: str, db: Session = Depends(get_db)):
    category = product_crud.get_category_by_slug(db, slug)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/categories", response_model=ProductCategoryResponse)
def create_category(
    data: ProductCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    existing = product_crud.get_category_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    return product_crud.create_category(db, data)


@router.put("/categories/{category_id}", response_model=ProductCategoryResponse)
def update_category(
    category_id: int,
    data: ProductCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    category = product_crud.update_category(db, category_id, data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/categories/{category_id}", response_model=MessageResponse)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    success = product_crud.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return MessageResponse(message="Category deleted successfully")


# --- Products ---

@router.get("", response_model=PaginatedResponse[ProductListResponse])
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    products, total = product_crud.get_products(
        db,
        page=page,
        page_size=page_size,
        category_id=category_id,
        search=search,
        featured_only=featured or False,
    )
    return PaginatedResponse(
        items=products,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/all", response_model=PaginatedResponse[ProductListResponse])
def list_all_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    products, total = product_crud.get_products(
        db, page=page, page_size=page_size,
        category_id=category_id, search=search, active_only=False,
    )
    return PaginatedResponse(
        items=products, total=total, page=page, page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = product_crud.get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    existing = product_crud.get_product_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")
    return product_crud.create_product(db, data)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    product = product_crud.update_product(db, product_id, data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.delete("/{product_id}", response_model=MessageResponse)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    success = product_crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return MessageResponse(message="Product deleted successfully")


# --- Product Images ---

@router.post("/{product_id}/images", response_model=ProductImageResponse)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    product = product_crud.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    image_url = await save_upload_file(file, "products")
    return product_crud.add_product_image(
        db, product_id, image_url, alt_text=product.name, is_primary=is_primary
    )


@router.delete("/images/{image_id}", response_model=MessageResponse)
def delete_product_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    success = product_crud.delete_product_image(db, image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")
    return MessageResponse(message="Image deleted successfully")
