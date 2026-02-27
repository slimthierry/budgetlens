"""Forecast-related background tasks."""

import logging
from datetime import date

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import AsyncSessionLocal
from app.models.account_models import Account
from app.models.transaction_models import Transaction, TransactionType
from app.models.user_models import User

logger = logging.getLogger(__name__)


async def generate_monthly_forecasts():
    """Generate spending forecasts for all users at end of month."""
    async with AsyncSessionLocal() as db:
        today = date.today()

        result = await db.execute(select(User))
        users = result.scalars().all()

        forecasts = []

        for user in users:
            account_result = await db.execute(
                select(Account.id).where(Account.user_id == user.id)
            )
            account_ids = [row[0] for row in account_result.all()]

            if not account_ids:
                continue

            start_date = date(today.year, today.month, 1)
            if today.month == 12:
                end_date = date(today.year + 1, 1, 1)
            else:
                end_date = date(today.year, today.month + 1, 1)

            days_in_month = (end_date - start_date).days
            days_elapsed = today.day

            # Get current spending
            spending_result = await db.execute(
                select(func.sum(func.abs(Transaction.amount)))
                .where(
                    and_(
                        Transaction.account_id.in_(account_ids),
                        Transaction.type == TransactionType.EXPENSE,
                        Transaction.date >= start_date,
                        Transaction.date < end_date,
                    )
                )
            )
            current_spending = float(spending_result.scalar() or 0)

            if days_elapsed > 0:
                daily_rate = current_spending / days_elapsed
                projected = daily_rate * days_in_month
            else:
                projected = 0

            forecasts.append({
                "user_id": user.id,
                "current_spending": current_spending,
                "projected_spending": round(projected, 2),
                "days_elapsed": days_elapsed,
                "days_remaining": days_in_month - days_elapsed,
            })

            logger.info(
                "Forecast: User %d - Current: %.2f, Projected: %.2f",
                user.id,
                current_spending,
                projected,
            )

        return forecasts
