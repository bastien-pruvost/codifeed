from flask import Response, make_response
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from werkzeug.exceptions import Unauthorized

from app.models.auth import (
    TokenPair,
)


class AuthService:
    """Service layer for authentication operations."""

    @staticmethod
    def create_tokens(user_id: str) -> TokenPair:
        """Create access and refresh tokens for a user."""
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return TokenPair(access_token=access_token, refresh_token=refresh_token)

    @staticmethod
    def refresh_tokens() -> TokenPair:
        """Refresh access token using refresh token."""
        user_id = get_jwt_identity()
        if not user_id:
            raise Unauthorized(description="Invalid refresh token")
        return AuthService.create_tokens(user_id)

    @staticmethod
    def create_authenticated_response(data: dict, user_id: str, status_code: int = 200) -> Response:
        """Create a response with authentication cookies set."""
        tokens = AuthService.create_tokens(user_id)
        response = make_response(data, status_code)
        set_access_cookies(response, tokens.access_token)
        set_refresh_cookies(response, tokens.refresh_token)
        return response

    @staticmethod
    def create_refresh_response(data: dict, status_code: int = 200) -> Response:
        """Create a response with refresh token set."""
        tokens = AuthService.refresh_tokens()
        response = make_response(data, status_code)
        set_refresh_cookies(response, tokens.refresh_token)
        return response

    @staticmethod
    def create_logout_response(data: dict, status_code: int = 200) -> Response:
        """Create a logout response with cookies unset."""
        response = make_response(data, status_code)
        unset_jwt_cookies(response)
        return response
