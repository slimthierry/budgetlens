"""Transaction schemas."""

from datetime import date, datetime
from pydantic import BaseModel

from app.models.transaction_models import TransactionType


class TransactionBase(BaseModel):
    """Base transaction schema."""
    amount: float
    category: str
    subcategory: str | None = None
    description: str | None = None
    date: date
    type: TransactionType
    recurring: bool = False


class TransactionCreate(TransactionBase):
    """Transaction creation schema."""
    account_id: int


class TransactionUpdate(BaseModel):
    """Transaction update schema."""
    amount: float | None = None
    category: str | None = None
    subcategory: str | None = None
    description: str | None = None
    date: date | None = None
    type: TransactionType | None = None
    recurring: bool | None = None


class TransactionResponse(TransactionBase):
    """Transaction response schema."""
    id: int
    account_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TransactionFilter(BaseModel):
    """Transaction filter schema."""
    account_id: int | None = None
    category: str | None = None
    type: TransactionType | None = None
    date_from: date | None = None
    date_to: date | None = None
    min_amount: float | None = None
    max_amount: float | None = None


class TransactionListResponse(BaseModel):
    """Paginated transaction list response."""
    items: list[TransactionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
