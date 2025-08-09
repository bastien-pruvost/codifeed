import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv(".env.local")


class Config:
    # APP Config
    APP_NAME = "Codifeed - REST API"
    APP_VERSION = "1.0.0"
    APP_DESCRIPTION = "Flask REST API for Codifeed app."

    # FLASK Config
    SECRET_KEY = os.getenv("SECRET_KEY")
    API_PREFIX = "/api"

    # CORS Config
    CORS_ORIGINS = [
        origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    ]
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ALLOW_HEADERS = ["Content-Type", "Authorization", "X-CSRF-TOKEN"]

    # JWT Config
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_SAMESITE = "None"
    JWT_COOKIE_DOMAIN = None

    # Error messages
    JWT_ERROR_MESSAGE_KEY = "message"
    ERROR_MESSAGE_KEY = "message"

    # SWAGGER Config
    SWAGGER_CONFIG = {
        "docExpansion": "list",
        "tryItOutEnabled": False,
        "persistAuthorization": True,
    }

    # Database Config
    DATABASE_URL = os.getenv("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False


def get_config(env):
    return {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
    }.get(env, ProductionConfig)
