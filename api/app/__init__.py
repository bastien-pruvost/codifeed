from typing import List, Optional

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_openapi3.blueprint import APIBlueprint
from flask_openapi3.models.info import Info
from flask_openapi3.openapi import OpenAPI
from flask_openapi3.types import SecuritySchemesDict
from pydantic import BaseModel, Field

from app.utils.responses import ErrorResponse


def create_app(env: str = "development"):
    """Create a new Flask application instance"""

    from app.config import get_config
    from app.database.initialization import init_db
    from app.exceptions import register_error_handlers
    from app.middlewares.refresh_expiring_tokens import auto_refresh_expiring_tokens
    from app.routes.auth import auth_router
    from app.routes.posts import posts_router
    from app.routes.users import users_router

    # Get config from environment
    config = get_config(env)

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

    # Initialize extensions
    CORS(app)
    JWTManager(app)

    # Initialize error handlers
    register_error_handlers(app)

    # Initialize middlewares
    app.after_request(auto_refresh_expiring_tokens)

    # Initialize routes
    app.register_api(auth_router)
    app.register_api(users_router)
    app.register_api(posts_router)

    # Initialize database
    init_db()

    return app
