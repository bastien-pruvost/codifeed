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
#     page: int = 1
#     user_id: int | None = None


# @posts_router.get(
#     "/posts",
#     responses={200: PostRead},
#     description="Get all posts",
# )
# @login_required
# def get_posts(query: GetPostsQuery, user: User):
#     return success_response(PostRead.model_validate(user.posts).model_dump())
