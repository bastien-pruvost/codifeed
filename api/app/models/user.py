from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(primary_key=True, unique=True, default=None)
    email: str = Field(unique=True)
    password: str
    name: str
    avatar: str | None = None
