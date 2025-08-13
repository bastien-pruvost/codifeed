from datetime import datetime, timedelta, timezone
from functools import wraps
from uuid import UUID

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    verify_jwt_in_request,
)
from werkzeug.exceptions import Unauthorized


def get_current_user_id() -> UUID:
    user_id = get_jwt_identity()
    if not user_id or not isinstance(user_id, str):
        raise Unauthorized("No valid token found")
    return UUID(user_id)


def create_tokens(user_id: UUID) -> tuple[str, str]:
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            raise Unauthorized(description="Error verifying JWT: Login required") from e
        return func(*args, **kwargs)

    return wrapper


def refresh_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request(refresh=True)
        except Exception as e:
            raise Unauthorized(description="Error verifying JWT: Refresh required") from e
        return func(*args, **kwargs)

    return wrapper


def should_auto_refresh_token() -> bool:
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
