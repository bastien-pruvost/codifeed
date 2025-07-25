import uuid

from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from pydantic import BaseModel

from app.database.session import get_session
from app.models.users import User, UserRead
from app.utils.responses import error_response, success_response

users_tag = Tag(name="User", description="User routes")
users_router = APIBlueprint("user", __name__, abp_tags=[users_tag])


class GetUserPath(BaseModel):
    user_id: int


@users_router.get(
    "/users/me",
    responses={200: UserRead},
    description="Get the current user",
)
@jwt_required()
def me():
    user_id = get_jwt_identity()
    with get_session() as session:
        user = session.get(User, uuid.UUID(user_id))
        if not user:
            return error_response("User not found", 404)
        return success_response(user.model_dump(exclude={"hashed_password"}), 200)


@users_router.get(
    "/users/<int:user_id>",
    responses={200: UserRead},
    description="Get a user by id",
)
def get_user(path: GetUserPath):
    with get_session() as session:
        user = session.get(User, path.user_id)
        if not user:
            return error_response("User not found", 404)
        return success_response(user.model_dump(exclude={"hashed_password"}), 200)
