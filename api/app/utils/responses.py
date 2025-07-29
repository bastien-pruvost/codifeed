from typing import Any, List, Optional

from flask import Response, make_response
from flask_openapi3.types import ResponseDict
from pydantic import BaseModel, Field, ValidationError


# Unified validation error model for all validation errors
class ValidationErrorItem(BaseModel):
    """Validation error item matching Pydantic v2 format - used for all validation errors"""

    type: str = Field(description="Error type (e.g., 'missing', 'string_too_short')")
    loc: List[str] = Field(description="Location of the error (field path)")
    msg: str = Field(description="Human-readable error message")
    input: Optional[Any] = Field(default=None, description="Input value that caused the error")
    url: Optional[str] = Field(default=None, description="URL to Pydantic error documentation")


# Standard API error models
class ErrorResponse(BaseModel):
    """Standard error response format"""

    message: str = Field(description="Main error message")
    code: Optional[str] = Field(default=None, description="Error code for programmatic handling")
    details: Optional[List[ValidationErrorItem]] = Field(
        default=None, description="Detailed validation errors"
    )


abp_responses = ResponseDict(
    {
        "4XX": ErrorResponse,
        "5XX": ErrorResponse,
        "422": ErrorResponse,
    }
)


# Error code constants for consistent handling
class ErrorCodes:
    # Authentication & Authorization
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    TOKEN_INVALID = "TOKEN_INVALID"

    # Validation
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_INPUT = "INVALID_INPUT"
    MISSING_FIELD = "MISSING_FIELD"

    # Resource Management
    NOT_FOUND = "NOT_FOUND"
    ALREADY_EXISTS = "ALREADY_EXISTS"
    CONFLICT = "CONFLICT"

    # Database
    DATABASE_ERROR = "DATABASE_ERROR"
    INTEGRITY_ERROR = "INTEGRITY_ERROR"

    # Server
    INTERNAL_ERROR = "INTERNAL_ERROR"
    BAD_REQUEST = "BAD_REQUEST"
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED"
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"


def success_response(
    data: dict,
    status: int = 200,
) -> Response:
    """Create a standardized success response"""
    return make_response(data, status)


def error_response(
    message: str = "An error occurred",
    status: int = 500,
    code: Optional[str] = None,
    details: Optional[List[ValidationErrorItem]] = None,
) -> Response:
    """Create a standardized error response"""
    response = ErrorResponse(
        message=message,
        code=code or ErrorCodes.INTERNAL_ERROR,
        details=details,
    )
    return make_response(response.model_dump(exclude_none=True), status)


def validation_error_response(
    validation_errors: List[ValidationErrorItem],
    message: str = "Validation failed",
    status: int = 422,
) -> Response:
    """Create a Pydantic v2 compatible validation error response"""
    return error_response(
        message=message,
        status=status,
        details=validation_errors,
    )


# def http_exception_response(
#     exception: HTTPException,
#     code: Optional[str] = None,
# ) -> Response:
#     """Create response from HTTP exception"""
#     error_code_map = {
#         400: ErrorCodes.BAD_REQUEST,
#         401: ErrorCodes.UNAUTHORIZED,
#         403: ErrorCodes.FORBIDDEN,
#         404: ErrorCodes.NOT_FOUND,
#         405: ErrorCodes.METHOD_NOT_ALLOWED,
#         409: ErrorCodes.CONFLICT,
#         429: ErrorCodes.RATE_LIMIT_EXCEEDED,
#     }

#     status_code = exception.code or 500
#     return error_response(
#         message=exception.description or str(exception),
#         status=status_code,
#         code=code or error_code_map.get(status_code, ErrorCodes.INTERNAL_ERROR),
#     )


def pydantic_validation_error_response(
    validation_error: ValidationError,
) -> Response:
    """Convert Pydantic ValidationError to our format"""
    validation_errors = [
        ValidationErrorItem(
            type=error.get("type", "validation_error"),
            loc=error.get("loc", ()),
            msg=error.get("msg", "Validation error"),
        )
        for error in validation_error.errors()
    ]
    return validation_error_response(validation_errors)


# def database_error_response(
#     error: Exception,
#     operation: str = "database operation",
# ) -> tuple[dict, int]:
#     """Create response for database errors"""
#     error_message = f"Database error during {operation}"

#     # Check for specific database error types
#     error_str = str(error).lower()

#     if "unique constraint" in error_str or "duplicate" in error_str:
#         return error_response(
#             message="Resource already exists",
#             status=409,
#             code=ErrorCodes.ALREADY_EXISTS,
#             details=[
#                 ValidationErrorItem(
#                     type="value_error.duplicate",
#                     loc=["database"],
#                     msg="A resource with these values already exists",
#                 )
#             ],
#         )
#     elif "foreign key" in error_str:
#         return error_response(
#             message="Referenced resource not found",
#             status=400,
#             code=ErrorCodes.VALIDATION_ERROR,
#             details=[
#                 ValidationErrorItem(
#                     type="value_error.foreign_key",
#                     loc=["database"],
#                     msg="One or more referenced resources do not exist",
#                 )
#             ],
#         )
#     elif "not null" in error_str:
#         return error_response(
#             message="Required field missing",
#             status=400,
#             code=ErrorCodes.MISSING_FIELD,
#             details=[
#                 ValidationErrorItem(
#                     type="value_error.missing",
#                     loc=["database"],
#                     msg="A required field is missing or null",
#                 )
#             ],
#         )
#     else:
#         return error_response(
#             message=error_message,
#             status=500,
#             code=ErrorCodes.DATABASE_ERROR,
#         )
