"""Dashboard tests."""

import pytest
from datetime import date
from httpx import AsyncClient


@pytest.mark.asyncio
class TestDashboard:
    """Test dashboard endpoints."""

    async def _setup_data(self, client: AsyncClient):
        """Helper to create test data for dashboard."""
        # Create account
        account_response = await client.post(
            "/api/v1/accounts/",
            json={
                "name": "Compte principal",
                "type": "checking",
                "balance": 5000.00,
                "currency": "EUR",
            },
        )
        account_id = account_response.json()["id"]

        # Create transactions
        transactions = [
            {"amount": 3000.00, "category": "Salaire", "type": "income"},
            {"amount": -120.00, "category": "Alimentation", "type": "expense"},
            {"amount": -45.00, "category": "Transport", "type": "expense"},
            {"amount": -800.00, "category": "Logement", "type": "expense"},
            {"amount": -35.00, "category": "Loisirs", "type": "expense"},
        ]
        for t in transactions:
            await client.post(
                "/api/v1/transactions/",
                json={
                    "account_id": account_id,
                    "amount": t["amount"],
                    "category": t["category"],
                    "date": str(date.today()),
                    "type": t["type"],
                },
            )

        # Create budget
        await client.post(
            "/api/v1/budgets/",
            json={
                "category": "Alimentation",
                "monthly_limit": 150.00,
                "period": "monthly",
                "alert_threshold": 80,
            },
        )

        return account_id

    async def test_get_dashboard(self, authenticated_client: AsyncClient):
        """Test getting full dashboard data."""
        await self._setup_data(authenticated_client)

        response = await authenticated_client.get("/api/v1/dashboard/")
        assert response.status_code == 200
        data = response.json()

        assert "total_balance" in data
        assert "monthly_income" in data
        assert "monthly_expenses" in data
        assert "monthly_net" in data
        assert "spending_by_category" in data
        assert "recent_transactions" in data
        assert "budget_alerts" in data
        assert "monthly_comparison" in data

        assert data["monthly_income"] > 0
        assert data["monthly_expenses"] > 0
        assert len(data["recent_transactions"]) > 0
        assert len(data["spending_by_category"]) > 0

    async def test_get_forecast(self, authenticated_client: AsyncClient):
        """Test getting spending forecast."""
        await self._setup_data(authenticated_client)

        response = await authenticated_client.get("/api/v1/dashboard/forecast")
        assert response.status_code == 200
        data = response.json()

        assert "current_expenses" in data
        assert "current_income" in data
        assert "projected_expenses" in data
        assert "projected_income" in data
        assert "projected_net" in data
        assert "confidence" in data

    async def test_get_reports(self, authenticated_client: AsyncClient):
        """Test getting report data."""
        await self._setup_data(authenticated_client)

        response = await authenticated_client.get("/api/v1/dashboard/reports?months=6")
        assert response.status_code == 200
        data = response.json()

        assert "monthly_comparisons" in data
        assert "category_trends" in data
        assert "total_income" in data
        assert "total_expenses" in data
        assert "savings_rate" in data
        assert len(data["monthly_comparisons"]) == 6

    async def test_empty_dashboard(self, authenticated_client: AsyncClient):
        """Test dashboard with no data."""
        response = await authenticated_client.get("/api/v1/dashboard/")
        assert response.status_code == 200
        data = response.json()

        assert data["total_balance"] == 0
        assert data["monthly_income"] == 0
        assert data["monthly_expenses"] == 0
        assert len(data["recent_transactions"]) == 0

    async def test_budget_alert_on_dashboard(self, authenticated_client: AsyncClient):
        """Test that budget alerts appear when threshold is exceeded."""
        account_response = await authenticated_client.post(
            "/api/v1/accounts/",
            json={
                "name": "Test Account",
                "type": "checking",
                "balance": 2000.00,
            },
        )
        account_id = account_response.json()["id"]

        # Create a budget with low limit
        await authenticated_client.post(
            "/api/v1/budgets/",
            json={
                "category": "Shopping",
                "monthly_limit": 100.00,
                "alert_threshold": 80,
            },
        )

        # Spend over 80% of budget
        await authenticated_client.post(
            "/api/v1/transactions/",
            json={
                "account_id": account_id,
                "amount": -85.00,
                "category": "Shopping",
                "date": str(date.today()),
                "type": "expense",
            },
        )

        response = await authenticated_client.get("/api/v1/dashboard/")
        data = response.json()

        assert len(data["budget_alerts"]) > 0
        alert = data["budget_alerts"][0]
        assert alert["category"] == "Shopping"
        assert alert["is_alert"] is True
        assert alert["percentage"] >= 80
