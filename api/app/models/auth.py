from app.database.models import BaseModel, MessageResponse


class LoginCredentials(BaseModel):
    email: str
    password: str


class LoginTokens(BaseModel):
    access_token: str
    refresh_token: str


class LoginResponse(MessageResponse):
    pass


class RefreshResponse(MessageResponse):
    pass


class LogoutResponse(MessageResponse):
    pass
