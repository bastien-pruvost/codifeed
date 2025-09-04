from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from sqlmodel import Field, col, select
from werkzeug.exceptions import Forbidden, NotFound

from app.database import get_session
from app.models import (
    ApiBaseModel,
    User,
    UserDetail,
    UserPublic,
    UsersPublic,
)
from app.utils.jwt import get_current_user_id, login_required
from app.utils.response import abp_responses, success_response

users_tag = Tag(name="User", description="User routes")
users_router = APIBlueprint("user", __name__, abp_tags=[users_tag], abp_responses=abp_responses)


@users_router.get(
    "/users/me",
    responses={200: UserPublic},
    description="Get the current user",
)
@login_required
def me():
    user_id = get_current_user_id()
    with get_session() as session:
        user = session.get(User, user_id)

        if not user:
            raise NotFound(description="User not found")

        if user.is_deleted:
            raise NotFound(
                description="Your account has been deleted. \
                Please contact support if you believe this is an error."
            )

        return success_response(UserPublic.model_validate(user).model_dump())


class UsernamePath(ApiBaseModel):
    username: str


@users_router.get(
    "/users/<string:username>",
    responses={200: UserPublic},
    description="Get a user by username",
)
@login_required
def get_user_by_username(path: UsernamePath):
    with get_session() as session:
        statement = select(User).where(User.username == path.username)
        user = session.exec(statement).first()

        if not user:
            raise NotFound(description="User not found")

        if user.is_deleted:
            raise NotFound(
                description="This account has been deleted. \
                Please contact support if you believe this is an error."
            )

        return success_response(UserPublic.model_validate(user).model_dump())


@users_router.get(
    "/users/profile/<string:username>",
    responses={200: UserDetail},
    description="Get a user (with their profile) by username",
)
@login_required
def get_user_profile_by_username(path: UsernamePath):
    with get_session() as session:
        statement = select(User).where(User.username == path.username)
        user = session.exec(statement).first()

        if not user:
            raise NotFound(description="User not found")

        return success_response(UserDetail.model_validate(user).model_dump())


class SearchQuery(ApiBaseModel):
    q: str = Field(default="", min_length=1, max_length=255, description="Search query")


# Search a user by username for search suggestions
@users_router.get(
    "/users/search",
    responses={200: UsersPublic},
    description="Search users by name or username",
)
@login_required
def search_user_by_username(query: SearchQuery):
    with get_session() as session:
        statement = select(User).filter(col(User.username).match(query.q))
        users = session.exec(statement).all()

        return success_response(UsersPublic.model_validate(users).model_dump())


@users_router.delete(
    "/users/<string:username>",
    responses={200: UserPublic},
    description="Delete a user by username",
)
@login_required
def delete_user_by_username(path: UsernamePath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        user = session.get(User, current_user_id)

        if not user:
            raise NotFound(description="User not found")

        if user.username != path.username:
            raise Forbidden(description="You are not allowed to delete this user")

        user.soft_delete()
        session.commit()

        return success_response(UserPublic.model_validate(user).model_dump())
