from typing import Optional

from flask import Response, make_response
from flask_openapi3.types import ResponseDict
from pydantic import Field, ValidationError
from pydantic_core import ErrorDetails

from app.models import ApiBaseModel


# Standard API error models
class ErrorResponse(ApiBaseModel):
    """Standard error response format"""

    message: str = Field(description="Main error message")
    code: Optional[str] = Field(default=None, description="Error code for programmatic handling")
    details: Optional[list[ErrorDetails]] = Field(description="Detailed validation errors")


class ErrorResponseWithDefaultDetailsNone(ErrorResponse):
    details: Optional[list[ErrorDetails]] = Field(
        default=None, description="Detailed validation errors"
    )


# Error codes for programmatic error handling
class ErrorCodes:
    # Authentication (401)
    EXPIRED_TOKEN = "EXPIRED_TOKEN"
    INVALID_TOKEN = "INVALID_TOKEN"

    # Authorization (403)
    FORBIDDEN = "FORBIDDEN"

    # Client errors (400, 404, 409, 422)
    BAD_REQUEST = "BAD_REQUEST"
    NOT_FOUND = "NOT_FOUND"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    ALREADY_EXISTS = "ALREADY_EXISTS"
    CONFLICT = "CONFLICT"

    # Server errors (500, 503)
    INTERNAL_ERROR = "INTERNAL_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"
    INTEGRITY_ERROR = "INTEGRITY_ERROR"

    # Other
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED"


abp_responses = ResponseDict(
    {
        "4XX": ErrorResponseWithDefaultDetailsNone,
        "5XX": ErrorResponseWithDefaultDetailsNone,
        "422": ErrorResponse,
    }
)


def success_response(
    data: dict | list,
    status: int = 200,
) -> Response:
    """Create a standardized success response"""
    return make_response(data, status)


def error_response(
    message: str = "An error occurred",
    status: int = 500,
    code: Optional[str] = None,
    details: Optional[list[ErrorDetails]] = None,
) -> Response:
    """Create a standardized error response"""
    response = ErrorResponse(
        message=message,
        code=code or None,
        details=details,
    )
    return make_response(response.model_dump(exclude_none=True), status)


def validation_error_response(validation_error: ValidationError) -> Response:
    """Convert Pydantic ValidationError to ErrorResponse format"""
    # Convert ErrorDetails to JSON-serializable dicts
    # by keeping only the serializable fields
    errors = [
        ErrorDetails(
            type=error.get("type"),
            loc=error.get("loc"),
            msg=error.get("msg"),
            input=error.get("input"),
            url=error.get("url") or "",
        )
        for error in validation_error.errors()
    ]

    return error_response(
        message="Validation failed",
        status=422,
        code=ErrorCodes.VALIDATION_ERROR,
        details=errors,
    )
