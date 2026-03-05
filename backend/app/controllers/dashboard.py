"""Dashboard API routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.dashboard_schemas import DashboardResponse, ReportResponse, MonthlyComparison
from app.services.dashboard_service import DashboardService
from app.services.forecast_service import ForecastService
from app.services.transaction_service import TransactionService

router = APIRouter()


@router.get("/", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get complete dashboard data."""
    service = DashboardService(db)
    return await service.get_dashboard(current_user)


@router.get("/forecast")
async def get_forecast(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get monthly spending forecast."""
    service = ForecastService(db)
    return await service.get_monthly_forecast(current_user)


@router.get("/forecast/{category}")
async def get_category_forecast(
    category: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get category-specific spending forecast."""
    service = ForecastService(db)
    return await service.get_category_forecast(current_user, category)


@router.get("/reports", response_model=ReportResponse)
async def get_reports(
    months: int = Query(12, ge=1, le=24),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get report data for monthly/yearly analysis."""
    dashboard_service = DashboardService(db)
    transaction_service = TransactionService(db)

    # Get monthly comparisons
    monthly_comparisons = await dashboard_service._get_monthly_comparison(
        current_user, months
    )

    # Calculate totals
    total_income = sum(m.income for m in monthly_comparisons)
    total_expenses = sum(m.expenses for m in monthly_comparisons)
    avg_income = total_income / max(len(monthly_comparisons), 1)
    avg_expenses = total_expenses / max(len(monthly_comparisons), 1)
    savings_rate = (
        ((total_income - total_expenses) / total_income * 100)
        if total_income > 0
        else 0
    )

    # Category trends (simplified)
    from datetime import date
    today = date.today()
    category_trends = []
    spending_data = await transaction_service.get_spending_by_category(
        current_user, today.year, today.month
    )
    for item in spending_data:
        category_trends.append({
            "category": item["category"],
            "current_month": item["amount"],
            "percentage": item["percentage"],
        })

    return ReportResponse(
        monthly_comparisons=monthly_comparisons,
        category_trends=category_trends,
        total_income=round(total_income, 2),
        total_expenses=round(total_expenses, 2),
        average_monthly_income=round(avg_income, 2),
        average_monthly_expenses=round(avg_expenses, 2),
        savings_rate=round(savings_rate, 1),
    )
