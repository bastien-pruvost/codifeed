from flask import Response
from flask_jwt_extended.exceptions import JWTExtendedException
from sqlalchemy import exc as sa_exception
from werkzeug import exceptions

from app.utils.logging import logger
from app.utils.response import ErrorCodes, error_response


def register_error_handlers(app):
    """Register error handlers - all return ErrorResponse format"""

    # Note: Validation errors (422) are handled by Flask-OpenAPI3's validation_error_callback

    # Authentication errors (401)
    @app.errorhandler(JWTExtendedException)
    def handle_jwt_error(e):
        """Handle JWT authentication errors"""
        error_message = str(e) or "Authentication failed"
        logger.warning(f"JWT error: {error_message}")

        # Determine specific error type
        if "expired" in error_message.lower():
            code = ErrorCodes.EXPIRED_TOKEN
        elif "invalid" in error_message.lower() or "decode" in error_message.lower():
            code = ErrorCodes.INVALID_TOKEN
        else:
            code = None

        return error_response(message=error_message, status=401, code=code)

    # Database errors
    @app.errorhandler(sa_exception.IntegrityError)
    def handle_integrity_error(e):
        """Handle database integrity errors (unique, foreign key, etc.)"""
        logger.error(f"Database integrity error: {str(e)}")
        error_str = str(e).lower()

        if "unique constraint" in error_str or "duplicate" in error_str:
            return error_response(
                message="Resource already exists",
                status=409,
                code=ErrorCodes.ALREADY_EXISTS,
            )

        return error_response(
            message="Database integrity error",
            status=409,
            code=ErrorCodes.INTEGRITY_ERROR,
        )

    @app.errorhandler(sa_exception.SQLAlchemyError)
    def handle_database_error(e):
        """Handle general database errors"""
        logger.error(f"Database error: {str(e)}")
        return error_response(
            message="Database error occurred",
            status=500,
            code=ErrorCodes.DATABASE_ERROR,
        )

    # HTTP exceptions
    @app.errorhandler(exceptions.HTTPException)
    def handle_http_exception(e: exceptions.HTTPException) -> Response:
        """Handle standard HTTP exceptions"""
        status_code = e.code or 500

        logger.warning(f"HTTP {status_code}: {e.description}")

        return error_response(
            message=str(e.description) if e.description else "Request failed",
            status=status_code,
        )

    # Generic fallback
    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        """Handle any unexpected errors"""
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)

        # Don't expose internal details in production
        message = (
            f"Unexpected error: {str(e)}"
            if app.config.get("DEBUG", False)
            else "An unexpected error occurred"
        )

        return error_response(
            message=message,
            status=500,
        )
