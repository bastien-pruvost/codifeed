from functools import wraps

from flask_jwt_extended import verify_jwt_in_request
from werkzeug.exceptions import Unauthorized


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
