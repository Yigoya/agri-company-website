from sqlalchemy.orm import Session
from typing import Optional, Tuple, List

from app.models.gallery import GalleryImage
from app.schemas.gallery import GalleryImageUpdate


def get_gallery_images(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    category: Optional[str] = None,
    active_only: bool = True,
) -> Tuple[List[GalleryImage], int]:
    query = db.query(GalleryImage)

    if active_only:
        query = query.filter(GalleryImage.is_active == True)
    if category:
        query = query.filter(GalleryImage.category == category)

    total = query.count()
    images = query.order_by(GalleryImage.sort_order.asc(), GalleryImage.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    return images, total


def get_gallery_image_by_id(db: Session, image_id: int) -> Optional[GalleryImage]:
    return db.query(GalleryImage).filter(GalleryImage.id == image_id).first()


def create_gallery_image(
    db: Session,
    image_url: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    category: Optional[str] = None,
    sort_order: int = 0,
) -> GalleryImage:
    image = GalleryImage(
        image_url=image_url,
        title=title,
        description=description,
        category=category,
        sort_order=sort_order,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


def update_gallery_image(db: Session, image_id: int, data: GalleryImageUpdate) -> Optional[GalleryImage]:
    image = get_gallery_image_by_id(db, image_id)
    if not image:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(image, key, value)
    db.commit()
    db.refresh(image)
    return image


def delete_gallery_image(db: Session, image_id: int) -> bool:
    image = get_gallery_image_by_id(db, image_id)
    if not image:
        return False
    db.delete(image)
    db.commit()
    return True


def get_gallery_categories(db: Session) -> List[str]:
    results = (
        db.query(GalleryImage.category)
        .filter(GalleryImage.is_active == True, GalleryImage.category.isnot(None))
        .distinct()
        .all()
    )
    return [r[0] for r in results]
