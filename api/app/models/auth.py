from app.models import BaseModel


class AuthLogin(BaseModel):
    email: str
    password: str


class AuthToken(BaseModel):
    access_token: str
    refresh_token: str
