from sqlmodel import SQLModel


class AuthLogin(SQLModel):
    email: str
    password: str


class AuthToken(SQLModel):
    access_token: str
    refresh_token: str
