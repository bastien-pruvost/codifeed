from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_openapi3.models.info import Info
from flask_openapi3.models.security_scheme import SecurityScheme
from flask_openapi3.openapi import OpenAPI
from flask_openapi3.types import SecuritySchemesDict


def create_app(env: str = "development"):
    """Create a new Flask application instance"""

    from app.config import get_config
    from app.database.initialization import init_db
    from app.exceptions.handlers import register_error_handlers
    from app.routes.auth import auth_router
    from app.routes.posts import posts_router
    from app.routes.users import users_router

    config = get_config(env)

    app_info = Info(
        title=config.APP_NAME,
        version=config.APP_VERSION,
        description=config.APP_DESCRIPTION,
    )

    app_security_schemes = SecuritySchemesDict(
        {
            "basic": SecurityScheme(type="http", scheme="basic"),
            "jwt": SecurityScheme(type="http", scheme="bearer", bearerFormat="JWT"),
        }
    )

    app = OpenAPI(
        __name__,
        info=app_info,
        security_schemes=app_security_schemes,
    )
    app.config.from_object(config)

    CORS(app, origins=["*"], supports_credentials=True)
    JWTManager(app)

    # Register feature routers
    app.register_api(auth_router)
    app.register_api(users_router)
    app.register_api(posts_router)

    register_error_handlers(app)

    init_db()

    return app
