from app.database.models import BaseModel, MessageResponse
from app.models.users import UserRead


class LoginCredentials(BaseModel):
    email: str
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str


class SignupResponse(BaseModel):
    user: UserRead
    message: str = "Account created successfully."


class LoginResponse(BaseModel):
    user: UserRead
    message: str = "Logged in successfully."


class RefreshResponse(BaseModel):
    user: UserRead
    message: str = "Token refreshed successfully."


class LogoutResponse(MessageResponse):
    message: str = "Logged out successfully."
