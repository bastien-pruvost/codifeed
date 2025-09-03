from datetime import date, datetime, timezone
from uuid import UUID, uuid4

from pydantic.alias_generators import to_camel
from sqlalchemy import func
from sqlmodel import TIMESTAMP, Field, Relationship, SQLModel

# ------ Base Model -------


class ApiBaseModel(SQLModel):
    """Base model to be used for all API models (Converts snake_case to camelCase)"""

    model_config = {
        "alias_generator": to_camel,
        "from_attributes": True,
        "validate_by_name": True,
        "validate_by_alias": True,
        "serialize_by_alias": True,
    }  # type: ignore


# ------ Mixins -------


class IdMixin(ApiBaseModel):
    id: UUID = Field(
        primary_key=True,
        unique=True,
        default_factory=uuid4,
    )


class TimestampsMixin(ApiBaseModel):
    created_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),  # pyright: ignore[reportArgumentType]
        sa_column_kwargs={"nullable": False, "server_default": func.now()},
    )
    updated_at: datetime | None = Field(
        default=None,
        sa_type=TIMESTAMP(timezone=True),  # pyright: ignore[reportArgumentType]
        sa_column_kwargs={"nullable": False, "server_default": func.now(), "onupdate": func.now()},
    )


class SoftDeletableMixin(ApiBaseModel):
    """Base model with soft delete support"""

    deleted_at: datetime | None = Field(
        default=None,
        sa_column_kwargs={"nullable": True},
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


# Utility functions for soft delete queries
def add_soft_delete_queries(model_class):
    """Add soft delete query methods to a soft-deletable model class"""

    @classmethod
    def active_only(cls, session):
        """Query only non-deleted records"""
        from sqlmodel import select

        return session.exec(select(cls).where(cls.deleted_at.is_(None)))

    @classmethod
    def deleted_only(cls, session):
        """Query only soft-deleted records"""
        from sqlmodel import select

        return session.exec(select(cls).where(cls.deleted_at.isnot(None)))

    @classmethod
    def include_deleted(cls, session):
        """Query all records (including soft-deleted)"""
        from sqlmodel import select

        return session.exec(select(cls))

    # Add methods to the model class
    model_class.active_only = active_only
    model_class.deleted_only = deleted_only
    model_class.include_deleted = include_deleted
    return model_class


# ------ User ------


class UserBase(ApiBaseModel):
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=255)
    avatar: str | None = Field(default=None, max_length=255)


class UserRead(UserBase):
    id: UUID


class UserReadWithProfile(UserRead):
    profile: "ProfileBase"


class UserCreate(UserBase):
    password: str = Field(max_length=255)


class UserUpdate(UserBase):
    pass


@add_soft_delete_queries
class User(UserBase, SoftDeletableMixin, TimestampsMixin, IdMixin, table=True):
    hashed_password: str = Field(max_length=255)
    profile: "Profile" = Relationship(
        back_populates="user",
        cascade_delete=True,
    )
    posts: list["Post"] = Relationship(back_populates="author")


# ------ Profile ------


class ProfileBase(ApiBaseModel):
    bio: str | None = Field(default=None, max_length=255)
    location: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=255)
    birthdate: date | None = Field(default=None)


class Profile(ProfileBase, table=True):
    user_id: UUID | None = Field(
        primary_key=True,
        foreign_key="user.id",
        ondelete="CASCADE",
        unique=True,
        default=None,
    )
    user: User = Relationship(back_populates="profile")


# ------ Post ------


class PostBase(ApiBaseModel):
    content: str = Field(max_length=255)


class PostRead(PostBase):
    id: UUID
    author: "UserRead"


# @add_soft_delete_queries
class Post(PostBase, TimestampsMixin, IdMixin, table=True):
    author_id: UUID | None = Field(foreign_key="user.id")
    author: User = Relationship(back_populates="posts")


# ------ Auth ------


class LoginCredentials(ApiBaseModel):
    email: str
    password: str


class SignupResponse(ApiBaseModel):
    user: UserRead
    message: str = "Account created successfully."


class LoginResponse(ApiBaseModel):
    user: UserRead
    message: str = "Logged in successfully."


class RefreshResponse(ApiBaseModel):
    user: UserRead
    message: str = "Token refreshed successfully."


class LogoutResponse(ApiBaseModel):
    message: str = "Logged out successfully."


# ------ Healthcheck ------


class HealthcheckResponse(ApiBaseModel):
    status: str
