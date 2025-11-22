from flask import Response
from flask_jwt_extended import set_access_cookies, set_refresh_cookies

from app.utils.jwt import create_tokens, get_current_user_id, should_auto_refresh_token


def auto_refresh_expiring_tokens(response: Response) -> Response:
    """Middleware to automatically refresh expiring tokens."""
    try:
        if should_auto_refresh_token():
            user_id = get_current_user_id()
            access_token, refresh_token = create_tokens(user_id)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
    except Exception:
        # Silently fail - if tokens can't be refreshed here,
        # the frontend will handle it on the next request
        pass

    return response
