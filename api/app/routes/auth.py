from argon2 import exceptions as argon_exceptions
from flask_jwt_extended import (
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from sqlmodel import select
from werkzeug.exceptions import BadRequest, InternalServerError, Unauthorized

from app.database import get_session
from app.models import (
    ApiBaseModel,
    Profile,
    User,
    UserCreate,
    UserPublic,
)
from app.utils.jwt import create_tokens, get_current_user_id, refresh_required
from app.utils.password import hash_password, verify_password
from app.utils.response import abp_responses, success_response

auth_tag = Tag(name="Auth", description="Authentication routes")
auth_router = APIBlueprint("auth", __name__, abp_tags=[auth_tag], abp_responses=abp_responses)


@auth_router.post(
    "/auth/signup",
    responses={201: UserPublic},
    description="Create a new user account",
)
def signup(body: UserCreate):
    with get_session() as session:
        statement = select(User).where(User.email == body.email)
        existing_user = session.exec(statement).first()

        if existing_user:
            raise BadRequest(description="A user with this email already exists")

        profile = Profile()
        user = User.model_validate(
            body, update={"profile": profile, "hashed_password": hash_password(body.password)}
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        response_data = UserPublic.model_validate(user)
        response = success_response(response_data.model_dump(), 201)

        if not user.id:
            raise InternalServerError(description="Failed to create user: missing id")

        access_token, refresh_token = create_tokens(user.id)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response


class LoginCredentials(ApiBaseModel):
    email: str
    password: str


@auth_router.post(
    "/auth/login",
    responses={200: UserPublic},
    description="Login a user with email and password",
)
def login(body: LoginCredentials):
    try:
        with get_session() as session:
            statement = select(User).where(User.email == body.email)
            user = session.exec(statement).first()

            if not user or not verify_password(body.password, user.hashed_password):
                raise BadRequest(description="Invalid email or password")

            response_data = UserPublic.model_validate(user)
            response = success_response(response_data.model_dump())

            if not user.id:
                raise InternalServerError(description="Failed to login user: missing id")

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
    responses={200: UserPublic},
    description="Refresh a user's tokens (access and refresh)",
)
@refresh_required
def refresh():
    user_id = get_current_user_id()
    with get_session() as session:
        user = session.get(User, user_id)

        if not user:
            raise Unauthorized(description="User not found")

        response_data = UserPublic.model_validate(user)
        response = success_response(response_data.model_dump())

        access_token, refresh_token = create_tokens(user_id)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response


@auth_router.post(
    "/auth/logout",
    responses={200: ApiBaseModel},
    description="Logout a user by clearing cookies",
)
def logout():
    response = success_response({}, 204)
    unset_jwt_cookies(response)
    return response
