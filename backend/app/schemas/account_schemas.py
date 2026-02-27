"""Account schemas."""

from datetime import datetime
from pydantic import BaseModel

from app.models.account_models import AccountType


class AccountBase(BaseModel):
    """Base account schema."""
    name: str
    type: AccountType = AccountType.CHECKING
    currency: str = "EUR"
    icon: str | None = "wallet"


class AccountCreate(AccountBase):
    """Account creation schema."""
    balance: float = 0.00


class AccountUpdate(BaseModel):
    """Account update schema."""
    name: str | None = None
    type: AccountType | None = None
    icon: str | None = None


class AccountResponse(AccountBase):
    """Account response schema."""
    id: int
    user_id: int
    balance: float
    created_at: datetime

    model_config = {"from_attributes": True}


class AccountBalanceUpdate(BaseModel):
    """Account balance update schema."""
    balance: float
