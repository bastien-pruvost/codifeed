from app.utils.responses import error_response


def not_found_error(resource_name: str):
    """Create a standardized not found error response"""
    return error_response(f"{resource_name} not found", 404)


class CodeifeedException(Exception):
    """Base exception class for Codifeed application"""

    pass


class ValidationException(CodeifeedException):
    """Raised when validation fails"""

    pass


class AuthenticationException(CodeifeedException):
    """Raised when authentication fails"""

    pass


class AuthorizationException(CodeifeedException):
    """Raised when authorization fails"""

    pass
