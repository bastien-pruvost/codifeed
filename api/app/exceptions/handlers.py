from pydantic import ValidationError
from sqlalchemy import exc as sqlalchemy_exc
from werkzeug import exceptions

from app.utils.responses import error_response


def register_error_handlers(app):
    """Register error handlers for the application"""

    # HTTP errors - most common ones

    @app.errorhandler(exceptions.BadRequest)
    def bad_request(e):
        return error_response(str(e) or "Bad request", 400)

    @app.errorhandler(exceptions.Unauthorized)
    def unauthorized(e):
        return error_response(str(e) or "Unauthorized", 401)

    @app.errorhandler(exceptions.Forbidden)
    def forbidden(e):
        return error_response(str(e) or "Forbidden", 403)

    @app.errorhandler(exceptions.NotFound)
    def not_found(e):
        return error_response(str(e) or "Resource not found", 404)

    @app.errorhandler(exceptions.MethodNotAllowed)
    def method_not_allowed(e):
        return error_response(str(e) or "Method not allowed", 405)

    @app.errorhandler(exceptions.Conflict)
    def conflict(e):
        return error_response(str(e) or "Conflict with current state", 409)

    @app.errorhandler(exceptions.TooManyRequests)
    def too_many_requests(e):
        return error_response(str(e) or "Rate limit exceeded", 429)

    # Database errors - common SQLAlchemy errors

    @app.errorhandler(sqlalchemy_exc.IntegrityError)
    def integrity_error(e):
        # For unique constraint violations, foreign key violations, etc.
        return error_response(str(e) or "Database integrity error", 409)

    @app.errorhandler(sqlalchemy_exc.DataError)
    def data_error(e):
        # For data type errors, value too long, etc.
        return error_response(str(e) or "Invalid data format", 400)

    @app.errorhandler(sqlalchemy_exc.NoResultFound)
    def no_result_found(e):
        # When .one() is used and no results are found
        return error_response(str(e) or "Resource not found", 404)

    @app.errorhandler(sqlalchemy_exc.MultipleResultsFound)
    def multiple_results_found(e):
        # When .one() is used but multiple results are found
        return error_response(str(e) or "Multiple resources found", 500)

    @app.errorhandler(sqlalchemy_exc.OperationalError)
    def operational_error(e):
        # For connection issues, timeouts, etc.
        return error_response(str(e) or "Database operation error", 500)

    # Handle any other SQLAlchemy errors (parent class)

    @app.errorhandler(sqlalchemy_exc.SQLAlchemyError)
    def sqlalchemy_error(e):
        return error_response(str(e) or "Database error", 500)

    # Catch-all for any HTTP exception not handled above

    @app.errorhandler(exceptions.HTTPException)
    def handle_exceptionseption(e):
        return error_response(str(e) or "Server error", e.code or 500)

    # For manually raised Pydantic validation errors

    @app.errorhandler(ValidationError)
    def validation_error(e: ValidationError):
        return error_response(str(e) or "Validation error", 422)

    # Catch-all fallback for any other exception

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        app.logger.error(f"Unhandled exception: {str(e)}")
        return error_response("Internal server error", 500)
