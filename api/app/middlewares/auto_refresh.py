from dotenv.main import logger
from flask import Response
from flask_jwt_extended import set_access_cookies, set_refresh_cookies

from app.services.auth import AuthService


def auto_refresh_expiring_tokens(response: Response) -> Response:
    """Middleware to automatically refresh expiring tokens."""
    try:
        if AuthService.should_auto_refresh_token():
            user_id = AuthService.get_current_user_id()
            access_token, refresh_token = AuthService.create_tokens(user_id)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)

    except Exception:
        logger.error("Failed to auto-refresh tokens")

    return response
