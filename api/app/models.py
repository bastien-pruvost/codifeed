from datetime import date, datetime, timezone
from uuid import UUID, uuid4

from pydantic import BaseModel, RootModel
from pydantic.alias_generators import to_camel
from sqlmodel import TIMESTAMP, Field, Index, Relationship, SQLModel, col, func, select

# ------ API Base Model -------


class ApiBaseModel(
    BaseModel
):  # Keep BaseModel from pydantic (not SQLModel) to avoid breaking camelCase
    """Base model to be used for all API models (Converts snake_case to camelCase)"""

    model_config = {
        "alias_generator": to_camel,
        "from_attributes": True,
        "validate_by_name": True,
        "validate_by_alias": True,
        "serialize_by_alias": True,
    }


# ------ Mixins -------


class IdMixin(ApiBaseModel):
    id: UUID | None = Field(
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


class SoftDeleteMixin(ApiBaseModel):
    """Base model with soft delete support"""

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
        """Query only non-deleted records"""
        return select(cls).where(col(cls.deleted_at).is_(None))

    @classmethod
    def select_deleted(cls):
        """Query only soft-deleted records"""
        return select(cls).where(col(cls.deleted_at).is_not(None))

    @classmethod
    def select_all(cls):
        """Query all records"""
        return select(cls)


# ------ User ------


class UserBase(ApiBaseModel):
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=255)
    avatar: str | None = Field(default=None, max_length=255)
    # test_field: str | None = Field(default=None, max_length=255)


class UserPublic(UserBase, TimestampsMixin, IdMixin):
    pass


class UserDetail(UserPublic):
    profile: "ProfileBase"


class UsersPublic(RootModel[list[UserPublic]]):
    pass


class UsersDetail(RootModel[list[UserDetail]]):
    pass


class UserCreate(UserBase):
    password: str = Field(max_length=255)


class UserUpdate(UserBase):
    pass


class User(UserBase, SoftDeleteMixin, TimestampsMixin, IdMixin, SQLModel, table=True):
    hashed_password: str = Field(max_length=255)
    profile: "Profile" = Relationship(
        back_populates="user",
        cascade_delete=True,
    )
    posts: list["Post"] = Relationship(back_populates="author")

    __table_args__ = (
        # Index GIN trigram sur les colonnes brutes pour similarité
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


# ------ Profile ------


class ProfileBase(ApiBaseModel):
    bio: str | None = Field(default=None, max_length=255)
    location: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=255)
    birthdate: date | None = Field(default=None)


class Profile(ProfileBase, SQLModel, table=True):
    user_id: UUID | None = Field(
        default=None,
        primary_key=True,
        unique=True,
        foreign_key="user.id",
        ondelete="CASCADE",
    )
    user: User = Relationship(back_populates="profile")


# ------ Post ------


class PostBase(ApiBaseModel):
    content: str = Field(max_length=255)


class PostPublic(PostBase, IdMixin):
    author: "UserPublic"


class Post(PostBase, SoftDeleteMixin, TimestampsMixin, IdMixin, SQLModel, table=True):
    author_id: UUID = Field(foreign_key="user.id")
    author: User = Relationship(back_populates="posts")


# ------ Auth ------


class LoginCredentials(ApiBaseModel):
    email: str
    password: str


class SignupResponse(ApiBaseModel):
    user: UserPublic
    message: str = "Account created successfully."


class LoginResponse(ApiBaseModel):
    user: UserPublic
    message: str = "Logged in successfully."


class RefreshResponse(ApiBaseModel):
    user: UserPublic
    message: str = "Token refreshed successfully."


class LogoutResponse(ApiBaseModel):
    message: str = "Logged out successfully."


# ------ Healthcheck ------


class HealthcheckResponse(ApiBaseModel):
    status: str
