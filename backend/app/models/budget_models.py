"""Budget and SavingsGoal models."""

import enum
from datetime import date

from sqlalchemy import String, Numeric, ForeignKey, Enum, Date, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class BudgetPeriod(str, enum.Enum):
    """Budget period enumeration."""
    MONTHLY = "monthly"
    WEEKLY = "weekly"


class Budget(TimestampMixin, Base):
    """Budget model for category spending limits."""

    __tablename__ = "budgets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    monthly_limit: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    period: Mapped[BudgetPeriod] = mapped_column(
        Enum(BudgetPeriod), default=BudgetPeriod.MONTHLY, nullable=False
    )
    alert_threshold: Mapped[float] = mapped_column(Float, default=80.0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="budgets")

    def __repr__(self) -> str:
        return f"<Budget(id={self.id}, category={self.category}, limit={self.monthly_limit})>"


class SavingsGoal(TimestampMixin, Base):
    """Savings goal model."""

    __tablename__ = "savings_goals"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    target_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    current_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    deadline: Mapped[date] = mapped_column(Date, nullable=True)
    icon: Mapped[str] = mapped_column(String(50), default="piggy-bank", nullable=True)

    # Relationships
    user = relationship("User", back_populates="savings_goals")

    def __repr__(self) -> str:
        return f"<SavingsGoal(id={self.id}, name={self.name}, progress={self.current_amount}/{self.target_amount})>"
