from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag
from pydantic import BaseModel

from app.models import get_session
from app.models.user import User, UserRead
from app.utils.responses import error_response, success_response

user_tag = Tag(name="User", description="User routes")
user_router = APIBlueprint("user", __name__, url_prefix="/users", abp_tags=[user_tag])


class GetUserPath(BaseModel):
    user_id: int


@user_router.get("/<int:user_id>", responses={200: UserRead})
def get_user(path: GetUserPath):
    for session in get_session():
        user = session.get(User, path.user_id)
        if not user:
            return error_response("User not found", 404)
        return success_response(user.model_dump(exclude={"hashed_password"}), 200)
