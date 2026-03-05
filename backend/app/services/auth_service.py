"""Authentication service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.auth.exceptions import BadRequestError, NotFoundError
from app.models.user_models import User
from app.schemas.auth_schemas import RegisterRequest, LoginRequest, TokenResponse


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, data: RegisterRequest) -> User:
        """Register a new user."""
        result = await self.db.execute(
            select(User).where(User.email == data.email)
        )
        existing = result.scalar_one_or_none()

        if existing:
            raise BadRequestError("Un compte avec cet email existe déjà")

        user = User(
            email=data.email,
            name=data.name,
            hashed_password=get_password_hash(data.password),
            currency=data.currency,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def login(self, data: LoginRequest) -> TokenResponse:
        """Authenticate user and return tokens."""
        result = await self.db.execute(
            select(User).where(User.email == data.email)
        )
        user = result.scalar_one_or_none()

        if not user or not verify_password(data.password, user.hashed_password):
            raise BadRequestError("Email ou mot de passe incorrect")

        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token."""
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise BadRequestError("Token de rafraîchissement invalide")

        user_id = payload.get("sub")
        result = await self.db.execute(
            select(User).where(User.id == int(user_id))
        )
        user = result.scalar_one_or_none()

        if not user:
            raise NotFoundError("Utilisateur")

        new_access_token = create_access_token(data={"sub": str(user.id)})
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
        )
