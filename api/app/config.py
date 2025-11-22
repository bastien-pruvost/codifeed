import os
import re
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv(".env.local")


class Config:
    # App Config
    APP_NAME = "Codifeed - REST API"
    APP_VERSION = "1.0.0"
    APP_DESCRIPTION = "Flask REST API for Codifeed app."

    # First User Config
    FIRST_ADMIN_NAME = os.getenv("FIRST_ADMIN_NAME")
    FIRST_ADMIN_USERNAME = os.getenv("FIRST_ADMIN_USERNAME")
    FIRST_ADMIN_EMAIL = os.getenv("FIRST_ADMIN_EMAIL")
    FIRST_ADMIN_PASSWORD = os.getenv("FIRST_ADMIN_PASSWORD")

    # Flask Config
    SECRET_KEY = os.getenv("SECRET_KEY")
    API_PREFIX = "/api"

    # CORS Config
    CORS_ORIGINS = [
        re.compile(origin.strip())
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    ]
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_ALLOW_HEADERS = ["Content-Type", "Authorization", "X-CSRF-TOKEN"]

    # JWT Config
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ["cookies"]

    JWT_COOKIE_DOMAIN = os.getenv("JWT_COOKIE_DOMAIN")
    JWT_ERROR_MESSAGE_KEY = "message"

    # Swagger Config
    SWAGGER_CONFIG = {
        "docExpansion": "list",
        "tryItOutEnabled": False,
        "persistAuthorization": True,
    }


class ProductionConfig(Config):
    DEBUG = False
    FLASK_DEBUG = False
    TESTING = False
    JWT_COOKIE_SAMESITE = "None"
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_CSRF_PROTECT = True
    DATABASE_URL = os.getenv("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")


class DevelopmentConfig(Config):
    DEBUG = False
    FLASK_DEBUG = True
    TESTING = False
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_CSRF_PROTECT = True
    DATABASE_URL = os.getenv("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")


class TestingConfig(Config):
    DEBUG = True
    FLASK_DEBUG = True
    TESTING = True
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_CSRF_PROTECT = False  # Disable CSRF for easier testing
    DATABASE_URL = os.getenv("TEST_DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DATABASE_URL")


def get_config():
    env = os.getenv("FLASK_ENV", "production")
    return {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig,
    }.get(env, Config)
