from flask_jwt_extended.exceptions import JWTExtendedException
from pydantic import ValidationError
from sqlalchemy import exc as sqlalchemy_exc
from werkzeug import exceptions

from app.utils.logging import logger
from app.utils.responses import (
    ErrorCodes,
    error_response,
    pydantic_validation_error_response,
)


def register_error_handlers(app):
    """Register comprehensive error handlers for the application"""

    # Authentication & Authorization errors
    @app.errorhandler(JWTExtendedException)
    def jwt_error(e):
        """Handle JWT-related errors"""
        error_message = str(e) or "Authentication failed"

        # Determine specific JWT error type
        if "expired" in error_message.lower():
            code = ErrorCodes.TOKEN_EXPIRED
        elif "invalid" in error_message.lower() or "decode" in error_message.lower():
            code = ErrorCodes.TOKEN_INVALID
        else:
            code = ErrorCodes.UNAUTHORIZED

        logger.warning(f"JWT error: {error_message}")
        return error_response(message=error_message, status=401, code=code)

    # Validation errors
    @app.errorhandler(ValidationError)
    def validation_error(e: ValidationError):
        """Handle Pydantic validation errors"""
        logger.info(f"Validation error: {str(e)}")
        return pydantic_validation_error_response(e)

    # Database errors - consolidated and simplified
    @app.errorhandler(sqlalchemy_exc.IntegrityError)
    def integrity_error(e):
        """Handle database integrity errors"""
        logger.warning(f"Database integrity error: {str(e)}")
        error_str = str(e).lower()

        if "unique constraint" in error_str or "duplicate" in error_str:
            return error_response(
                message="Resource already exists", status=409, code=ErrorCodes.ALREADY_EXISTS
            )
        elif "foreign key" in error_str:
            return error_response(
                message="Referenced resource not found",
                status=400,
                code=ErrorCodes.VALIDATION_ERROR,
            )
        else:
            return error_response(
                message="Database integrity error", status=409, code=ErrorCodes.INTEGRITY_ERROR
            )

    @app.errorhandler(sqlalchemy_exc.NoResultFound)
    def no_result_found(e):
        return error_response(message="Resource not found", status=404, code=ErrorCodes.NOT_FOUND)

    @app.errorhandler(sqlalchemy_exc.SQLAlchemyError)
    def sqlalchemy_error(e):
        """Handle all other database errors"""
        logger.error(f"Database error: {str(e)}")

        # Handle specific cases
        error_str = str(e).lower()
        if "operational" in error_str or "connection" in error_str:
            return error_response(
                message="Database service temporarily unavailable",
                status=503,
                code=ErrorCodes.DATABASE_ERROR,
            )
        elif "data" in error_str or "invalid" in error_str:
            return error_response(
                message="Invalid data format or value", status=400, code=ErrorCodes.INVALID_INPUT
            )
        else:
            return error_response(
                message="Database error occurred", status=500, code=ErrorCodes.DATABASE_ERROR
            )

    # HTTP exceptions - catch-all with proper error code mapping
    @app.errorhandler(exceptions.HTTPException)
    def handle_http_exception(e):
        """Handle any HTTP exception not caught by specific handlers"""
        # Map status codes to appropriate error codes
        error_code_map = {
            400: ErrorCodes.BAD_REQUEST,
            401: ErrorCodes.UNAUTHORIZED,
            403: ErrorCodes.FORBIDDEN,
            404: ErrorCodes.NOT_FOUND,
            405: ErrorCodes.METHOD_NOT_ALLOWED,
            409: ErrorCodes.CONFLICT,
            429: ErrorCodes.RATE_LIMIT_EXCEEDED,
        }

        # More specific default messages for common errors
        default_messages = {
            400: "Bad request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Resource not found",
            405: "Method not allowed",
            409: "Conflict",
            429: "Rate limit exceeded",
        }

        status_code = e.code or 500
        default_message = default_messages.get(status_code, "HTTP error")

        logger.warning(f"HTTP exception: {str(e)}")

        return error_response(
            message=str(e.description) or default_message,
            status=status_code,
            code=error_code_map.get(status_code, ErrorCodes.INTERNAL_ERROR),
        )

    # Generic exception handler - secure fallback
    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """Handle any unexpected exceptions"""
        logger.error(f"Unhandled exception: {str(e)}", exc_info=True)

        # Security: Don't expose internal details in production
        message = (
            f"Internal server error: {str(e)}"
            if app.config.get("DEBUG", False)
            else "An unexpected error occurred. Please try again later."
        )

        return error_response(message=message, status=500, code=ErrorCodes.INTERNAL_ERROR)
