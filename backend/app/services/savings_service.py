"""Savings goal service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ForbiddenError, BadRequestError
from app.models.budget_models import SavingsGoal
from app.models.user_models import User
from app.schemas.budget_schemas import SavingsGoalCreate, SavingsGoalUpdate, SavingsGoalResponse


class SavingsService:
    """Service for savings goal operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_savings_goals(self, user: User) -> list[SavingsGoalResponse]:
        """Get all savings goals for a user."""
        result = await self.db.execute(
            select(SavingsGoal)
            .where(SavingsGoal.user_id == user.id)
            .order_by(SavingsGoal.created_at.desc())
        )
        goals = result.scalars().all()

        return [
            SavingsGoalResponse(
                id=g.id,
                user_id=g.user_id,
                name=g.name,
                target_amount=float(g.target_amount),
                current_amount=float(g.current_amount),
                deadline=g.deadline,
                icon=g.icon,
                percentage=round(
                    (float(g.current_amount) / float(g.target_amount) * 100)
                    if float(g.target_amount) > 0 else 0,
                    1,
                ),
                created_at=g.created_at,
            )
            for g in goals
        ]

    async def get_savings_goal(self, goal_id: int, user: User) -> SavingsGoal:
        """Get a single savings goal by ID."""
        result = await self.db.execute(
            select(SavingsGoal).where(SavingsGoal.id == goal_id)
        )
        goal = result.scalar_one_or_none()

        if not goal:
            raise NotFoundError("Objectif d'épargne")

        if goal.user_id != user.id:
            raise ForbiddenError()

        return goal

    async def create_savings_goal(self, data: SavingsGoalCreate, user: User) -> SavingsGoal:
        """Create a new savings goal."""
        goal = SavingsGoal(
            user_id=user.id,
            name=data.name,
            target_amount=data.target_amount,
            current_amount=data.current_amount,
            deadline=data.deadline,
            icon=data.icon,
        )
        self.db.add(goal)
        await self.db.flush()
        await self.db.refresh(goal)
        return goal

    async def update_savings_goal(
        self, goal_id: int, data: SavingsGoalUpdate, user: User
    ) -> SavingsGoal:
        """Update an existing savings goal."""
        goal = await self.get_savings_goal(goal_id, user)

        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(goal, field, value)

        await self.db.flush()
        await self.db.refresh(goal)
        return goal

    async def add_contribution(self, goal_id: int, amount: float, user: User) -> SavingsGoal:
        """Add a contribution to a savings goal."""
        goal = await self.get_savings_goal(goal_id, user)

        if amount <= 0:
            raise BadRequestError("Le montant doit être positif")

        goal.current_amount = float(goal.current_amount) + amount
        await self.db.flush()
        await self.db.refresh(goal)
        return goal

    async def delete_savings_goal(self, goal_id: int, user: User) -> None:
        """Delete a savings goal."""
        goal = await self.get_savings_goal(goal_id, user)
        await self.db.delete(goal)
        await self.db.flush()
