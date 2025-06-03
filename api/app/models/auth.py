from app.models import BaseModel


class LoginCredentials(BaseModel):
    email: str
    password: str


class LoginTokens(BaseModel):
    access_token: str
    refresh_token: str
