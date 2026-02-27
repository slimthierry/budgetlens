"""Budget and SavingsGoal schemas."""

from datetime import date, datetime
from pydantic import BaseModel

from app.models.budget_models import BudgetPeriod


class BudgetBase(BaseModel):
    """Base budget schema."""
    category: str
    monthly_limit: float
    period: BudgetPeriod = BudgetPeriod.MONTHLY
    alert_threshold: float = 80.0


class BudgetCreate(BudgetBase):
    """Budget creation schema."""
    pass


class BudgetUpdate(BaseModel):
    """Budget update schema."""
    monthly_limit: float | None = None
    period: BudgetPeriod | None = None
    alert_threshold: float | None = None


class BudgetResponse(BudgetBase):
    """Budget response schema."""
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class BudgetProgressResponse(BaseModel):
    """Budget progress with spending data."""
    id: int
    category: str
    monthly_limit: float
    period: BudgetPeriod
    alert_threshold: float
    spent: float
    remaining: float
    percentage: float
    is_alert: bool


class SavingsGoalBase(BaseModel):
    """Base savings goal schema."""
    name: str
    target_amount: float
    deadline: date | None = None
    icon: str = "piggy-bank"


class SavingsGoalCreate(SavingsGoalBase):
    """Savings goal creation schema."""
    current_amount: float = 0.00


class SavingsGoalUpdate(BaseModel):
    """Savings goal update schema."""
    name: str | None = None
    target_amount: float | None = None
    deadline: date | None = None
    icon: str | None = None


class SavingsGoalResponse(SavingsGoalBase):
    """Savings goal response schema."""
    id: int
    user_id: int
    current_amount: float
    percentage: float = 0.0
    created_at: datetime

    model_config = {"from_attributes": True}


class SavingsContribution(BaseModel):
    """Savings contribution schema."""
    amount: float
