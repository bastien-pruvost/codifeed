from flask import make_response
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag

from app.database.models import BaseModel, MessageResponse

posts_tag = Tag(name="Posts", description="Posts routes")
posts_router = APIBlueprint("posts", __name__, abp_tags=[posts_tag])


class GetPostsQuery(BaseModel):
    # page: int = 1
    # limit: int = 10
    user_id: int | None = None


@posts_router.get(
    "/posts",
    responses={200: MessageResponse},
    description="Get all posts",
    security=[{"cookieAuth": []}],
)
@jwt_required()
def get_posts(query: GetPostsQuery):
    user_id = get_jwt_identity()
    return make_response(
        MessageResponse(message=f"Posts fetched successfully by {user_id}").model_dump()
    )
