"""Dashboard schemas."""

from pydantic import BaseModel

from app.schemas.transaction_schemas import TransactionResponse
from app.schemas.budget_schemas import BudgetProgressResponse


class CategorySpending(BaseModel):
    """Spending per category for pie chart."""
    category: str
    amount: float
    percentage: float
    color: str | None = None


class MonthlyComparison(BaseModel):
    """Monthly income vs expenses comparison."""
    month: str
    income: float
    expenses: float
    net: float


class DashboardResponse(BaseModel):
    """Full dashboard data response."""
    total_balance: float
    monthly_income: float
    monthly_expenses: float
    monthly_net: float
    spending_by_category: list[CategorySpending]
    recent_transactions: list[TransactionResponse]
    budget_alerts: list[BudgetProgressResponse]
    monthly_comparison: list[MonthlyComparison]


class ReportResponse(BaseModel):
    """Report data for monthly/yearly analysis."""
    monthly_comparisons: list[MonthlyComparison]
    category_trends: list[dict]
    total_income: float
    total_expenses: float
    average_monthly_income: float
    average_monthly_expenses: float
    savings_rate: float
