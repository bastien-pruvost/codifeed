from time import sleep

from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag

from app.database import get_session
from app.models import PaginationQuery, PostCreate, PostList, PostPublic
from app.schemas import UsernamePath
from app.services.post_service import PostService
from app.services.user_service import UserService
from app.utils.jwt import get_current_user_id, login_required
from app.utils.response import abp_responses, success_response

posts_tag = Tag(name="Posts", description="Posts routes")
posts_router = APIBlueprint("posts", __name__, abp_tags=[posts_tag], abp_responses=abp_responses)


@posts_router.post(
    "/posts",
    responses={200: PostPublic},
    description="Create a new post",
)
@login_required
def create_post(body: PostCreate):
    current_user_id = get_current_user_id()
    with get_session() as session:
        author = UserService.get_by_id(session, current_user_id)

        post = PostService.create_post(
            session=session,
            author=author,
            content=body.content,
        )
        post_public = PostPublic.model_validate(post)
        return success_response(post_public.model_dump())


@posts_router.get(
    "/posts/user/<string:username>",
    responses={200: PostList},
    description="Get all posts for a user",
)
@login_required
def get_user_posts(path: UsernamePath, query: PaginationQuery):
    with get_session() as session:
        user = UserService.get_by_username(session, path.username)

        posts, meta = PostService.get_user_posts(
            session=session,
            author=user,
            pagination=query,
        )
        # Wait 5 seconds
        sleep(2)

        post_list = PostList.model_validate({"data": posts, "meta": meta})
        return success_response(post_list.model_dump())
