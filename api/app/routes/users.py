from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from sqlmodel import Field

from app.database import get_session
from app.models import ApiBaseModel, PaginationQuery, UserDetail, UserList, UserPublic
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
        user_data = UserService.get_by_id(session, user_id)
        return success_response(user_data.model_dump())


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
    current_user_id = get_current_user_id()
    with get_session() as session:
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
        user_data = UserService.delete_by_id(session, current_user_id, path.username)
        return success_response(user_data.model_dump())


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
    current_user_id = get_current_user_id()
    with get_session() as session:
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
    current_user_id = get_current_user_id()
    with get_session() as session:
        users, meta = UserService.get_following_by_username(
            session=session,
            current_user_id=current_user_id,
            username=path.username,
            pagination=query,
        )
        return success_response(UserList.model_validate({"data": users, "meta": meta}).model_dump())
