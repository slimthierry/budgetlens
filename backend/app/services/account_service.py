"""Account service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ForbiddenError
from app.models.account_models import Account
from app.models.user_models import User
from app.schemas.account_schemas import AccountCreate, AccountUpdate


class AccountService:
    """Service for account operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_accounts(self, user: User) -> list[Account]:
        """Get all accounts for a user."""
        result = await self.db.execute(
            select(Account).where(Account.user_id == user.id).order_by(Account.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_account(self, account_id: int, user: User) -> Account:
        """Get a single account by ID."""
        result = await self.db.execute(
            select(Account).where(Account.id == account_id)
        )
        account = result.scalar_one_or_none()

        if not account:
            raise NotFoundError("Compte")

        if account.user_id != user.id:
            raise ForbiddenError()

        return account

    async def create_account(self, data: AccountCreate, user: User) -> Account:
        """Create a new account."""
        account = Account(
            user_id=user.id,
            name=data.name,
            type=data.type,
            balance=data.balance,
            currency=data.currency,
            icon=data.icon,
        )
        self.db.add(account)
        await self.db.flush()
        await self.db.refresh(account)
        return account

    async def update_account(self, account_id: int, data: AccountUpdate, user: User) -> Account:
        """Update an existing account."""
        account = await self.get_account(account_id, user)

        if data.name is not None:
            account.name = data.name
        if data.type is not None:
            account.type = data.type
        if data.icon is not None:
            account.icon = data.icon

        await self.db.flush()
        await self.db.refresh(account)
        return account

    async def delete_account(self, account_id: int, user: User) -> None:
        """Delete an account."""
        account = await self.get_account(account_id, user)
        await self.db.delete(account)
        await self.db.flush()

    async def get_total_balance(self, user: User) -> float:
        """Get total balance across all accounts."""
        accounts = await self.get_accounts(user)
        return sum(float(a.balance) for a in accounts)
