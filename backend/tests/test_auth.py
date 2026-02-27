"""Authentication tests."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestAuth:
    """Test authentication endpoints."""

    async def test_register_success(self, client: AsyncClient):
        """Test successful user registration."""
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@budgetlens.dev",
                "name": "New User",
                "password": "securepassword123",
                "currency": "EUR",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@budgetlens.dev"
        assert data["name"] == "New User"
        assert data["currency"] == "EUR"
        assert "id" in data

    async def test_register_duplicate_email(self, client: AsyncClient):
        """Test registration with duplicate email."""
        user_data = {
            "email": "duplicate@budgetlens.dev",
            "name": "User One",
            "password": "password123",
        }
        await client.post("/api/v1/auth/register", json=user_data)
        response = await client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 400

    async def test_login_success(self, client: AsyncClient):
        """Test successful login."""
        await client.post(
            "/api/v1/auth/register",
            json={
                "email": "login@budgetlens.dev",
                "name": "Login User",
                "password": "password123",
            },
        )
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "login@budgetlens.dev",
                "password": "password123",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_invalid_password(self, client: AsyncClient):
        """Test login with wrong password."""
        await client.post(
            "/api/v1/auth/register",
            json={
                "email": "wrong@budgetlens.dev",
                "name": "Wrong Password",
                "password": "correctpassword",
            },
        )
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "wrong@budgetlens.dev",
                "password": "wrongpassword",
            },
        )
        assert response.status_code == 400

    async def test_get_current_user(self, authenticated_client: AsyncClient):
        """Test getting current user info."""
        response = await authenticated_client.get("/api/v1/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@budgetlens.dev"
        assert data["name"] == "Test User"

    async def test_unauthorized_access(self, client: AsyncClient):
        """Test accessing protected route without token."""
        response = await client.get("/api/v1/auth/me")
        assert response.status_code == 401

    async def test_refresh_token(self, client: AsyncClient):
        """Test token refresh."""
        await client.post(
            "/api/v1/auth/register",
            json={
                "email": "refresh@budgetlens.dev",
                "name": "Refresh User",
                "password": "password123",
            },
        )
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "refresh@budgetlens.dev",
                "password": "password123",
            },
        )
        refresh_token = login_response.json()["refresh_token"]

        response = await client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
