"""Custom application exceptions."""

from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    """Resource not found."""

    def __init__(self, resource: str = "Ressource"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} non trouvé(e)",
        )


class DuplicateError(HTTPException):
    """Resource already exists."""

    def __init__(self, resource: str = "Ressource"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{resource} existe déjà",
        )


class ForbiddenError(HTTPException):
    """Access forbidden."""

    def __init__(self, detail: str = "Accès non autorisé"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


class BadRequestError(HTTPException):
    """Bad request."""

    def __init__(self, detail: str = "Requête invalide"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class BudgetExceededError(HTTPException):
    """Budget threshold exceeded."""

    def __init__(self, category: str, percentage: float):
        super().__init__(
            status_code=status.HTTP_200_OK,
            detail={
                "warning": "budget_alert",
                "message": f"Budget {category} atteint à {percentage:.0f}%",
                "category": category,
                "percentage": percentage,
            },
        )
