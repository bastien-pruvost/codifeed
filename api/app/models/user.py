import uuid

from sqlmodel import Field

from app.models import CamelModel


class UserBase(CamelModel):
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


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(max_length=255)
