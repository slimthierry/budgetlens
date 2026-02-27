"""Budget-related background tasks."""

import logging
from datetime import date

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import AsyncSessionLocal
from app.models.account_models import Account
from app.models.budget_models import Budget
from app.models.transaction_models import Transaction, TransactionType
from app.models.user_models import User

logger = logging.getLogger(__name__)


async def check_budget_alerts():
    """Check all user budgets and generate alerts for those exceeding thresholds."""
    async with AsyncSessionLocal() as db:
        today = date.today()
        start_date = date(today.year, today.month, 1)
        if today.month == 12:
            end_date = date(today.year + 1, 1, 1)
        else:
            end_date = date(today.year, today.month + 1, 1)

        # Get all budgets
        result = await db.execute(select(Budget))
        budgets = result.scalars().all()

        alerts = []

        for budget in budgets:
            # Get user accounts
            account_result = await db.execute(
                select(Account.id).where(Account.user_id == budget.user_id)
            )
            account_ids = [row[0] for row in account_result.all()]

            if not account_ids:
                continue

            # Calculate spending
            spending_result = await db.execute(
                select(func.sum(func.abs(Transaction.amount)))
                .where(
                    and_(
                        Transaction.account_id.in_(account_ids),
                        Transaction.type == TransactionType.EXPENSE,
                        Transaction.category == budget.category,
                        Transaction.date >= start_date,
                        Transaction.date < end_date,
                    )
                )
            )
            spent = float(spending_result.scalar() or 0)
            limit = float(budget.monthly_limit)
            percentage = (spent / limit * 100) if limit > 0 else 0

            if percentage >= budget.alert_threshold:
                alerts.append({
                    "user_id": budget.user_id,
                    "category": budget.category,
                    "spent": spent,
                    "limit": limit,
                    "percentage": round(percentage, 1),
                })
                logger.warning(
                    "Budget alert: User %d - %s at %.1f%% (%s/%s)",
                    budget.user_id,
                    budget.category,
                    percentage,
                    spent,
                    limit,
                )

        return alerts
