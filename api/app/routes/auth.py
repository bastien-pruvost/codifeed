from argon2 import exceptions as argon_exceptions
from flask import make_response
from flask_jwt_extended import (
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from werkzeug.exceptions import BadRequest, Unauthorized

from app.models.auth import (
    LoginCredentials,
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
    SignupResponse,
)
from app.models.users import UserCreate
from app.services.auth import AuthService
from app.services.users import UserService
from app.utils.jwt import refresh_required
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
    try:
        user = AuthService.verify_credentials(body.email, body.password)
        if not user:
            raise BadRequest(description="Invalid email or password")

        # Create response with tokens
        response_data = LoginResponse(user=user.to_read_model())
        tokens = AuthService.create_tokens(user.id)
        response = make_response(response_data.model_dump())
        set_access_cookies(response, tokens.access_token)
        set_refresh_cookies(response, tokens.refresh_token)
        return response
    except (
        argon_exceptions.VerifyMismatchError,
        argon_exceptions.InvalidHashError,
        argon_exceptions.VerificationError,
    ) as error:
        raise BadRequest(description="Invalid email or password") from error


@auth_router.post(
    "/auth/refresh",
    responses={200: RefreshResponse},
    description="Refresh a user's tokens (access and refresh)",
)
@refresh_required
def refresh():
    # Get user from token
    user_id = AuthService.get_current_user_id()
    user = UserService.get_by_id(user_id)

    if not user:
        raise Unauthorized(description="User not found")

    # Generate new tokens
    tokens = AuthService.create_tokens(user_id)
    response_data = RefreshResponse(user=user.to_read_model())

    # Create response with new tokens
    response = make_response(response_data.model_dump())
    set_access_cookies(response, tokens.access_token)
    set_refresh_cookies(response, tokens.refresh_token)

    return response


@auth_router.post(
    "/auth/logout",
    responses={200: LogoutResponse},
    description="Logout a user by clearing cookies",
)
def logout():
    response_data = LogoutResponse()
    response = make_response(response_data.model_dump())
    unset_jwt_cookies(response)
    return response
