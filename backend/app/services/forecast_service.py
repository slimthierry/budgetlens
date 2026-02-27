"""Forecast service for financial predictions."""

from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_models import User
from app.services.transaction_service import TransactionService


class ForecastService:
    """Service for financial forecasting."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.transaction_service = TransactionService(db)

    async def get_monthly_forecast(self, user: User) -> dict:
        """Predict end-of-month spending based on current trends."""
        today = date.today()
        day_of_month = today.day

        totals = await self.transaction_service.get_monthly_totals(
            user, today.year, today.month
        )

        # Simple linear projection
        if day_of_month > 0:
            if today.month == 12:
                days_in_month = 31
            else:
                next_month = date(today.year, today.month + 1, 1)
                days_in_month = (next_month - date(today.year, today.month, 1)).days

            daily_rate_expense = totals["expenses"] / day_of_month
            daily_rate_income = totals["income"] / day_of_month

            projected_expenses = daily_rate_expense * days_in_month
            projected_income = daily_rate_income * days_in_month
        else:
            projected_expenses = 0.0
            projected_income = 0.0

        return {
            "current_expenses": totals["expenses"],
            "current_income": totals["income"],
            "projected_expenses": round(projected_expenses, 2),
            "projected_income": round(projected_income, 2),
            "projected_net": round(projected_income - projected_expenses, 2),
            "day_of_month": day_of_month,
            "confidence": min(day_of_month / 15, 1.0),
        }

    async def get_category_forecast(self, user: User, category: str) -> dict:
        """Predict end-of-month spending for a specific category."""
        today = date.today()
        day_of_month = today.day

        spending_data = await self.transaction_service.get_spending_by_category(
            user, today.year, today.month
        )

        category_spending = 0.0
        for item in spending_data:
            if item["category"] == category:
                category_spending = item["amount"]
                break

        if today.month == 12:
            days_in_month = 31
        else:
            next_month = date(today.year, today.month + 1, 1)
            days_in_month = (next_month - date(today.year, today.month, 1)).days

        if day_of_month > 0:
            daily_rate = category_spending / day_of_month
            projected = daily_rate * days_in_month
        else:
            projected = 0.0

        return {
            "category": category,
            "current_spending": category_spending,
            "projected_spending": round(projected, 2),
            "daily_average": round(category_spending / max(day_of_month, 1), 2),
        }
