from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.tag import Tag

from app.database import get_session
from app.models import PaginationQuery, PostCreate, PostList, PostPublic
from app.schemas import PostIdPath, UsernamePath
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

        # Enrich with likes info
        enriched = PostService._annotate_likes_for_posts(
            session=session,
            current_user_id=current_user_id,
            posts=[post],
        )

        return success_response(enriched[0].model_dump())


@posts_router.get(
    "/posts/user/<string:username>",
    responses={200: PostList},
    description="Get all posts for a user",
)
@login_required
def get_user_posts(path: UsernamePath, query: PaginationQuery):
    current_user_id = get_current_user_id()
    with get_session() as session:
        user = UserService.get_by_username(session, path.username)

        posts, meta = PostService.get_user_posts(
            session=session,
            current_user_id=current_user_id,
            author=user,
            pagination=query,
        )

        post_list = PostList.model_validate({"data": posts, "meta": meta})
        return success_response(post_list.model_dump())


@posts_router.delete(
    "/posts/<uuid:post_id>",
    responses={200: PostPublic},
    description="Delete a post",
)
@login_required
def delete_post(path: PostIdPath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        post = PostService.delete_post(session, path.post_id, current_user_id)

        # Enrich with likes info
        enriched = PostService._annotate_likes_for_posts(
            session=session,
            current_user_id=current_user_id,
            posts=[post],
        )

        return success_response(enriched[0].model_dump())


@posts_router.post(
    "/posts/<uuid:post_id>/like",
    responses={200: PostPublic},
    description="Like a post",
)
@login_required
def like_post(path: PostIdPath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        post_public = PostService.like_post(session, path.post_id, current_user_id)
        return success_response(post_public.model_dump())


@posts_router.delete(
    "/posts/<uuid:post_id>/like",
    responses={200: PostPublic},
    description="Unlike a post",
)
@login_required
def unlike_post(path: PostIdPath):
    current_user_id = get_current_user_id()
    with get_session() as session:
        post_public = PostService.unlike_post(session, path.post_id, current_user_id)
        return success_response(post_public.model_dump())
