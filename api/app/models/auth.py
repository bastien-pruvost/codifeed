from app.database.models import ApiBaseModel
from app.models.users import UserRead


class LoginCredentials(ApiBaseModel):
    email: str
    password: str


class SignupResponse(ApiBaseModel):
    user: UserRead
    message: str = "Account created successfully."


class LoginResponse(ApiBaseModel):
    user: UserRead
    message: str = "Logged in successfully."


class RefreshResponse(ApiBaseModel):
    user: UserRead
    message: str = "Token refreshed successfully."


class LogoutResponse(ApiBaseModel):
    message: str = "Logged out successfully."
