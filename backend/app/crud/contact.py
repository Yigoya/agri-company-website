from sqlalchemy.orm import Session
from typing import Optional, Tuple, List

from app.models.contact import ContactInquiry
from app.schemas.contact import ContactInquiryCreate


def get_inquiries(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    is_read: Optional[bool] = None,
    is_archived: bool = False,
) -> Tuple[List[ContactInquiry], int]:
    query = db.query(ContactInquiry).filter(ContactInquiry.is_archived == is_archived)

    if is_read is not None:
        query = query.filter(ContactInquiry.is_read == is_read)

    total = query.count()
    inquiries = query.order_by(ContactInquiry.created_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    return inquiries, total


def get_inquiry_by_id(db: Session, inquiry_id: int) -> Optional[ContactInquiry]:
    return db.query(ContactInquiry).filter(ContactInquiry.id == inquiry_id).first()


def create_inquiry(db: Session, data: ContactInquiryCreate) -> ContactInquiry:
    inquiry = ContactInquiry(**data.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


def mark_as_read(db: Session, inquiry_id: int) -> Optional[ContactInquiry]:
    inquiry = get_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        return None
    inquiry.is_read = True
    db.commit()
    db.refresh(inquiry)
    return inquiry


def archive_inquiry(db: Session, inquiry_id: int) -> Optional[ContactInquiry]:
    inquiry = get_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        return None
    inquiry.is_archived = True
    db.commit()
    db.refresh(inquiry)
    return inquiry


def delete_inquiry(db: Session, inquiry_id: int) -> bool:
    inquiry = get_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        return False
    db.delete(inquiry)
    db.commit()
    return True


def get_unread_count(db: Session) -> int:
    return db.query(ContactInquiry).filter(
        ContactInquiry.is_read == False,
        ContactInquiry.is_archived == False,
    ).count()
