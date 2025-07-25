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
    id: int


class User(UserBase, BaseModelWithId, table=True):
    hashed_password: str = Field(max_length=255)
