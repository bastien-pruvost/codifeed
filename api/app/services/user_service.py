from __future__ import annotations

from typing import Tuple
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, case, col, func, or_, select
from werkzeug.exceptions import BadRequest, NotFound

from app.models import (
    PaginationMeta,
    PaginationQuery,
    User,
    UserDetail,
    UserFollow,
    UserPublic,
)
from app.utils.pagination import paginate_query


class UserService:
    @staticmethod
    def _annotate_follow_flags_for_users(
        session: Session,
        current_user_id: UUID,
        users: list[User],
    ) -> list[UserPublic]:
        """Return UserPublic list enriched with follow flags relative to current user."""
        if not users:
            return []

        user_ids = [u.id for u in users if u.id is not None]
        if not user_ids:
            return [UserPublic.model_validate(u) for u in users]

        # Which listed users are followed by current user?
        following_ids_statement = select(UserFollow.following_id).where(
            UserFollow.follower_id == current_user_id,
            col(UserFollow.following_id).in_(user_ids),
        )
        following_ids = set(session.exec(following_ids_statement).all())

        # Which listed users follow the current user?
        followed_by_ids_statement = select(UserFollow.follower_id).where(
            UserFollow.following_id == current_user_id,
            col(UserFollow.follower_id).in_(user_ids),
        )
        followed_by_ids = set(session.exec(followed_by_ids_statement).all())

        result: list[UserPublic] = []
        for user in users:
            is_following = bool(user.id in following_ids)
            is_followed_by = bool(user.id in followed_by_ids)
            result.append(
                UserPublic.model_validate(user).model_copy(
                    update={
                        "is_following": is_following,
                        "is_followed_by": is_followed_by,
                    }
                )
            )
        return result

    @staticmethod
    def get_by_username(session: Session, username: str) -> User:
        """Return an active (non-deleted) user by username or raise 404."""
        user = session.exec(select(User).where(col(User.username) == username)).first()
        if not user:
            raise NotFound(description="User not found")
        if user.is_deleted:
            raise NotFound(description="This account has been deleted.")
        return user

    @staticmethod
    def get_detail_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
    ) -> UserDetail:
        """Load a user's public detail with followers/following counts and follow flags."""
        user = UserService.get_by_username(session, username)

        followers_count_statement = (
            select(func.count("*"))
            .select_from(UserFollow)
            .join(User, col(User.id) == UserFollow.follower_id)
            .where(
                UserFollow.following_id == user.id,
                col(User.deleted_at).is_(None),
            )
        )

        following_count_statement = (
            select(func.count("*"))
            .select_from(UserFollow)
            .join(User, col(User.id) == UserFollow.following_id)
            .where(
                UserFollow.follower_id == user.id,
                col(User.deleted_at).is_(None),
            )
        )

        followers_count = session.scalar(followers_count_statement) or 0
        following_count = session.scalar(following_count_statement) or 0

        # Follow flags
        is_following_statement = (
            select(func.count("*"))
            .select_from(UserFollow)
            .where(
                UserFollow.follower_id == current_user_id,
                UserFollow.following_id == user.id,
            )
        )
        is_followed_by_statement = (
            select(func.count("*"))
            .select_from(UserFollow)
            .where(
                UserFollow.follower_id == user.id,
                UserFollow.following_id == current_user_id,
            )
        )

        is_following = (session.scalar(is_following_statement) or 0) > 0
        is_followed_by = (session.scalar(is_followed_by_statement) or 0) > 0

        response_data = UserDetail.model_validate(user).model_copy(
            update={
                "followers_count": int(followers_count or 0),
                "following_count": int(following_count or 0),
                "is_following": bool(is_following),
                "is_followed_by": bool(is_followed_by),
            }
        )

        return response_data

    @staticmethod
    def follow_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
    ) -> UserDetail:
        """Follow a user idempotently and return updated detail."""
        target = UserService.get_by_username(session, username)
        if not target.id:
            raise NotFound(description="User not found")
        if current_user_id == target.id:
            raise BadRequest(description="You cannot follow yourself")

        link = UserFollow(follower_id=current_user_id, following_id=target.id)
        try:
            session.add(link)
            session.commit()
        except IntegrityError:
            session.rollback()

        # Return the updated detail using the optimized query
        return UserService.get_detail_by_username(session, current_user_id, username)

    @staticmethod
    def unfollow_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
    ) -> UserDetail:
        """Unfollow a user and return updated detail; raise 404 if not following."""
        target = UserService.get_by_username(session, username)
        if not target.id:
            raise NotFound(description="User not found")

        link_statement = select(UserFollow).where(
            UserFollow.follower_id == current_user_id,
            UserFollow.following_id == target.id,
        )
        link = session.exec(link_statement).first()
        if not link:
            raise NotFound(description="You are not following this user")

        session.delete(link)
        session.commit()

        return UserService.get_detail_by_username(session, current_user_id, username)

    @staticmethod
    def get_followers_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
        pagination: PaginationQuery,
    ) -> Tuple[list[UserPublic], PaginationMeta]:
        """List followers (active users) of a target user with pagination.

        Returns `UserPublic` enriched with `is_following` and `is_followed_by` flags
        relative to the current user.
        """
        target = UserService.get_by_username(session, username)

        statement = (
            User.select_active()
            .join(UserFollow, col(User.id) == UserFollow.follower_id)
            .where(UserFollow.following_id == target.id)
            .order_by(col(UserFollow.created_at).desc(), col(User.username).asc())
        )
        users, meta = paginate_query(session=session, statement=statement, pagination=pagination)
        enriched = UserService._annotate_follow_flags_for_users(
            session=session, current_user_id=current_user_id, users=users
        )
        return enriched, meta

    @staticmethod
    def get_following_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
        pagination: PaginationQuery,
    ) -> Tuple[list[UserPublic], PaginationMeta]:
        """List users (active) that the target user is following with pagination.

        Returns `UserPublic` enriched with `is_following` and `is_followed_by` flags.
        """
        target = UserService.get_by_username(session, username)

        statement = (
            User.select_active()
            .join(UserFollow, col(User.id) == UserFollow.following_id)
            .where(UserFollow.follower_id == target.id)
            .order_by(col(UserFollow.created_at).desc(), col(User.username).asc())
        )
        users, meta = paginate_query(session=session, statement=statement, pagination=pagination)
        enriched = UserService._annotate_follow_flags_for_users(
            session=session, current_user_id=current_user_id, users=users
        )
        return enriched, meta

    @staticmethod
    def search(
        session: Session,
        current_user_id: UUID,
        query: str,
        pagination: PaginationQuery,
    ) -> Tuple[list[UserPublic], PaginationMeta]:
        """Search users by name/username, ordered by a relevance score.

        Note: We avoid wrapping columns with functions that can negate trigram index usage.
        """
        search_term = query.strip()
        if not search_term:
            raise BadRequest(description="Search query is required")

        # For prefix and exact we can use ILIKE/== directly; similarity uses pg_trgm
        exact_username_condition = User.username == search_term
        exact_name_condition = User.name == search_term
        prefix_username_condition = col(User.username).ilike(search_term + "%")
        prefix_name_condition = col(User.name).ilike(search_term + "%")
        similarity_username_condition = func.similarity(User.username, search_term) > 0.3
        similarity_name_condition = func.similarity(User.name, search_term) > 0.3

        relevance_score = case(
            (exact_username_condition, 100),
            (exact_name_condition, 95),
            (prefix_username_condition, 80),
            (prefix_name_condition, 70),
            (similarity_username_condition, func.similarity(User.username, search_term) * 40),
            (similarity_name_condition, func.similarity(User.name, search_term) * 40),
            else_=func.greatest(
                func.similarity(User.username, search_term) * 40,
                func.similarity(User.name, search_term) * 40,
            ),
        ).label("relevance_score")

        statement = (
            User.select_active()
            .where(
                or_(
                    exact_username_condition,
                    exact_name_condition,
                    prefix_username_condition,
                    prefix_name_condition,
                    similarity_username_condition,
                    similarity_name_condition,
                )
            )
            .order_by(relevance_score.desc(), col(User.username).asc())
        )

        users, meta = paginate_query(session=session, statement=statement, pagination=pagination)
        enriched = UserService._annotate_follow_flags_for_users(
            session=session, current_user_id=current_user_id, users=users
        )
        return enriched, meta
