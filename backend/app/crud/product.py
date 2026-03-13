from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, Tuple, List
import math

from app.models.product import Product, ProductCategory, ProductImage
from app.schemas.product import ProductCreate, ProductUpdate, ProductCategoryCreate, ProductCategoryUpdate


def get_categories(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[ProductCategory]:
    query = db.query(ProductCategory)
    if active_only:
        query = query.filter(ProductCategory.is_active == True)
    return query.offset(skip).limit(limit).all()


def get_category_by_id(db: Session, category_id: int) -> Optional[ProductCategory]:
    return db.query(ProductCategory).filter(ProductCategory.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> Optional[ProductCategory]:
    return db.query(ProductCategory).filter(ProductCategory.slug == slug).first()


def create_category(db: Session, data: ProductCategoryCreate) -> ProductCategory:
    category = ProductCategory(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category_id: int, data: ProductCategoryUpdate) -> Optional[ProductCategory]:
    category = get_category_by_id(db, category_id)
    if not category:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> bool:
    category = get_category_by_id(db, category_id)
    if not category:
        return False
    db.delete(category)
    db.commit()
    return True


def get_products(
    db: Session,
    page: int = 1,
    page_size: int = 12,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    active_only: bool = True,
) -> Tuple[List[Product], int]:
    query = db.query(Product).filter(Product.is_deleted == False)

    if active_only:
        query = query.filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if featured_only:
        query = query.filter(Product.is_featured == True)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.short_description.ilike(search_term),
            )
        )

    total = query.count()
    products = query.order_by(Product.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return products, total


def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id, Product.is_deleted == False).first()


def get_product_by_slug(db: Session, slug: str) -> Optional[Product]:
    return db.query(Product).filter(Product.slug == slug, Product.is_deleted == False).first()


def create_product(db: Session, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, data: ProductUpdate) -> Optional[Product]:
    product = get_product_by_id(db, product_id)
    if not product:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> bool:
    product = get_product_by_id(db, product_id)
    if not product:
        return False
    product.is_deleted = True
    db.commit()
    return True


def add_product_image(
    db: Session, product_id: int, image_url: str, alt_text: Optional[str] = None, is_primary: bool = False
) -> ProductImage:
    if is_primary:
        db.query(ProductImage).filter(
            ProductImage.product_id == product_id, ProductImage.is_primary == True
        ).update({"is_primary": False})

    image = ProductImage(
        product_id=product_id,
        image_url=image_url,
        alt_text=alt_text,
        is_primary=is_primary,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


def delete_product_image(db: Session, image_id: int) -> bool:
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        return False
    db.delete(image)
    db.commit()
    return True
