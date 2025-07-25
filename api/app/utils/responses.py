from typing import Any, List, Optional

from flask import Response, make_response

from app.database.models import ErrorDetail, ErrorResponse


def success_response(
    data: Any,
    status: int = 200,
) -> Response:
    """Create a standardized success response"""
    return make_response(data, status)


def error_response(
    message: str = "An error occurred",
    status: int = 500,
    detail: Optional[List[ErrorDetail]] = None,
) -> tuple[dict, int]:
    """Create a standardized error response"""
    response = ErrorResponse(
        status=status,
        message=message,
        detail=detail or [],
    )
    return response.model_dump(), status
