from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
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
    id: int | None = Field(default=None, primary_key=True, unique=True)
    hashed_password: str = Field(max_length=255)
