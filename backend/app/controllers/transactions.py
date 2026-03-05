"""Transaction API routes."""

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.models.transaction_models import TransactionType
from app.schemas.transaction_schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionFilter,
    TransactionListResponse,
)
from app.services.transaction_service import TransactionService

router = APIRouter()


@router.get("/", response_model=TransactionListResponse)
async def list_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    account_id: int | None = None,
    category: str | None = None,
    type: TransactionType | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get paginated and filtered transactions."""
    service = TransactionService(db)
    filters = TransactionFilter(
        account_id=account_id,
        category=category,
        type=type,
        date_from=date_from,
        date_to=date_to,
        min_amount=min_amount,
        max_amount=max_amount,
    )
    return await service.get_transactions(current_user, filters, page, page_size)


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific transaction by ID."""
    service = TransactionService(db)
    return await service.get_transaction(transaction_id, current_user)


@router.post("/", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new transaction."""
    service = TransactionService(db)
    return await service.create_transaction(data, current_user)


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing transaction."""
    service = TransactionService(db)
    return await service.update_transaction(transaction_id, data, current_user)


@router.delete("/{transaction_id}", status_code=204)
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a transaction."""
    service = TransactionService(db)
    await service.delete_transaction(transaction_id, current_user)
