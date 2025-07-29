from datetime import datetime, timedelta, timezone

from flask import current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    verify_jwt_in_request,
)


def auto_refresh_expiring_tokens(response):
    """Refresh expiring tokens if they are within 15 minutes of expiring"""
    try:
        verify_jwt_in_request(optional=True, refresh=True)
        jwt = get_jwt()
        if not jwt:
            return response
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=15))
        if target_timestamp > jwt["exp"]:
            access_token = create_access_token(identity=get_jwt_identity())
            refresh_token = create_refresh_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
        return response
    except Exception as e:
        current_app.logger.error(f"Error refreshing expiring token: {e}")
        return response
