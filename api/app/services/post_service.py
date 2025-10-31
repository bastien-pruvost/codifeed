from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, col, func, or_, select
from werkzeug.exceptions import Forbidden, NotFound

from app.models import (
    PaginationMeta,
    PaginationQuery,
    Post,
    PostLike,
    PostPublic,
    User,
    UserFollow,
)
from app.utils.pagination import paginate_query


class PostService:
    """Service responsible for all post-related business logic."""

    @staticmethod
    def create_post(
        session: Session,
        author: User,
        content: str,
    ) -> Post:
        """Create a new post."""
        if not author.id:
            raise ValueError("Author ID is required")

        post = Post(content=content, author_id=author.id)
        session.add(post)
        session.commit()
        session.refresh(post)

        return post

    @staticmethod
    def delete_post(session: Session, post_id: UUID, current_user_id: UUID) -> Post:
        """Delete a post."""
        post = session.get(Post, post_id)
        if not post:
            raise NotFound(description="Post not found")

        if post.author_id != current_user_id:
            raise Forbidden(description="You are not allowed to delete this post")

        post.soft_delete()
        session.commit()

        return post

    # @staticmethod
    # def _build_likes_for_posts_statement(
    #     base_statement: SelectOfScalar[Post],
    #     current_user_id: UUID,
    # ):
    #     """Return a select statement enriched with likes count and is_liked flags."""

    @staticmethod
    def get_user_posts(
        session: Session,
        current_user_id: UUID,
        author: User,
        pagination: PaginationQuery,
    ) -> tuple[list[PostPublic], PaginationMeta]:
        """Get all posts for a specific user with pagination."""
        if not author.id:
            raise ValueError("Author ID is required")

        statement = (
            select(
                Post,
                func.count(col(PostLike.user_id)).label("likes_count"),
                func.coalesce(func.bool_or(PostLike.user_id == current_user_id), False).label(
                    "is_liked"
                ),
            )
            .outerjoin(PostLike, col(PostLike.post_id) == col(Post.id))
            .where(col(Post.author_id) == author.id, col(Post.deleted_at).is_(None))
            .group_by(col(Post.id))
            .order_by(col(Post.created_at).desc())
        )
        posts, meta = paginate_query(session=session, statement=statement, pagination=pagination)
        posts_with_likes = [
            PostPublic.model_validate(post).model_copy(
                update={
                    "likes_count": likes_count,
                    "is_liked": is_liked,
                }
            )
            for post, likes_count, is_liked in posts
        ]
        return posts_with_likes, meta

    @staticmethod
    def like_post(session: Session, post_id: UUID, user_id: UUID) -> PostPublic:
        """Like a post idempotently."""
        post = session.get(Post, post_id)
        if not post:
            raise NotFound(description="Post not found")

        if post.is_deleted:
            raise NotFound(description="Post not found")

        post_like = PostLike(post_id=post_id, user_id=user_id)
        try:
            session.add(post_like)
            session.commit()
        except IntegrityError:
            session.rollback()

        session.refresh(post)

        post_public = PostPublic.model_validate(post)

        # enriched = PostService._annotate_likes_for_posts(
        #     session=session,
        #     current_user_id=user_id,
        #     posts=[post],
        # )
        return post_public

    @staticmethod
    def unlike_post(session: Session, post_id: UUID, user_id: UUID) -> PostPublic:
        """Unlike a post idempotently."""
        post = session.get(Post, post_id)
        if not post:
            raise NotFound(description="Post not found")

        if post.is_deleted:
            raise NotFound(description="Post not found")

        statement = select(PostLike).where(PostLike.post_id == post_id, PostLike.user_id == user_id)
        post_like = session.exec(statement).first()

        if not post_like:
            raise NotFound(description="Post not found")

        session.delete(post_like)
        session.commit()

        session.refresh(post)

        post_public = PostPublic.model_validate(post)

        return post_public

    @staticmethod
    def get_feed_posts(
        session: Session,
        current_user_id: UUID,
        pagination: PaginationQuery,
    ) -> tuple[list[PostPublic], PaginationMeta]:
        """Get feed posts from users followed by the current user."""
        statement = (
            select(
                Post,
                func.count(col(PostLike.user_id)).label("likes_count"),
                func.coalesce(func.bool_or(PostLike.user_id == current_user_id), False).label(
                    "is_liked"
                ),
            )
            .outerjoin(PostLike, col(PostLike.post_id) == col(Post.id))
            .outerjoin(UserFollow, col(UserFollow.following_id) == col(Post.author_id))
            .where(
                or_(
                    UserFollow.follower_id == current_user_id,
                    col(Post.author_id) == current_user_id,
                ),
                col(Post.deleted_at).is_(None),
            )
            .group_by(col(Post.id))
            .order_by(col(Post.created_at).desc())
        )

        posts, meta = paginate_query(session=session, statement=statement, pagination=pagination)
        posts_with_likes = [
            PostPublic.model_validate(post).model_copy(
                update={
                    "likes_count": likes_count,
                    "is_liked": is_liked,
                }
            )
            for post, likes_count, is_liked in posts
        ]
        return posts_with_likes, meta
