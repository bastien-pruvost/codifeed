from flask_openapi3.models.info import Info
from flask_openapi3.models.security_scheme import SecurityScheme
from flask_openapi3.openapi import OpenAPI
from flask_openapi3.types import SecuritySchemesDict


def create_app(env: str = "development"):
    """Create a new Flask application instance"""
    from dotenv import load_dotenv

    from app.config import get_config
    from app.models import init_db
    from app.routes import register_routes
    # from app.utils.errors import register_error_handlers

    load_dotenv()
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

    register_routes(app)
    # register_error_handlers(app)

    init_db()

    return app
