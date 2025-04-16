from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    loc: List[str] = Field(description="Location of the error")
    msg: str = Field(description="Error message")
    type: str = Field(description="Error type")


class ErrorResponse(BaseModel):
    status_code: int = Field(description="HTTP status code")
    detail: List[ErrorDetail] = Field(description="Error details")
    message: str = Field(description="Error message")


class SuccessResponse(BaseModel, Generic[T]):
    status_code: int = Field(description="HTTP status code")
    data: Optional[T] = Field(default=None, description="Response data")
    message: str = Field(description="Success message")


def success_response(
    data: Optional[Any] = None, message: str = "Success", status_code: int = 200
) -> tuple[dict, int]:
    """Create a standardized success response"""
    response = SuccessResponse(
        status_code=status_code,
        data=data,
        message=message,
    )
    return response.model_dump(), status_code


def error_response(
    message: str = "An error occurred",
    status_code: int = 400,
    detail: Optional[List[ErrorDetail]] = None,
) -> tuple[dict, int]:
    """Create a standardized error response"""
    response = ErrorResponse(
        status_code=status_code,
        message=message,
        detail=detail or [],
    )
    return response.model_dump(), status_code
