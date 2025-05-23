from typing import Any, List, Optional

from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    loc: List[str] = Field(description="Location of the error")
    msg: str = Field(description="Error message")
    type: str = Field(description="Error type")


class ErrorResponse(BaseModel):
    status_code: int = Field(description="Status code")
    message: str = Field(description="Error message")
    detail: List[ErrorDetail] = Field(description="Error details")


def success_response(
    data: Any,
    status_code: int = 200,
) -> tuple[dict, int]:
    """Create a standardized success response"""
    return data, status_code


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
