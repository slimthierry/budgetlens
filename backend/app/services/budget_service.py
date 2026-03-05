"""Budget service."""

from datetime import date

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.exceptions import NotFoundError, ForbiddenError
from app.models.account_models import Account
from app.models.budget_models import Budget
from app.models.transaction_models import Transaction, TransactionType
from app.models.user_models import User
from app.schemas.budget_schemas import BudgetCreate, BudgetUpdate, BudgetProgressResponse


class BudgetService:
    """Service for budget operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_budgets(self, user: User) -> list[Budget]:
        """Get all budgets for a user."""
        result = await self.db.execute(
            select(Budget).where(Budget.user_id == user.id).order_by(Budget.category)
        )
        return list(result.scalars().all())

    async def get_budget(self, budget_id: int, user: User) -> Budget:
        """Get a single budget by ID."""
        result = await self.db.execute(
            select(Budget).where(Budget.id == budget_id)
        )
        budget = result.scalar_one_or_none()

        if not budget:
            raise NotFoundError("Budget")

        if budget.user_id != user.id:
            raise ForbiddenError()

        return budget

    async def create_budget(self, data: BudgetCreate, user: User) -> Budget:
        """Create a new budget."""
        budget = Budget(
            user_id=user.id,
            category=data.category,
            monthly_limit=data.monthly_limit,
            period=data.period,
            alert_threshold=data.alert_threshold,
        )
        self.db.add(budget)
        await self.db.flush()
        await self.db.refresh(budget)
        return budget

    async def update_budget(self, budget_id: int, data: BudgetUpdate, user: User) -> Budget:
        """Update an existing budget."""
        budget = await self.get_budget(budget_id, user)

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(budget, field, value)

        await self.db.flush()
        await self.db.refresh(budget)
        return budget

    async def delete_budget(self, budget_id: int, user: User) -> None:
        """Delete a budget."""
        budget = await self.get_budget(budget_id, user)
        await self.db.delete(budget)
        await self.db.flush()

    async def get_budget_progress(self, user: User) -> list[BudgetProgressResponse]:
        """Get all budgets with current spending progress."""
        budgets = await self.get_budgets(user)

        if not budgets:
            return []

        # Get user's account IDs
        user_accounts = await self.db.execute(
            select(Account.id).where(Account.user_id == user.id)
        )
        account_ids = [row[0] for row in user_accounts.all()]

        if not account_ids:
            return [
                BudgetProgressResponse(
                    id=b.id,
                    category=b.category,
                    monthly_limit=float(b.monthly_limit),
                    period=b.period,
                    alert_threshold=b.alert_threshold,
                    spent=0.0,
                    remaining=float(b.monthly_limit),
                    percentage=0.0,
                    is_alert=False,
                )
                for b in budgets
            ]

        today = date.today()
        start_date = date(today.year, today.month, 1)
        if today.month == 12:
            end_date = date(today.year + 1, 1, 1)
        else:
            end_date = date(today.year, today.month + 1, 1)

        # Get spending per category
        spending_result = await self.db.execute(
            select(
                Transaction.category,
                func.sum(func.abs(Transaction.amount)).label("total"),
            )
            .where(
                and_(
                    Transaction.account_id.in_(account_ids),
                    Transaction.type == TransactionType.EXPENSE,
                    Transaction.date >= start_date,
                    Transaction.date < end_date,
                )
            )
            .group_by(Transaction.category)
        )

        spending_map = {row.category: float(row.total) for row in spending_result.all()}

        progress_list = []
        for budget in budgets:
            spent = spending_map.get(budget.category, 0.0)
            limit = float(budget.monthly_limit)
            remaining = max(0, limit - spent)
            percentage = (spent / limit * 100) if limit > 0 else 0

            progress_list.append(
                BudgetProgressResponse(
                    id=budget.id,
                    category=budget.category,
                    monthly_limit=limit,
                    period=budget.period,
                    alert_threshold=budget.alert_threshold,
                    spent=spent,
                    remaining=remaining,
                    percentage=round(percentage, 1),
                    is_alert=percentage >= budget.alert_threshold,
                )
            )

        return progress_list
