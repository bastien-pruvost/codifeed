from uuid import UUID

from flask_jwt_extended import get_jwt_identity
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from werkzeug.exceptions import NotFound

from app.database.models import ApiBaseModel
from app.models.users import UserRead
from app.services.users import UserService
from app.utils.jwt import login_required
from app.utils.responses import success_response

users_tag = Tag(name="User", description="User routes")
users_router = APIBlueprint("user", __name__, abp_tags=[users_tag])


class GetUserPath(ApiBaseModel):
    user_id: UUID


@users_router.get(
    "/users/me",
    responses={200: UserRead},
    description="Get the current user",
    security=[{"cookieAuth": []}],
)
@login_required
def me():
    user_id = get_jwt_identity()
    user = UserService.get_by_id(user_id)
    if not user:
        raise NotFound(description="User not found")
    response_data = user.to_read_model()
    return success_response(response_data.model_dump())


@users_router.get(
    "/users/<uuid:user_id>",
    responses={200: UserRead},
    description="Get a user by id",
)
def get_user(path: GetUserPath):
    user = UserService.get_by_id(path.user_id)
    if not user:
        raise NotFound(description="User not found")
    response_data = user.to_read_model()
    return success_response(response_data.model_dump())
