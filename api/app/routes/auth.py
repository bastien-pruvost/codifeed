from flask_jwt_extended import jwt_required
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from werkzeug.exceptions import BadRequest

from app.models.auth import (
    LoginCredentials,
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
    SignupResponse,
)
from app.models.users import UserCreate
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.utils.responses import abp_responses, success_response

auth_tag = Tag(name="Auth", description="Authentication routes")
auth_router = APIBlueprint("auth", __name__, abp_tags=[auth_tag], abp_responses=abp_responses)


@auth_router.post(
    "/auth/signup",
    responses={201: SignupResponse},
    description="Create a new user account",
)
def signup(body: UserCreate):
    if UserService.email_exists(body.email):
        raise BadRequest(description="A user with this email already exists")
    user = UserService.create_user(body)
    response_data = SignupResponse(user=user.to_read_model())
    return success_response(response_data.model_dump(), 201)


@auth_router.post(
    "/auth/login",
    responses={200: LoginResponse},
    description="Login a user with email and password",
)
def login(body: LoginCredentials):
    user = UserService.verify_credentials(body.email, body.password)
    if not user:
        raise BadRequest(description="Email or password is incorrect") from None
    response_data = LoginResponse(user=user.to_read_model())
    return AuthService.create_authenticated_response(response_data.model_dump(), user.id)


@auth_router.post(
    "/auth/refresh",
    responses={200: RefreshResponse},
    description="Refresh a user's tokens (access and refresh)",
)
@jwt_required(refresh=True)
def refresh():
    tokens = AuthService.refresh_tokens()
    return AuthService.create_refresh_response(tokens.model_dump())


@auth_router.post(
    "/auth/logout",
    responses={200: LogoutResponse},
    description="Logout a user by clearing cookies",
)
def logout():
    response_data = LogoutResponse()
    return AuthService.create_logout_response(response_data.model_dump())
