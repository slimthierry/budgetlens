"""Dashboard service."""

from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_models import User
from app.schemas.dashboard_schemas import (
    DashboardResponse,
    CategorySpending,
    MonthlyComparison,
)
from app.schemas.transaction_schemas import TransactionFilter, TransactionResponse
from app.schemas.budget_schemas import BudgetProgressResponse
from app.services.account_service import AccountService
from app.services.transaction_service import TransactionService
from app.services.budget_service import BudgetService

# Default category colors
CATEGORY_COLORS = {
    "Alimentation": "#10B981",
    "Transport": "#3B82F6",
    "Logement": "#8B5CF6",
    "Loisirs": "#F59E0B",
    "Santé": "#EF4444",
    "Shopping": "#EC4899",
    "Éducation": "#06B6D4",
    "Abonnements": "#6366F1",
    "Restaurants": "#F97316",
    "Épargne": "#14B8A6",
    "Salaire": "#22C55E",
    "Freelance": "#A855F7",
    "Autres": "#6B7280",
}


class DashboardService:
    """Service for dashboard data aggregation."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.account_service = AccountService(db)
        self.transaction_service = TransactionService(db)
        self.budget_service = BudgetService(db)

    async def get_dashboard(self, user: User) -> DashboardResponse:
        """Get complete dashboard data."""
        today = date.today()

        # Total balance
        total_balance = await self.account_service.get_total_balance(user)

        # Monthly totals
        monthly_totals = await self.transaction_service.get_monthly_totals(
            user, today.year, today.month
        )

        # Spending by category
        spending_data = await self.transaction_service.get_spending_by_category(
            user, today.year, today.month
        )
        spending_by_category = [
            CategorySpending(
                category=item["category"],
                amount=item["amount"],
                percentage=item["percentage"],
                color=CATEGORY_COLORS.get(item["category"], "#6B7280"),
            )
            for item in spending_data
        ]

        # Recent transactions (last 10)
        recent = await self.transaction_service.get_transactions(
            user, page=1, page_size=10
        )

        # Budget alerts
        budget_progress = await self.budget_service.get_budget_progress(user)
        budget_alerts = [bp for bp in budget_progress if bp.is_alert]

        # Monthly comparison (last 6 months)
        monthly_comparison = await self._get_monthly_comparison(user, 6)

        return DashboardResponse(
            total_balance=total_balance,
            monthly_income=monthly_totals["income"],
            monthly_expenses=monthly_totals["expenses"],
            monthly_net=monthly_totals["net"],
            spending_by_category=spending_by_category,
            recent_transactions=recent.items,
            budget_alerts=budget_alerts,
            monthly_comparison=monthly_comparison,
        )

    async def _get_monthly_comparison(
        self, user: User, months: int
    ) -> list[MonthlyComparison]:
        """Get income vs expense comparison for recent months."""
        today = date.today()
        comparisons = []

        for i in range(months - 1, -1, -1):
            month = today.month - i
            year = today.year
            while month <= 0:
                month += 12
                year -= 1

            totals = await self.transaction_service.get_monthly_totals(user, year, month)

            month_names = [
                "", "Janv", "Fév", "Mars", "Avr", "Mai", "Juin",
                "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
            ]

            comparisons.append(
                MonthlyComparison(
                    month=f"{month_names[month]} {year}",
                    income=totals["income"],
                    expenses=totals["expenses"],
                    net=totals["net"],
                )
            )

        return comparisons
