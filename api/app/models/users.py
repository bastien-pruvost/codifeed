from sqlmodel import Field

from app.database.models import ApiBaseModel, SQLModelWithId


class UserBase(ApiBaseModel):
    email: str = Field(unique=True, index=True, max_length=255)
    firstname: str = Field(max_length=255)
    lastname: str = Field(max_length=255)
    avatar: str | None = Field(default=None, max_length=255)
    test_field: str = Field(default="test")


class UserCreate(UserBase):
    password: str = Field(max_length=255)


class UserUpdate(UserBase):
    pass


class UserRead(UserBase):
    id: str


class User(UserBase, SQLModelWithId, table=True):
    hashed_password: str = Field(max_length=255)

    def to_read_model(self) -> UserRead:
        """Convert User to safe dict for API responses, excluding sensitive fields."""
        user_read = self.model_dump(exclude={"hashed_password"})
        return UserRead.model_validate(user_read)
