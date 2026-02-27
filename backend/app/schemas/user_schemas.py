"""User schemas."""

from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str
    currency: str = "EUR"


class UserCreate(UserBase):
    """User creation schema."""
    password: str


class UserUpdate(BaseModel):
    """User update schema."""
    name: str | None = None
    currency: str | None = None


class UserResponse(UserBase):
    """User response schema."""
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
