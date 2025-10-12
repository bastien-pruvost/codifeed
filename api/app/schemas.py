"""API schemas for route validation (pure API layer, not domain models).

This module contains API-specific schemas that do NOT represent business entities:
- Path parameters (UserIdPath, UsernamePath)
- Query parameters (SearchQuery)
- Route-specific request bodies (LoginCredentials)
"""

from uuid import UUID

from pydantic import BaseModel, Field

from app.models import ApiBaseModel, PaginationQuery

# ------ Path Parameters ------


class UserIdPath(BaseModel):
    user_id: UUID


class UsernamePath(BaseModel):
    username: str


class PostIdPath(BaseModel):
    post_id: UUID


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
