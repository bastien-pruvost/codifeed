from flask import make_response
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from passlib.hash import bcrypt
from sqlmodel import select

from app.models import get_session
from app.models.auth import (
    LoginCredentials,
    LoginTokens,
    LogoutResponse,
    RefreshResponse,
)
from app.models.user import User, UserCreate, UserRead
from app.utils.responses import error_response, success_response

auth_tag = Tag(name="Auth", description="Authentication routes")
auth_router = APIBlueprint("auth", __name__, url_prefix="/auth", abp_tags=[auth_tag])


@auth_router.post(
    "/register",
    responses={201: UserRead},
    description="Register a new user",
)
def register(body: UserCreate):
    user = User.model_validate(
        body,
        update={"hashed_password": bcrypt.hash(body.password)},
    )
    for session in get_session():
        existing_user_query = select(User).where(User.email == user.email)
        existing_user = session.exec(existing_user_query).first()
        if existing_user:
            return error_response("User already exists", 400)
        session.add(user)
        session.commit()
        session.refresh(user)
    return success_response(user.model_dump(exclude={"hashed_password"}), 201)


@auth_router.post(
    "/login",
    responses={200: UserRead},
    description="Login a user",
)
def login(body: LoginCredentials):
    for session in get_session():
        user_query = select(User).where(User.email == body.email)
        user = session.exec(user_query).first()
        if not user or not bcrypt.verify(body.password, user.hashed_password):
            return error_response("Email or password is incorrect", 401)
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        response = make_response(
            user.model_dump(exclude={"hashed_password"}),
            200,
        )
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response


@auth_router.post(
    "/refresh",
    responses={200: LoginTokens},
    description="Refresh a user's access token",
)
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    response = make_response(
        RefreshResponse(
            message="Token refreshed",
        ).model_dump(),
        200,
    )
    set_access_cookies(response, access_token)
    return response


@auth_router.post(
    "/logout",
    responses={200: LogoutResponse},
    description="Logout a user",
)
def logout():
    response = make_response(
        LogoutResponse(
            message="Logout successful",
        ).model_dump(),
        200,
    )
    unset_jwt_cookies(response)
    return response
