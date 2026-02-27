"""Transaction service."""

import math
from datetime import date

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ForbiddenError
from app.models.account_models import Account
from app.models.transaction_models import Transaction, TransactionType
from app.models.user_models import User
from app.schemas.transaction_schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionFilter,
    TransactionListResponse,
    TransactionResponse,
)


class TransactionService:
    """Service for transaction operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def _verify_account_ownership(self, account_id: int, user: User) -> Account:
        """Verify the account belongs to the user."""
        result = await self.db.execute(
            select(Account).where(Account.id == account_id)
        )
        account = result.scalar_one_or_none()

        if not account:
            raise NotFoundError("Compte")

        if account.user_id != user.id:
            raise ForbiddenError()

        return account

    async def get_transactions(
        self,
        user: User,
        filters: TransactionFilter | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> TransactionListResponse:
        """Get paginated and filtered transactions for a user."""
        user_accounts = await self.db.execute(
            select(Account.id).where(Account.user_id == user.id)
        )
        account_ids = [row[0] for row in user_accounts.all()]

        if not account_ids:
            return TransactionListResponse(
                items=[], total=0, page=page, page_size=page_size, total_pages=0
            )

        query = select(Transaction).where(Transaction.account_id.in_(account_ids))

        if filters:
            if filters.account_id is not None:
                query = query.where(Transaction.account_id == filters.account_id)
            if filters.category is not None:
                query = query.where(Transaction.category == filters.category)
            if filters.type is not None:
                query = query.where(Transaction.type == filters.type)
            if filters.date_from is not None:
                query = query.where(Transaction.date >= filters.date_from)
            if filters.date_to is not None:
                query = query.where(Transaction.date <= filters.date_to)
            if filters.min_amount is not None:
                query = query.where(Transaction.amount >= filters.min_amount)
            if filters.max_amount is not None:
                query = query.where(Transaction.amount <= filters.max_amount)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # Apply pagination
        query = query.order_by(Transaction.date.desc(), Transaction.created_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(query)
        transactions = result.scalars().all()

        return TransactionListResponse(
            items=[TransactionResponse.model_validate(t) for t in transactions],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=math.ceil(total / page_size) if total > 0 else 0,
        )

    async def get_transaction(self, transaction_id: int, user: User) -> Transaction:
        """Get a single transaction by ID."""
        result = await self.db.execute(
            select(Transaction).where(Transaction.id == transaction_id)
        )
        transaction = result.scalar_one_or_none()

        if not transaction:
            raise NotFoundError("Transaction")

        await self._verify_account_ownership(transaction.account_id, user)
        return transaction

    async def create_transaction(self, data: TransactionCreate, user: User) -> Transaction:
        """Create a new transaction and update account balance."""
        account = await self._verify_account_ownership(data.account_id, user)

        transaction = Transaction(
            account_id=data.account_id,
            amount=data.amount,
            category=data.category,
            subcategory=data.subcategory,
            description=data.description,
            date=data.date,
            type=data.type,
            recurring=data.recurring,
        )
        self.db.add(transaction)

        # Update account balance
        account.balance = float(account.balance) + data.amount

        await self.db.flush()
        await self.db.refresh(transaction)
        return transaction

    async def update_transaction(
        self, transaction_id: int, data: TransactionUpdate, user: User
    ) -> Transaction:
        """Update an existing transaction."""
        transaction = await self.get_transaction(transaction_id, user)

        # If amount changes, adjust account balance
        if data.amount is not None and data.amount != float(transaction.amount):
            account = await self._verify_account_ownership(transaction.account_id, user)
            balance_diff = data.amount - float(transaction.amount)
            account.balance = float(account.balance) + balance_diff

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(transaction, field, value)

        await self.db.flush()
        await self.db.refresh(transaction)
        return transaction

    async def delete_transaction(self, transaction_id: int, user: User) -> None:
        """Delete a transaction and adjust account balance."""
        transaction = await self.get_transaction(transaction_id, user)
        account = await self._verify_account_ownership(transaction.account_id, user)

        # Reverse the balance effect
        account.balance = float(account.balance) - float(transaction.amount)

        await self.db.delete(transaction)
        await self.db.flush()

    async def get_monthly_totals(
        self, user: User, year: int, month: int
    ) -> dict[str, float]:
        """Get monthly income and expense totals."""
        user_accounts = await self.db.execute(
            select(Account.id).where(Account.user_id == user.id)
        )
        account_ids = [row[0] for row in user_accounts.all()]

        if not account_ids:
            return {"income": 0.0, "expenses": 0.0, "net": 0.0}

        start_date = date(year, month, 1)
        if month == 12:
            end_date = date(year + 1, 1, 1)
        else:
            end_date = date(year, month + 1, 1)

        result = await self.db.execute(
            select(
                Transaction.type,
                func.sum(Transaction.amount).label("total"),
            )
            .where(
                and_(
                    Transaction.account_id.in_(account_ids),
                    Transaction.date >= start_date,
                    Transaction.date < end_date,
                )
            )
            .group_by(Transaction.type)
        )

        totals = {"income": 0.0, "expenses": 0.0, "net": 0.0}
        for row in result.all():
            amount = float(row.total) if row.total else 0.0
            if row.type == TransactionType.INCOME:
                totals["income"] = abs(amount)
            elif row.type == TransactionType.EXPENSE:
                totals["expenses"] = abs(amount)

        totals["net"] = totals["income"] - totals["expenses"]
        return totals

    async def get_spending_by_category(
        self, user: User, year: int, month: int
    ) -> list[dict]:
        """Get spending breakdown by category for a month."""
        user_accounts = await self.db.execute(
            select(Account.id).where(Account.user_id == user.id)
        )
        account_ids = [row[0] for row in user_accounts.all()]

        if not account_ids:
            return []

        start_date = date(year, month, 1)
        if month == 12:
            end_date = date(year + 1, 1, 1)
        else:
            end_date = date(year, month + 1, 1)

        result = await self.db.execute(
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
            .order_by(func.sum(func.abs(Transaction.amount)).desc())
        )

        rows = result.all()
        total_spending = sum(float(row.total) for row in rows) if rows else 0

        categories = []
        for row in rows:
            amount = float(row.total)
            categories.append({
                "category": row.category,
                "amount": amount,
                "percentage": round((amount / total_spending * 100), 1) if total_spending > 0 else 0,
            })

        return categories
