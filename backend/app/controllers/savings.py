"""Savings goals API routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.budget_schemas import (
    SavingsGoalCreate,
    SavingsGoalUpdate,
    SavingsGoalResponse,
    SavingsContribution,
)
from app.services.savings_service import SavingsService

router = APIRouter()


@router.get("/", response_model=list[SavingsGoalResponse])
async def list_savings_goals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all savings goals for the current user."""
    service = SavingsService(db)
    return await service.get_savings_goals(current_user)


@router.get("/{goal_id}", response_model=SavingsGoalResponse)
async def get_savings_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific savings goal by ID."""
    service = SavingsService(db)
    goal = await service.get_savings_goal(goal_id, current_user)
    percentage = round(
        (float(goal.current_amount) / float(goal.target_amount) * 100)
        if float(goal.target_amount) > 0 else 0,
        1,
    )
    return SavingsGoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        target_amount=float(goal.target_amount),
        current_amount=float(goal.current_amount),
        deadline=goal.deadline,
        icon=goal.icon,
        percentage=percentage,
        created_at=goal.created_at,
    )


@router.post("/", response_model=SavingsGoalResponse, status_code=201)
async def create_savings_goal(
    data: SavingsGoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new savings goal."""
    service = SavingsService(db)
    goal = await service.create_savings_goal(data, current_user)
    return SavingsGoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        target_amount=float(goal.target_amount),
        current_amount=float(goal.current_amount),
        deadline=goal.deadline,
        icon=goal.icon,
        percentage=0.0,
        created_at=goal.created_at,
    )


@router.post("/{goal_id}/contribute", response_model=SavingsGoalResponse)
async def add_contribution(
    goal_id: int,
    data: SavingsContribution,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a contribution to a savings goal."""
    service = SavingsService(db)
    goal = await service.add_contribution(goal_id, data.amount, current_user)
    percentage = round(
        (float(goal.current_amount) / float(goal.target_amount) * 100)
        if float(goal.target_amount) > 0 else 0,
        1,
    )
    return SavingsGoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        target_amount=float(goal.target_amount),
        current_amount=float(goal.current_amount),
        deadline=goal.deadline,
        icon=goal.icon,
        percentage=percentage,
        created_at=goal.created_at,
    )


@router.put("/{goal_id}", response_model=SavingsGoalResponse)
async def update_savings_goal(
    goal_id: int,
    data: SavingsGoalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing savings goal."""
    service = SavingsService(db)
    goal = await service.update_savings_goal(goal_id, data, current_user)
    percentage = round(
        (float(goal.current_amount) / float(goal.target_amount) * 100)
        if float(goal.target_amount) > 0 else 0,
        1,
    )
    return SavingsGoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        target_amount=float(goal.target_amount),
        current_amount=float(goal.current_amount),
        deadline=goal.deadline,
        icon=goal.icon,
        percentage=percentage,
        created_at=goal.created_at,
    )


@router.delete("/{goal_id}", status_code=204)
async def delete_savings_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a savings goal."""
    service = SavingsService(db)
    await service.delete_savings_goal(goal_id, current_user)
