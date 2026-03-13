from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, Tuple, List
from datetime import datetime, timezone

from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostUpdate


def get_blog_posts(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    published_only: bool = True,
    search: Optional[str] = None,
    tag: Optional[str] = None,
) -> Tuple[List[BlogPost], int]:
    query = db.query(BlogPost).filter(BlogPost.is_deleted == False)

    if published_only:
        query = query.filter(BlogPost.is_published == True)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                BlogPost.title.ilike(search_term),
                BlogPost.excerpt.ilike(search_term),
                BlogPost.content.ilike(search_term),
            )
        )
    if tag:
        query = query.filter(BlogPost.tags.ilike(f"%{tag}%"))

    total = query.count()
    posts = query.order_by(BlogPost.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return posts, total


def get_blog_post_by_id(db: Session, post_id: int) -> Optional[BlogPost]:
    return db.query(BlogPost).filter(BlogPost.id == post_id, BlogPost.is_deleted == False).first()


def get_blog_post_by_slug(db: Session, slug: str) -> Optional[BlogPost]:
    return db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.is_deleted == False).first()


def create_blog_post(db: Session, data: BlogPostCreate) -> BlogPost:
    post_data = data.model_dump()
    if data.is_published:
        post_data["published_at"] = datetime.now(timezone.utc)
    post = BlogPost(**post_data)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_blog_post(db: Session, post_id: int, data: BlogPostUpdate) -> Optional[BlogPost]:
    post = get_blog_post_by_id(db, post_id)
    if not post:
        return None
    update_data = data.model_dump(exclude_unset=True)
    if "is_published" in update_data and update_data["is_published"] and not post.is_published:
        update_data["published_at"] = datetime.now(timezone.utc)
    for key, value in update_data.items():
        setattr(post, key, value)
    db.commit()
    db.refresh(post)
    return post


def delete_blog_post(db: Session, post_id: int) -> bool:
    post = get_blog_post_by_id(db, post_id)
    if not post:
        return False
    post.is_deleted = True
    db.commit()
    return True
