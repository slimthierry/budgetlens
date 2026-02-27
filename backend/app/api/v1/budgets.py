"""Budget API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.budget_schemas import BudgetCreate, BudgetUpdate, BudgetResponse, BudgetProgressResponse
from app.services.budget_service import BudgetService

router = APIRouter()


@router.get("/", response_model=list[BudgetResponse])
async def list_budgets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all budgets for the current user."""
    service = BudgetService(db)
    return await service.get_budgets(current_user)


@router.get("/progress", response_model=list[BudgetProgressResponse])
async def get_budget_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all budgets with spending progress."""
    service = BudgetService(db)
    return await service.get_budget_progress(current_user)


@router.get("/{budget_id}", response_model=BudgetResponse)
async def get_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific budget by ID."""
    service = BudgetService(db)
    return await service.get_budget(budget_id, current_user)


@router.post("/", response_model=BudgetResponse, status_code=201)
async def create_budget(
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new budget."""
    service = BudgetService(db)
    return await service.create_budget(data, current_user)


@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: int,
    data: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing budget."""
    service = BudgetService(db)
    return await service.update_budget(budget_id, data, current_user)


@router.delete("/{budget_id}", status_code=204)
async def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a budget."""
    service = BudgetService(db)
    await service.delete_budget(budget_id, current_user)
