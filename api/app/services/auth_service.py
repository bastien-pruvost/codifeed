from __future__ import annotations

from argon2 import exceptions as argon_exceptions
from sqlmodel import Session, or_, select
from werkzeug.exceptions import BadRequest, InternalServerError

from app.models import Profile, User, UserCreate, UserPublic
from app.utils.password import hash_password, verify_password


class AuthService:
    """Service responsible for all authentication-related business logic."""

    @staticmethod
    def create_user(session: Session, user_data: UserCreate) -> UserPublic:
        """Create a new user account and return user data.

        Args:
            session: Database session
            user_data: User creation data

        Returns:
            UserPublic

        Raises:
            BadRequest: If email already exists
            InternalServerError: If user creation fails
        """
        # Check if user already exists
        statement = select(User).where(
            or_(User.email == user_data.email, User.username == user_data.username)
        )
        existing_user = session.exec(statement).first()

        if existing_user and existing_user.email == user_data.email:
            raise BadRequest(description="A user with this email already exists")

        if existing_user and existing_user.username == user_data.username:
            raise BadRequest(description="A user with this username already exists")

        # Create user with empty profile
        profile = Profile()
        user = User.model_validate(
            user_data,
            update={
                "profile": profile,
                "hashed_password": hash_password(user_data.password),
            },
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        if not user or not user.id:
            raise InternalServerError(description="Failed to create user")

        return UserPublic.model_validate(user)

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> UserPublic:
        """Authenticate user with email and password.

        Args:
            session: Database session
            email: User email
            password: User password

        Returns:
            UserPublic

        Raises:
            BadRequest: If credentials are invalid
            InternalServerError: If authentication fails
        """
        try:
            statement = select(User).where(User.email == email)
            user = session.exec(statement).first()

            if not user or not verify_password(password, user.hashed_password):
                raise BadRequest(description="Invalid email or password")

            if not user.id:
                raise InternalServerError(description="Failed to login user")

            return UserPublic.model_validate(user)

        except (
            argon_exceptions.VerifyMismatchError,
            argon_exceptions.InvalidHashError,
            argon_exceptions.VerificationError,
        ) as error:
            raise BadRequest(description="Invalid email or password") from error
