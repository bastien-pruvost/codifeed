from typing import Tuple
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, case, col, func, or_, select
from werkzeug.exceptions import BadRequest, Forbidden, NotFound

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
    """Service responsible for all user-related business logic."""

    @staticmethod
    def get_by_id(session: Session, user_id: UUID) -> User:
        """Get user by ID."""
        user = session.get(User, user_id)

        if not user:
            raise NotFound(description="User not found")

        if user.is_deleted:
            raise NotFound(
                description="This account has been deleted. "
                "Please contact support if you believe this is an error."
            )

        return User.model_validate(user)

    @staticmethod
    def get_by_username(session: Session, username: str) -> User:
        """Get user by username."""
        user = session.exec(select(User).where(col(User.username) == username)).first()

        if not user:
            raise NotFound(description=f"User {username} not found")

        if user.is_deleted:
            raise NotFound(description=f"This account ({username}) has been deleted.")

        return user

    @staticmethod
    def delete_by_id(session: Session, user_id: UUID, username: str) -> User:
        """Delete user account by ID."""

        user = session.get(User, user_id)

        if not user:
            raise NotFound(description="User not found")

        if user.username != username:
            raise Forbidden(description="You are not allowed to delete this user")

        user.soft_delete()
        session.commit()

        return User.model_validate(user)

    @staticmethod
    def get_detail_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
    ) -> UserDetail:
        """Get a user's detail by username."""
        user = UserService.get_by_username(session, username)

        followers_count_subquery = (
            select(func.count("*"))
            .select_from(UserFollow)
            .join(User, col(User.id) == UserFollow.follower_id)
            .where(UserFollow.following_id == user.id, col(User.deleted_at).is_(None))
            .scalar_subquery()
            .label("followers_count")
        )

        following_count_subquery = (
            select(func.count("*"))
            .select_from(UserFollow)
            .join(User, col(User.id) == UserFollow.following_id)
            .where(UserFollow.follower_id == user.id, col(User.deleted_at).is_(None))
            .scalar_subquery()
            .label("following_count")
        )

        is_following_subquery = (
            select(1)
            .select_from(UserFollow)
            .where(UserFollow.follower_id == current_user_id, UserFollow.following_id == user.id)
            .exists()
            .label("is_following")
        )
        is_followed_by_subquery = (
            select(1)
            .select_from(UserFollow)
            .where(UserFollow.follower_id == user.id, UserFollow.following_id == current_user_id)
            .exists()
            .label("is_followed_by")
        )

        stats_statement = select(
            followers_count_subquery,
            following_count_subquery,
            is_following_subquery,
            is_followed_by_subquery,
        )

        result = session.exec(stats_statement).first()

        if result:
            followers_count, following_count, is_following, is_followed_by = result
        else:
            followers_count = following_count = 0
            is_following = is_followed_by = False

        return UserDetail.model_validate(user).model_copy(
            update={
                "followers_count": int(followers_count or 0),
                "following_count": int(following_count or 0),
                "is_following": bool(is_following),
                "is_followed_by": bool(is_followed_by),
            }
        )

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
    def _get_follow_relationships(
        session: Session, current_user_id: UUID, user_ids: list[UUID]
    ) -> tuple[set[UUID], set[UUID]]:
        """Get follow relationships between current user and list of users."""
        following_ids_statement = select(UserFollow.following_id).where(
            UserFollow.follower_id == current_user_id,
            col(UserFollow.following_id).in_(user_ids),
        )
        following_ids = set(session.exec(following_ids_statement).all())

        followed_by_ids_statement = select(UserFollow.follower_id).where(
            UserFollow.following_id == current_user_id,
            col(UserFollow.follower_id).in_(user_ids),
        )
        followed_by_ids = set(session.exec(followed_by_ids_statement).all())

        return following_ids, followed_by_ids

    @staticmethod
    def _annotate_follow_flags_for_users(
        session: Session,
        current_user_id: UUID,
        users: list[User],
    ) -> list[UserPublic]:
        """Return a UserPublic list enriched with follow flags relative to current user."""
        if not users:
            return []

        user_ids = [u.id for u in users if u.id is not None]
        if not user_ids:
            return [UserPublic.model_validate(u) for u in users]

        following_ids, followed_by_ids = UserService._get_follow_relationships(
            session, current_user_id, user_ids
        )

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
    def get_followers_by_username(
        session: Session,
        current_user_id: UUID,
        username: str,
        pagination: PaginationQuery,
    ) -> Tuple[list[UserPublic], PaginationMeta]:
        """List followers (active users) of a target user with pagination."""
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
        """List users (active) that the target user is following with pagination."""
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
        """Search users by name/username, ordered by a relevance score."""
        search_term = query.strip()
        if not search_term:
            raise BadRequest(description="Search query is required")

        MIN_SIMILARITY_THRESHOLD = 0.3
        RELEVANCE_SCORES = {
            "EXACT_USERNAME": 100,
            "EXACT_NAME": 95,
            "PREFIX_USERNAME": 80,
            "PREFIX_NAME": 70,
            "SIMILARITY_MULTIPLIER": 40,
        }

        exact_username_condition = User.username == search_term
        exact_name_condition = User.name == search_term
        prefix_username_condition = col(User.username).ilike(search_term + "%")
        prefix_name_condition = col(User.name).ilike(search_term + "%")
        similarity_username_condition = (
            func.similarity(User.username, search_term) > MIN_SIMILARITY_THRESHOLD
        )
        similarity_name_condition = (
            func.similarity(User.name, search_term) > MIN_SIMILARITY_THRESHOLD
        )

        # TODO: Try to use this instead of the similarity function
        # similarity_username_condition = col(User.username).op("%")(search_term)
        # similarity_name_condition = col(User.name).op("%")(search_term)

        relevance_score = case(
            (exact_username_condition, RELEVANCE_SCORES["EXACT_USERNAME"]),
            (exact_name_condition, RELEVANCE_SCORES["EXACT_NAME"]),
            (prefix_username_condition, RELEVANCE_SCORES["PREFIX_USERNAME"]),
            (prefix_name_condition, RELEVANCE_SCORES["PREFIX_NAME"]),
            (
                similarity_username_condition,
                func.similarity(User.username, search_term)
                * RELEVANCE_SCORES["SIMILARITY_MULTIPLIER"],
            ),
            (
                similarity_name_condition,
                func.similarity(User.name, search_term) * RELEVANCE_SCORES["SIMILARITY_MULTIPLIER"],
            ),
            else_=func.greatest(
                func.similarity(User.username, search_term)
                * RELEVANCE_SCORES["SIMILARITY_MULTIPLIER"],
                func.similarity(User.name, search_term) * RELEVANCE_SCORES["SIMILARITY_MULTIPLIER"],
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
