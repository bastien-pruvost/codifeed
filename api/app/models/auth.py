from app.models import CamelModel


class AuthLogin(CamelModel):
    email: str
    password: str


class AuthToken(CamelModel):
    access_token: str
    refresh_token: str
