import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.contact import ContactInquiryCreate, ContactInquiryResponse
from app.schemas.common import PaginatedResponse, MessageResponse
from app.crud import contact as contact_crud
from app.core.deps import get_current_superuser
from app.models.user import User

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("", response_model=ContactInquiryResponse, status_code=201)
def submit_inquiry(data: ContactInquiryCreate, db: Session = Depends(get_db)):
    return contact_crud.create_inquiry(db, data)


@router.get("", response_model=PaginatedResponse[ContactInquiryResponse])
def list_inquiries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_read: Optional[bool] = None,
    is_archived: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    inquiries, total = contact_crud.get_inquiries(
        db, page=page, page_size=page_size, is_read=is_read, is_archived=is_archived,
    )
    return PaginatedResponse(
        items=inquiries, total=total, page=page, page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    count = contact_crud.get_unread_count(db)
    return {"count": count}


@router.get("/{inquiry_id}", response_model=ContactInquiryResponse)
def get_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    inquiry = contact_crud.get_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.patch("/{inquiry_id}/read", response_model=ContactInquiryResponse)
def mark_read(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    inquiry = contact_crud.mark_as_read(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.patch("/{inquiry_id}/archive", response_model=ContactInquiryResponse)
def archive(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    inquiry = contact_crud.archive_inquiry(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.delete("/{inquiry_id}", response_model=MessageResponse)
def delete(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
):
    success = contact_crud.delete_inquiry(db, inquiry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return MessageResponse(message="Inquiry deleted successfully")
