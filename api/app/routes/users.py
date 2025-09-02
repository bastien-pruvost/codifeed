from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from sqlmodel import select
from werkzeug.exceptions import NotFound

from app.database import get_session
from app.models import ApiBaseModel, User, UserRead, UserReadWithProfile
from app.utils.jwt import get_current_user_id, login_required
from app.utils.response import abp_responses, success_response

users_tag = Tag(name="User", description="User routes")
users_router = APIBlueprint("user", __name__, abp_tags=[users_tag], abp_responses=abp_responses)


@users_router.get(
    "/users/me",
    responses={200: UserRead},
    description="Get the current user",
)
@login_required
def me():
    user_id = get_current_user_id()
    with get_session() as session:
        user = session.get(User, user_id)
        if not user:
            raise NotFound(description="User not found")
        return success_response(UserRead.model_validate(user).model_dump())


class UsernamePath(ApiBaseModel):
    username: str


@users_router.get(
    "/users/<string:username>",
    responses={200: UserRead},
    description="Get a user by username",
)
@login_required
def get_user_by_username(path: UsernamePath):
    with get_session() as session:
        query = select(User).where(User.username == path.username)
        user = session.exec(query).first()
        if not user:
            raise NotFound(description="User not found")
        return success_response(UserRead.model_validate(user).model_dump())


@users_router.get(
    "/users/profile/<string:username>",
    responses={200: UserReadWithProfile},
    description="Get a user with their profile by username",
)
@login_required
def get_user_profile_by_username(path: UsernamePath):
    with get_session() as session:
        query = select(User).where(User.username == path.username)
        user = session.exec(query).first()
        if not user:
            raise NotFound(description="User not found")
        return success_response(UserReadWithProfile.model_validate(user).model_dump())
