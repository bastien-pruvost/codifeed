from typing import Tuple
from uuid import UUID

from sqlmodel import Session, col
from werkzeug.exceptions import Forbidden, NotFound

from app.models import PaginationMeta, PaginationQuery, Post, User
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
    def get_user_posts(
        session: Session,
        author: User,
        pagination: PaginationQuery,
    ) -> Tuple[list[Post], PaginationMeta]:
        """Get all posts for a specific user with pagination."""
        if not author.id:
            raise ValueError("Author ID is required")

        statement = (
            Post.select_active()
            .where(Post.author_id == author.id)
            .order_by(col(Post.created_at).desc())
        )

        posts, meta = paginate_query(session=session, statement=statement, pagination=pagination)

        return posts, meta

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
