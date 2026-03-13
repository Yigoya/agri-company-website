from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ContactInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    subject: str
    message: str
    product_id: Optional[int] = None


class ContactInquiryResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    subject: str
    message: str
    product_id: Optional[int] = None
    is_read: bool
    is_archived: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
