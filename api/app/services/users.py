from typing import Optional

from sqlmodel import select

from app.database.session import get_session
from app.models.users import User, UserCreate
from app.utils.hashing import hash_password


class UserService:
    """Service layer for user operations."""

    @staticmethod
    def get_by_id(user_id: str) -> Optional[User]:
        """Get user by ID."""
        with get_session() as session:
            return session.get(User, user_id)

    @staticmethod
    def get_by_email(user_email: str) -> Optional[User]:
        """Get user by email."""
        with get_session() as session:
            query = select(User).where(User.email == user_email)
            return session.exec(query).first()

    @staticmethod
    def create_user(user_data: UserCreate) -> User:
        """Create a new user."""
        user = User.model_validate(
            user_data,
            update={"hashed_password": hash_password(user_data.password)},
        )
        with get_session() as session:
            session.add(user)
            session.commit()
            session.refresh(user)
            return user

    @staticmethod
    def email_exists(email: str) -> bool:
        """Check if email already exists."""
        return UserService.get_by_email(email) is not None
