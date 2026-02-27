"""Transaction tests."""

import pytest
from datetime import date
from httpx import AsyncClient


@pytest.mark.asyncio
class TestTransactions:
    """Test transaction endpoints."""

    async def _create_account(self, client: AsyncClient) -> int:
        """Helper to create a test account."""
        response = await client.post(
            "/api/v1/accounts/",
            json={
                "name": "Compte courant",
                "type": "checking",
                "balance": 1000.00,
                "currency": "EUR",
            },
        )
        return response.json()["id"]

    async def test_create_transaction(self, authenticated_client: AsyncClient):
        """Test creating a transaction."""
        account_id = await self._create_account(authenticated_client)

        response = await authenticated_client.post(
            "/api/v1/transactions/",
            json={
                "account_id": account_id,
                "amount": -45.50,
                "category": "Alimentation",
                "description": "Courses Carrefour",
                "date": str(date.today()),
                "type": "expense",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["amount"] == -45.50
        assert data["category"] == "Alimentation"
        assert data["type"] == "expense"

    async def test_list_transactions(self, authenticated_client: AsyncClient):
        """Test listing transactions with pagination."""
        account_id = await self._create_account(authenticated_client)

        # Create multiple transactions
        for i in range(5):
            await authenticated_client.post(
                "/api/v1/transactions/",
                json={
                    "account_id": account_id,
                    "amount": -(10.0 + i),
                    "category": "Alimentation",
                    "description": f"Transaction {i}",
                    "date": str(date.today()),
                    "type": "expense",
                },
            )

        response = await authenticated_client.get("/api/v1/transactions/")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 5
        assert len(data["items"]) == 5

    async def test_filter_transactions_by_category(self, authenticated_client: AsyncClient):
        """Test filtering transactions by category."""
        account_id = await self._create_account(authenticated_client)

        await authenticated_client.post(
            "/api/v1/transactions/",
            json={
                "account_id": account_id,
                "amount": -30.00,
                "category": "Alimentation",
                "date": str(date.today()),
                "type": "expense",
            },
        )
        await authenticated_client.post(
            "/api/v1/transactions/",
            json={
                "account_id": account_id,
                "amount": -50.00,
                "category": "Transport",
                "date": str(date.today()),
                "type": "expense",
            },
        )

        response = await authenticated_client.get(
            "/api/v1/transactions/?category=Alimentation"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["category"] == "Alimentation"

    async def test_update_transaction(self, authenticated_client: AsyncClient):
        """Test updating a transaction."""
        account_id = await self._create_account(authenticated_client)

        create_response = await authenticated_client.post(
            "/api/v1/transactions/",
            json={
                "account_id": account_id,
                "amount": -25.00,
                "category": "Alimentation",
                "date": str(date.today()),
                "type": "expense",
            },
        )
        transaction_id = create_response.json()["id"]

        response = await authenticated_client.put(
            f"/api/v1/transactions/{transaction_id}",
            json={"amount": -30.00, "category": "Restaurants"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["amount"] == -30.00
        assert data["category"] == "Restaurants"

    async def test_delete_transaction(self, authenticated_client: AsyncClient):
        """Test deleting a transaction."""
        account_id = await self._create_account(authenticated_client)

        create_response = await authenticated_client.post(
            "/api/v1/transactions/",
            json={
                "account_id": account_id,
                "amount": -15.00,
                "category": "Transport",
                "date": str(date.today()),
                "type": "expense",
            },
        )
        transaction_id = create_response.json()["id"]

        response = await authenticated_client.delete(
            f"/api/v1/transactions/{transaction_id}"
        )
        assert response.status_code == 204
