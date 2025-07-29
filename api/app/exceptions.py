import logging

from flask_jwt_extended.exceptions import JWTExtendedException
from pydantic import ValidationError
from sqlalchemy import exc as sqlalchemy_exc
from werkzeug import exceptions

from app.utils.responses import (
    ErrorCodes,
    error_response,
    pydantic_validation_error_response,
)

# Set up logger
logger = logging.getLogger(__name__)


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
        return error_response(
            message=error_message,
            status=401,
            code=code,
        )

    @app.errorhandler(exceptions.Unauthorized)
    def unauthorized(e):
        """Handle 401 Unauthorized errors"""
        return error_response(
            message=str(e.description) or "Unauthorized",
            status=401,
            code=ErrorCodes.UNAUTHORIZED,
        )

    @app.errorhandler(exceptions.Forbidden)
    def forbidden(e):
        """Handle 403 Forbidden errors"""
        return error_response(
            message=str(e.description) or "Forbidden",
            status=403,
            code=ErrorCodes.FORBIDDEN,
        )

    # Client errors

    @app.errorhandler(exceptions.BadRequest)
    def bad_request(e):
        """Handle 400 Bad Request errors"""
        return error_response(
            message=str(e.description) or "Bad request",
            status=400,
            code=ErrorCodes.BAD_REQUEST,
        )

    @app.errorhandler(exceptions.NotFound)
    def not_found(e):
        """Handle 404 Not Found errors"""
        return error_response(
            message=str(e.description) or "Resource not found",
            status=404,
            code=ErrorCodes.NOT_FOUND,
        )

    @app.errorhandler(exceptions.MethodNotAllowed)
    def method_not_allowed(e):
        """Handle 405 Method Not Allowed errors"""
        return error_response(
            message=str(e.description) or "Method not allowed",
            status=405,
            code=ErrorCodes.METHOD_NOT_ALLOWED,
        )

    @app.errorhandler(exceptions.Conflict)
    def conflict(e):
        """Handle 409 Conflict errors"""
        return error_response(
            message=str(e.description) or "Conflict",
            status=409,
            code=ErrorCodes.CONFLICT,
        )

    @app.errorhandler(exceptions.TooManyRequests)
    def too_many_requests(e):
        """Handle 429 Rate Limit errors"""
        return error_response(
            message=str(e.description) or "Rate limit exceeded",
            status=429,
            code=ErrorCodes.RATE_LIMIT_EXCEEDED,
        )

    # Validation errors

    @app.errorhandler(ValidationError)
    def validation_error(e: ValidationError):
        """Handle Pydantic validation errors"""
        logger.info(f"Validation error: {str(e)}")
        return pydantic_validation_error_response(e)

    # Database errors

    @app.errorhandler(sqlalchemy_exc.IntegrityError)
    def integrity_error(e):
        """Handle database integrity errors (unique constraints, foreign keys, etc.)"""
        logger.warning(f"Database integrity error: {str(e)}")

        # Check for specific database error types
        error_str = str(e).lower()

        if "unique constraint" in error_str or "duplicate" in error_str:
            return error_response(
                message="Resource already exists",
                status=409,
                code=ErrorCodes.ALREADY_EXISTS,
            )
        elif "foreign key" in error_str:
            return error_response(
                message="Referenced resource not found",
                status=400,
                code=ErrorCodes.VALIDATION_ERROR,
            )
        else:
            return error_response(
                message="Database integrity error",
                status=409,
                code=ErrorCodes.INTEGRITY_ERROR,
            )

    @app.errorhandler(sqlalchemy_exc.DataError)
    def data_error(e):
        """Handle database data errors (invalid format, value too long, etc.)"""
        logger.warning(f"Database data error: {str(e)}")
        return error_response(
            message="Invalid data format or value",
            status=400,
            code=ErrorCodes.INVALID_INPUT,
        )

    @app.errorhandler(sqlalchemy_exc.NoResultFound)
    def no_result_found(e):
        """Handle when database query returns no results (when .one() is used)"""
        return error_response(
            message="Resource not found",
            status=404,
            code=ErrorCodes.NOT_FOUND,
        )

    @app.errorhandler(sqlalchemy_exc.MultipleResultsFound)
    def multiple_results_found(e):
        """Handle when database query returns multiple results (when .one() is used)"""
        logger.error(f"Multiple results found: {str(e)}")
        return error_response(
            message="Multiple resources found - query ambiguous",
            status=500,
            code=ErrorCodes.DATABASE_ERROR,
        )

    @app.errorhandler(sqlalchemy_exc.OperationalError)
    def operational_error(e):
        """Handle database operational errors (connection issues, timeouts, etc.)"""
        logger.error(f"Database operational error: {str(e)}")
        return error_response(
            message="Database service temporarily unavailable",
            status=503,
            code=ErrorCodes.DATABASE_ERROR,
        )

    @app.errorhandler(sqlalchemy_exc.SQLAlchemyError)
    def sqlalchemy_error(e):
        """Handle any other SQLAlchemy errors (parent class)"""
        logger.error(f"Database error: {str(e)}")
        return error_response(
            message="Database error occurred",
            status=500,
            code=ErrorCodes.DATABASE_ERROR,
        )

    # HTTP exceptions (catch-all for any HTTP exception not handled above)

    @app.errorhandler(exceptions.HTTPException)
    def handle_http_exception(e):
        """Handle any HTTP exception not caught by specific handlers"""
        return error_response(
            message=str(e.description) or "HTTP error",
            status=e.code or 500,
            code=ErrorCodes.INTERNAL_ERROR,
        )

    # Generic exception handler (catch-all fallback)

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """Handle any unexpected exceptions"""
        logger.error(f"Unhandled exception: {str(e)}", exc_info=True)

        # Don't expose internal error details in production
        if app.config.get("DEBUG", False):
            message = f"Internal server error: {str(e)}"
        else:
            message = "An unexpected error occurred. Please try again later."

        return error_response(
            message=message,
            status=500,
            code=ErrorCodes.INTERNAL_ERROR,
        )
