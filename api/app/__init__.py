import os

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_openapi3.models.info import Info
from flask_openapi3.openapi import OpenAPI
from flask_openapi3.types import SecuritySchemesDict


def create_app():
    """Create a new Flask application instance"""

    from app.config import get_config
    from app.database import init_db
    from app.middlewares.auto_refresh import auto_refresh_expiring_tokens
    from app.middlewares.exceptions import register_error_handlers
    from app.routes.auth_routes import auth_router
    from app.routes.healthcheck_routes import healthcheck_router
    from app.routes.post_routes import posts_router
    from app.routes.user_routes import users_router
    from app.utils.logging import configure_logging
    from scripts.seed_default_admin import seed_default_admin_if_needed
    from scripts.seed_fake_data import seed_fake_data_if_needed

    config = get_config()

    # Initialize app config
    app_info = Info(
        title=config.APP_NAME,
        version=config.APP_VERSION,
        description=config.APP_DESCRIPTION,
    )

    app_security_schemes = SecuritySchemesDict(
        {
            "access_token_cookie": {
                "type": "apiKey",
                "name": "access_token_cookie",
                "in": "cookie",
            },
            "refresh_token_cookie": {
                "type": "apiKey",
                "name": "refresh_token_cookie",
                "in": "cookie",
            },
            "csrf_access_token": {"type": "apiKey", "name": "csrf_access_token", "in": "cookie"},
            "csrf_refresh_token": {"type": "apiKey", "name": "csrf_refresh_token", "in": "cookie"},
            "x_csrf_token": {"type": "apiKey", "name": "X-CSRF-TOKEN", "in": "header"},
        },
    )

    app = OpenAPI(
        __name__,
        info=app_info,
        security_schemes=app_security_schemes,
        # validation_error_model=ValidationErrorItem,
    )

    app.config.from_object(config)

    configure_logging(app)

    # Initialize extensions
    CORS(app)
    JWTManager(app)

    # Initialize error handlers
    register_error_handlers(app)

    # Initialize middlewares
    app.after_request(auto_refresh_expiring_tokens)

    # Initialize routes
    app.register_api(auth_router)
    app.register_api(healthcheck_router)
    app.register_api(posts_router)
    app.register_api(users_router)

    if os.getenv("SKIP_DB_INIT", "").lower() not in ("1", "true", "yes"):
        # Initialize database
        init_db()

        # Seed fake data if seeding is enabled in environment variables
        seed_fake_data_if_needed()

        # Seed default admin user if needed
        seed_default_admin_if_needed()

    return app
