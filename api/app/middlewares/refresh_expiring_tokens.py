from datetime import datetime, timedelta, timezone

from flask import current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
)


def refresh_expiring_tokens(response):
    try:
        jwt = get_jwt()
        if not jwt:
            return response
        exp_timestamp = jwt["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            refresh_token = create_refresh_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
        return response
    except Exception as e:
        current_app.logger.error(f"Error refreshing expiring token: {e}")
        return response
