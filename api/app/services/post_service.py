from typing import Tuple
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, col, func, select
from werkzeug.exceptions import Forbidden, NotFound

from app.models import (
    PaginationMeta,
    PaginationQuery,
    Post,
    PostLike,
    PostPublic,
    User,
    UserPublic,
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

    @staticmethod
    def _get_likes_info(
        session: Session, current_user_id: UUID, post_ids: list[UUID]
    ) -> tuple[dict[UUID, int], set[UUID]]:
        """Get likes count and liked status for a list of posts."""
        # Get likes count for each post
        likes_count_statement = (
            select(PostLike.post_id, func.count("*").label("count"))
            .where(col(PostLike.post_id).in_(post_ids))
            .group_by(col(PostLike.post_id))
        )
        likes_count_results = session.exec(likes_count_statement).all()
        likes_count_map = {post_id: count for post_id, count in likes_count_results}

        # Check which posts are liked by current user
        liked_post_ids_statement = select(PostLike.post_id).where(
            PostLike.user_id == current_user_id,
            col(PostLike.post_id).in_(post_ids),
        )
        liked_post_ids = set(session.exec(liked_post_ids_statement).all())

        return likes_count_map, liked_post_ids

    @staticmethod
    def _annotate_likes_for_posts(
        session: Session,
        current_user_id: UUID,
        posts: list[Post],
    ) -> list[PostPublic]:
        """Return PostPublic list enriched with likes count and is_liked flags."""
        if not posts:
            return []

        post_ids = [p.id for p in posts if p.id is not None]
        if not post_ids:
            return [PostPublic.model_validate(p) for p in posts]

        likes_count_map, liked_post_ids = PostService._get_likes_info(
            session, current_user_id, post_ids
        )

        result: list[PostPublic] = []
        for post in posts:
            if post.id is None:
                continue

            likes_count = likes_count_map.get(post.id, 0)
            is_liked = bool(post.id in liked_post_ids)

            # Convert author to UserPublic
            author_public = UserPublic.model_validate(post.author)

            result.append(
                PostPublic.model_validate(post).model_copy(
                    update={
                        "likes_count": int(likes_count),
                        "is_liked": is_liked,
                        "author": author_public,
                    }
                )
            )

        return result

    @staticmethod
    def get_user_posts(
        session: Session,
        current_user_id: UUID,
        author: User,
        pagination: PaginationQuery,
    ) -> Tuple[list[PostPublic], PaginationMeta]:
        """Get all posts for a specific user with pagination."""
        if not author.id:
            raise ValueError("Author ID is required")

        statement = (
            Post.select_active()
            .where(Post.author_id == author.id)
            .order_by(col(Post.created_at).desc())
        )

        posts, meta = paginate_query(session=session, statement=statement, pagination=pagination)
        enriched = PostService._annotate_likes_for_posts(
            session=session, current_user_id=current_user_id, posts=posts
        )

        return enriched, meta

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

        # Enrich and return with likes_count and is_liked
        enriched = PostService._annotate_likes_for_posts(
            session=session,
            current_user_id=user_id,
            posts=[post],
        )
        return enriched[0]

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

        enriched = PostService._annotate_likes_for_posts(session, user_id, [post])

        return enriched[0]
