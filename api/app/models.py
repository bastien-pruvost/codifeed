from datetime import date
from uuid import UUID, uuid4

from pydantic.alias_generators import to_camel
from sqlmodel import Field, Relationship, SQLModel

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
        unique=True,
        default=None,
    )
    user: "User" = Relationship(back_populates="profile")


# ------ User ------


class UserBase(ApiBaseModel):
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=255)
    avatar: str | None = Field(default=None, max_length=255)


class UserRead(UserBase):
    id: UUID


class UserReadWithProfile(UserRead):
    profile: ProfileBase


class UserCreate(UserBase):
    password: str = Field(max_length=255)


class UserUpdate(UserBase):
    pass


class User(UserBase, table=True):
    id: UUID = Field(
        primary_key=True,
        default_factory=uuid4,
        unique=True,
    )
    hashed_password: str = Field(max_length=255)
    profile: Profile = Relationship(
        back_populates="user",
        cascade_delete=True,
    )


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
