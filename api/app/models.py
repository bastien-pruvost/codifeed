"""Domain models and database tables.

This module contains all domain-related models:
- Database tables (User, Post, Profile, UserFollow, PostLike, etc.)
- Domain entity models (UserPublic, PostPublic, PostDetail, UserDetail, etc.)
- Create/Update models (UserCreate, PostCreate)
- Base models and mixins (UserBase, PostBase, IdMixin, etc.)
- Infrastructure models (PaginatedList, PaginationQuery, etc.)
"""

import re
from datetime import date, datetime, timezone
from typing import Any, Generic, TypeVar
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, field_validator
from pydantic.alias_generators import to_camel
from sqlmodel import TIMESTAMP, Field, Index, Relationship, SQLModel, col, func, select

T = TypeVar("T")

# ------ API Base Model -------


class ApiBaseModel(BaseModel):
    """Base model to be used for all API models (Converts snake_case to camelCase)"""

    model_config = {
        "alias_generator": to_camel,
        "from_attributes": True,
        "validate_by_name": True,
        "validate_by_alias": True,
        "serialize_by_alias": True,
    }

    def model_dump(self, *args, **kwargs) -> dict[str, Any]:
        # Security to never expose password fields
        sensitive_fields = {"hashed_password", "password"}
        for field in sensitive_fields:
            kwargs.pop(field, None)

        # Ensure by_alias is True when not specified
        if "by_alias" not in kwargs:
            return super().model_dump(*args, **kwargs, by_alias=True)
        else:
            return super().model_dump(*args, **kwargs)


# ------ Mixins -------


class IdMixin(ApiBaseModel):
    id: UUID | None = Field(
        primary_key=True,
        unique=True,
        default_factory=uuid4,
    )


class CreatedAtMixin(ApiBaseModel):
    created_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),  # pyright: ignore[reportArgumentType]
        sa_column_kwargs={"nullable": False, "server_default": func.now()},
    )


class UpdatedAtMixin(ApiBaseModel):
    updated_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),  # pyright: ignore[reportArgumentType]
        sa_column_kwargs={"nullable": True, "onupdate": func.now()},
    )


class TimestampsMixin(UpdatedAtMixin, CreatedAtMixin):
    pass


class SoftDeleteMixin(ApiBaseModel):
    deleted_at: datetime | None = Field(
        default=None,
        index=True,
    )

    def soft_delete(self) -> None:
        """Mark this record as deleted by setting deleted_at timestamp"""
        self.deleted_at = datetime.now(timezone.utc)

    def restore(self) -> None:
        """Restore a soft-deleted record by clearing deleted_at timestamp"""
        self.deleted_at = None

    @property
    def is_deleted(self) -> bool:
        """Check if this record is soft-deleted"""
        return self.deleted_at is not None

    @classmethod
    def select_active(cls):
        """Build a select for active (non-deleted) records."""
        return select(cls).where(col(cls.deleted_at).is_(None))

    @classmethod
    def select_deleted(cls):
        """Build a select for only soft-deleted records."""
        return select(cls).where(col(cls.deleted_at).is_not(None))


# ------ Pagination ------


class PaginationQuery(ApiBaseModel):
    page: int = Field(
        default=1,
        ge=1,
        description="Page number",
    )
    items_per_page: int = Field(
        default=24,
        ge=1,
        le=2400,
        description="Number of items per page",
    )


class PaginationMeta(PaginationQuery):
    total_count: int
    has_more: bool


class PaginatedList(ApiBaseModel, Generic[T]):
    data: list[T]
    meta: PaginationMeta


# ------ User ------


class UserBase(ApiBaseModel):
    name: str = Field(
        min_length=2,
        max_length=50,
    )
    username: str = Field(
        unique=True,
        index=True,
        min_length=3,
        max_length=50,
    )
    email: EmailStr = Field(
        unique=True,
        index=True,
        max_length=255,
    )
    avatar: str | None = Field(
        default=None,
        max_length=255,
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[A-Za-z0-9_-]+$", v):
            raise ValueError(
                "Username must contain only letters, numbers, hyphens, and underscores"
            )
        if not re.match(r"^[A-Za-z]", v):
            raise ValueError("Username must start with a letter")
        return v


class User(UserBase, SoftDeleteMixin, TimestampsMixin, IdMixin, SQLModel, table=True):
    hashed_password: str = Field(
        min_length=8,
        max_length=255,
    )

    profile: "Profile" = Relationship(
        back_populates="user",
        cascade_delete=True,
    )
    posts: list["Post"] = Relationship(back_populates="author")

    # Links to follow relationships (self-referential via link model)
    following_links: list["UserFollow"] = Relationship(
        back_populates="follower",
        cascade_delete=True,
        sa_relationship_kwargs={"foreign_keys": "[UserFollow.follower_id]"},
    )
    followers_links: list["UserFollow"] = Relationship(
        back_populates="following",
        cascade_delete=True,
        sa_relationship_kwargs={"foreign_keys": "[UserFollow.following_id]"},
    )

    # Many-to-many: posts liked by this user
    liked_posts: list["PostLike"] = Relationship(
        back_populates="user",
    )

    # Indexes for search
    __table_args__ = (
        Index(
            "ix_user_username_trgm",
            "username",
            postgresql_using="gin",
            postgresql_ops={"username": "gin_trgm_ops"},
        ),
        Index(
            "ix_user_name_trgm",
            "name",
            postgresql_using="gin",
            postgresql_ops={"name": "gin_trgm_ops"},
        ),
    )


class UserPublic(UserBase, TimestampsMixin):
    id: UUID
    is_following: bool = False
    is_followed_by: bool = False
    followers_count: int = Field(
        default=0,
        ge=0,
    )
    following_count: int = Field(
        default=0,
        ge=0,
    )


class UserList(PaginatedList[UserPublic]):
    pass


class UserDetail(UserPublic):
    profile: "ProfileBase"


class UserCreate(UserBase):
    password: str = Field(
        min_length=8,
        max_length=255,
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength requirements"""
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[^A-Za-z0-9]", v):
            raise ValueError("Password must contain at least one special character")
        return v


# ------ Profile (User Profile) ------


class ProfileBase(ApiBaseModel):
    bio: str | None = Field(
        default=None,
        max_length=255,
    )
    location: str | None = Field(
        default=None,
        max_length=255,
    )
    website: str | None = Field(
        default=None,
        max_length=255,
    )
    birthdate: date | None = Field(
        default=None,
    )


class Profile(ProfileBase, SQLModel, table=True):
    user_id: UUID | None = Field(
        primary_key=True,
        unique=True,
        default=None,
        foreign_key="user.id",
        ondelete="CASCADE",
    )

    user: User = Relationship(
        back_populates="profile",
    )


# ------ Post ------


class PostBase(ApiBaseModel):
    content: str = Field(
        min_length=1,
        max_length=1024,
    )


class Post(PostBase, SoftDeleteMixin, TimestampsMixin, IdMixin, SQLModel, table=True):
    author_id: UUID = Field(
        foreign_key="user.id",
    )

    author: User = Relationship(
        back_populates="posts",
    )

    # Many-to-many: users who liked this post
    liked_by_users: list["PostLike"] = Relationship(
        back_populates="post",
    )


class PostPublic(PostBase, TimestampsMixin):
    id: UUID
    author: UserPublic
    likes_count: int = Field(
        default=0,
        ge=0,
    )
    is_liked: bool = False


class PostDetail(PostPublic):
    likes: list[UserPublic]


class PostList(PaginatedList[PostPublic]):
    pass


class PostCreate(PostBase):
    pass


# ------ UserFollow (User Self Reference) ------


class UserFollow(CreatedAtMixin, SQLModel, table=True):
    __tablename__: str = "user_follow"

    follower_id: UUID = Field(
        primary_key=True,
        foreign_key="user.id",
        ondelete="CASCADE",
    )
    following_id: UUID = Field(
        primary_key=True,
        foreign_key="user.id",
        ondelete="CASCADE",
    )

    follower: User = Relationship(
        back_populates="following_links",
        sa_relationship_kwargs={"foreign_keys": "[UserFollow.follower_id]"},
    )
    following: User = Relationship(
        back_populates="followers_links",
        sa_relationship_kwargs={"foreign_keys": "[UserFollow.following_id]"},
    )

    __table_args__ = (
        Index("ix_user_follow_following_id_created_at", "following_id", "created_at"),
        Index("ix_user_follow_follower_id_created_at", "follower_id", "created_at"),
    )


# ------ PostLike (Post <-> User Link for Likes) ------


class PostLike(CreatedAtMixin, SQLModel, table=True):
    __tablename__: str = "post_like"

    user_id: UUID = Field(
        primary_key=True,
        foreign_key="user.id",
        ondelete="CASCADE",
    )
    post_id: UUID = Field(
        primary_key=True,
        foreign_key="post.id",
        ondelete="CASCADE",
    )

    user: User = Relationship(
        back_populates="liked_posts",
    )
    post: Post = Relationship(
        back_populates="liked_by_users",
    )

    __table_args__ = (
        Index("ix_post_like_post_id_created_at", "post_id", "created_at"),
        Index("ix_post_like_user_id_created_at", "user_id", "created_at"),
    )
