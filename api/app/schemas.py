"""API schemas for route validation (pure API layer, not domain models).

This module contains API-specific schemas that do NOT represent business entities:
- Path parameters (UserIdPath, UsernamePath)
- Query parameters (SearchQuery)
- Route-specific request bodies (LoginCredentials)
"""

from uuid import UUID

from pydantic import Field

from app.models import ApiBaseModel, PaginationQuery

# ------ Path Parameters ------


class UserIdPath(ApiBaseModel):
    user_id: UUID


class UsernamePath(ApiBaseModel):
    username: str


# ------ Query Parameters ------


class SearchQuery(PaginationQuery):
    q: str = Field(
        default="",
        min_length=1,
        max_length=255,
        description="Search query",
    )


# ------ Request Bodies (Route-Specific) ------


class LoginCredentials(ApiBaseModel):
    email: str
    password: str
