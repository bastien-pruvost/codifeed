from flask_jwt_extended import (
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag

from app.database import get_session
from app.models import ApiBaseModel, UserCreate, UserPublic
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.utils.jwt import create_tokens, get_current_user_id, refresh_required
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
        user_data = AuthService.create_user(session, body)
        access_token, refresh_token = create_tokens(user_data.id)

        response = success_response(user_data.model_dump(), 201)
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
    with get_session() as session:
        user_data = AuthService.authenticate_user(session, body.email, body.password)
        access_token, refresh_token = create_tokens(user_data.id)

        response = success_response(user_data.model_dump())
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response


@auth_router.post(
    "/auth/refresh",
    responses={200: UserPublic},
    description="Refresh a user's tokens (access and refresh)",
)
@refresh_required
def refresh():
    user_id = get_current_user_id()
    with get_session() as session:
        user_data = UserService.get_by_id(session, user_id)
        access_token, refresh_token = create_tokens(user_data.id)

        response = success_response(user_data.model_dump())
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
