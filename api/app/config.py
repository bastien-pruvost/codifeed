class Config:
    APP_NAME = "Codifeed - REST API"
    APP_VERSION = "1.0.0"
    APP_DESCRIPTION = "Flask REST API for Codifeed app."

    API_PREFIX = "/api"

    SQLITE_DB_FILE_PATH = "../database/database.db"
    SQLITE_DB_URI = f"sqlite:///{SQLITE_DB_FILE_PATH}"

    # JWT = [{"jwt": []}]
    # JWT_SECRET_KEY = "hard to guess"
    # JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # 过期时间
    # JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=1)

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


def get_config(env):
    return {
        "development": DevelopmentConfig,
    }.get(env, Config)
