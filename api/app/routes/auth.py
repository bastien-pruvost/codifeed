from argon2 import exceptions as argon_exceptions
from flask_jwt_extended import (
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from sqlmodel import select
from werkzeug.exceptions import BadRequest, Unauthorized

from app.database import get_session
from app.models import (
    LoginCredentials,
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
    SignupResponse,
    User,
    UserCreate,
    UserRead,
)
from app.utils.jwt import create_tokens, get_current_user_id, refresh_required
from app.utils.password import hash_password, verify_password
from app.utils.response import abp_responses, success_response

auth_tag = Tag(name="Auth", description="Authentication routes")
auth_router = APIBlueprint("auth", __name__, abp_tags=[auth_tag], abp_responses=abp_responses)


@auth_router.post(
    "/auth/signup",
    responses={201: SignupResponse},
    description="Create a new user account",
)
def signup(body: UserCreate):
    with get_session() as session:
        if session.exec(select(User).where(User.email == body.email)).first():
            raise BadRequest(description="A user with this email already exists")

        user = User.model_validate(body, update={"hashed_password": hash_password(body.password)})
        session.add(user)
        session.commit()
        session.refresh(user)

    response_data = SignupResponse(user=UserRead.model_validate(user))
    response = success_response(response_data.model_dump(), 201)

    access_token, refresh_token = create_tokens(user.id)
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response


@auth_router.post(
    "/auth/login",
    responses={200: LoginResponse},
    description="Login a user with email and password",
)
def login(body: LoginCredentials):
    try:
        with get_session() as session:
            user = session.exec(select(User).where(User.email == body.email)).first()
        if not user or not verify_password(body.password, user.hashed_password):
            raise BadRequest(description="Invalid email or password")

        response_data = LoginResponse(user=UserRead.model_validate(user))
        response = success_response(response_data.model_dump())

        access_token, refresh_token = create_tokens(user.id)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

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
    user_id = get_current_user_id()
    with get_session() as session:
        user = session.get(User, user_id)

    if not user:
        raise Unauthorized(description="User not found")

    response_data = RefreshResponse(user=UserRead.model_validate(user))
    response = success_response(response_data.model_dump())

    access_token, refresh_token = create_tokens(user_id)
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response


@auth_router.post(
    "/auth/logout",
    responses={200: LogoutResponse},
    description="Logout a user by clearing cookies",
)
def logout():
    response_data = LogoutResponse()
    response = success_response(response_data.model_dump())
    unset_jwt_cookies(response)
    return response
