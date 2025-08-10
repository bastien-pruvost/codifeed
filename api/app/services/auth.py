from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
)
from werkzeug.exceptions import Unauthorized

from app.models.users import User
from app.services.users import UserService
from app.utils.hashing import verify_password
from app.utils.logging import logger


class AuthService:
    """Service layer for authentication operations."""

    @staticmethod
    def create_tokens(user_id: UUID) -> tuple[str, str]:
        """Create access and refresh tokens for a user."""
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return access_token, refresh_token

    @staticmethod
    def should_auto_refresh_token() -> bool:
        """Check if current token should be refreshed (within 15 minutes of expiry)."""
        try:
            jwt = get_jwt()
            if not jwt:
                return False

            now = datetime.now(timezone.utc)
            exp_time = datetime.fromtimestamp(jwt["exp"], timezone.utc)
            time_until_expiry = exp_time - now

            return time_until_expiry <= timedelta(minutes=15)
        except Exception:
            return False

    @staticmethod
    def verify_credentials(email: str, password: str) -> Optional[User]:
        """Verify user credentials and return user if valid."""
        try:
            user = UserService.get_by_email(email)
            if user and verify_password(password, user.hashed_password):
                return user
            return None
        except Exception:
            logger.error("Error verifying credentials")
            return None

    @staticmethod
    def get_current_user_id() -> UUID:
        """Get current authenticated user ID from JWT."""
        user_id = get_jwt_identity()
        if not user_id or not isinstance(user_id, str):
            raise Unauthorized("No valid token found")
        return UUID(user_id)
