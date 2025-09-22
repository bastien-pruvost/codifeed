from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from sqlmodel import Field
from werkzeug.exceptions import Forbidden, NotFound

from app.database import get_session
from app.models import ApiBaseModel, PaginationQuery, User, UserDetail, UserList, UserPublic
from app.services.user_service import UserService
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
def get_current_user_route():
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
    responses={200: UserDetail},
    description="Get a user detail by username",
)
@login_required
def get_user_detail_route(path: UsernamePath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        response_data = UserService.get_detail_by_username(session, current_user_id, path.username)
        return success_response(response_data.model_dump())


class SearchQuery(PaginationQuery):
    q: str = Field(default="", min_length=1, max_length=255, description="Search query")


@users_router.get(
    "/users/search",
    responses={200: UserList},
    description="Search users by name or username with pagination",
)
@login_required
def search_users_route(query: SearchQuery):
    with get_session() as session:
        current_user_id = get_current_user_id()
        users, meta = UserService.search(
            session=session, current_user_id=current_user_id, query=query.q, pagination=query
        )
        return success_response(UserList.model_validate({"data": users, "meta": meta}).model_dump())


@users_router.delete(
    "/users/<string:username>",
    responses={200: UserPublic},
    description="Delete a user by username",
)
@login_required
def delete_user_route(path: UsernamePath):
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


@users_router.post(
    "/users/<string:username>/follow",
    responses={200: UserDetail},
    description="Follow a user by username",
)
@login_required
def follow_user_route(path: UsernamePath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        response_data = UserService.follow_by_username(
            session=session,
            current_user_id=current_user_id,
            username=path.username,
        )
        return success_response(response_data.model_dump())


@users_router.delete(
    "/users/<string:username>/follow",
    responses={200: UserDetail},
    description="Unfollow a user by username",
)
@login_required
def unfollow_user_route(path: UsernamePath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        response_data = UserService.unfollow_by_username(
            session=session,
            current_user_id=current_user_id,
            username=path.username,
        )
        return success_response(response_data.model_dump())


@users_router.get(
    "/users/<string:username>/followers",
    responses={200: UserList},
    description="List followers of a user (public lists)",
)
@login_required
def get_user_followers_route(path: UsernamePath, query: PaginationQuery):
    with get_session() as session:
        current_user_id = get_current_user_id()
        users, meta = UserService.get_followers_by_username(
            session=session,
            current_user_id=current_user_id,
            username=path.username,
            pagination=query,
        )
        return success_response(UserList.model_validate({"data": users, "meta": meta}).model_dump())


@users_router.get(
    "/users/<string:username>/following",
    responses={200: UserList},
    description="List users that a user is following (public lists)",
)
@login_required
def get_user_following_route(path: UsernamePath, query: PaginationQuery):
    with get_session() as session:
        current_user_id = get_current_user_id()
        users, meta = UserService.get_following_by_username(
            session=session,
            current_user_id=current_user_id,
            username=path.username,
            pagination=query,
        )
        return success_response(UserList.model_validate({"data": users, "meta": meta}).model_dump())
