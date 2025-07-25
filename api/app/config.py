import os


class Config:
    APP_NAME = "Codifeed - REST API"
    APP_VERSION = "1.0.0"
    APP_DESCRIPTION = "Flask REST API for Codifeed app."

    API_PREFIX = "/api"

    SQLITE_DB_URI = os.getenv("DATABASE_URL")

    # JWT = [{"jwt": []}]
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    # JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    # JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=14)
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SECURE = True

    JWT_COOKIE_SAMESITE = "Strict"

    # OPENAPI_VERSION = "3.0.3"
    # OPENAPI_URL_PREFIX = "/api"
    # OPENAPI_SWAGGER_UI_PATH = "/docs"

    # SWAGGER_CONFIG = {
    #     "docExpansion": "none",
    #     "validatorUrl": None,
    #     "tryItOutEnabled": True,
    #     "filter": True,
    #     "tagsSorter": "alpha",
    #     "persistAuthorization": True,
    # }

    # DATA_PREFIX = "/data/data"
    # FILE_PATH = os.path.join(DATA_PREFIX, "files")
    # for d in [FILE_PATH]:
    #     if not os.path.exists(d):
    #         os.makedirs(d)


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = "Strict"


def get_config(env):
    return {
        "development": DevelopmentConfig,
    }.get(env, Config)
