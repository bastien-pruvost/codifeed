# from flask_jwt_extended import get_jwt_identity
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag

from app.utils.response import abp_responses

# from app.database.models import ApiBaseModel
# from app.utils.jwt import login_required
# from app.utils.responses import success_response

posts_tag = Tag(name="Posts", description="Posts routes")
posts_router = APIBlueprint("posts", __name__, abp_tags=[posts_tag], abp_responses=abp_responses)


# class GetPostsQuery(ApiBaseModel):
#     # page: int = 1
#     # limit: int = 10
#     user_id: int | None = None


# @posts_router.get(
#     "/posts",
#     responses={200: MessageResponse},
#     description="Get all posts",
#     security=[{"cookieAuth": []}],
# )
# @login_required
# def get_posts(query: GetPostsQuery):
#     user_id = get_jwt_identity()
#     return success_response(
#         MessageResponse(message=f"Posts fetched successfully by {user_id}").model_dump()
#     )
