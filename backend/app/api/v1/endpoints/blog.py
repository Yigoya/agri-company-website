import math
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostResponse, BlogPostListResponse
from app.schemas.common import PaginatedResponse, MessageResponse
from app.crud import blog as blog_crud
from app.core.deps import get_current_superuser
from app.models.user import User
from app.utils.files import save_upload_file

router = APIRouter(prefix="/blog", tags=["Blog"])


@router.get("", response_model=PaginatedResponse[BlogPostListResponse])
def list_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    search: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db),
):
    posts, total = blog_crud.get_blog_posts(
        db, page=page, page_size=page_size, search=search, tag=tag,
    )
    return PaginatedResponse(
        items=posts, total=total, page=page, page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/all", response_model=PaginatedResponse[BlogPostListResponse])
def list_all_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    posts, total = blog_crud.get_blog_posts(
        db, page=page, page_size=page_size, search=search, published_only=False,
    )
    return PaginatedResponse(
        items=posts, total=total, page=page, page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/{slug}", response_model=BlogPostResponse)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = blog_crud.get_blog_post_by_slug(db, slug)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.post("", response_model=BlogPostResponse)
def create_post(
    data: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    existing = blog_crud.get_blog_post_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Blog post slug already exists")
    return blog_crud.create_blog_post(db, data)


@router.put("/{post_id}", response_model=BlogPostResponse)
def update_post(
    post_id: int,
    data: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    post = blog_crud.update_blog_post(db, post_id, data)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.delete("/{post_id}", response_model=MessageResponse)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    success = blog_crud.delete_blog_post(db, post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return MessageResponse(message="Blog post deleted successfully")


@router.post("/upload-image")
async def upload_blog_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_superuser),
):
    image_url = await save_upload_file(file, "blog")
    return {"url": image_url}
