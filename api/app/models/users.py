from sqlmodel import Field

from app.database.models import BaseModel, BaseModelWithId


class UserBase(BaseModel):
    email: str = Field(unique=True, index=True, max_length=255)
    firstname: str = Field(max_length=255)
    lastname: str = Field(max_length=255)
    avatar: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    password: str = Field(max_length=255)


class UserUpdate(UserBase):
    pass


class UserRead(UserBase):
    id: str


class User(UserBase, BaseModelWithId, table=True):
    hashed_password: str = Field(max_length=255)

    def to_read_model(self) -> UserRead:
        """Convert User to safe dict for API responses, excluding sensitive fields."""
        user_dict = self.model_dump(exclude={"hashed_password"})
        return UserRead(**user_dict)
