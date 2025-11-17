"""Pytest configuration and fixtures for integration tests."""

import os
from collections.abc import Generator

import pytest
from faker import Faker
from flask import Flask
from flask.testing import FlaskClient
from flask_openapi3.openapi import OpenAPI
from sqlmodel import Session
from testcontainers.core.container import LogMessageWaitStrategy
from testcontainers.postgres import PostgresContainer

from app.models import UserCreate
from app.services.auth_service import AuthService
from app.utils.jwt import create_tokens

os.environ["FLASK_ENV"] = "testing"


@pytest.fixture(scope="session")
def postgres_container() -> Generator[PostgresContainer, None, None]:
    """Start a PostgreSQL container for the test session.

    This fixture automatically starts a PostgreSQL container using Testcontainers
    and sets the TEST_DATABASE_URL environment variable to the container's connection URL.
    The container is automatically cleaned up after all tests complete.
    """

    container = PostgresContainer("postgres:17", driver="psycopg2").waiting_for(
        LogMessageWaitStrategy("database system is ready to accept connections")
    )

    with container:
        os.environ["TEST_DATABASE_URL"] = container.get_connection_url()
        yield container


@pytest.fixture(scope="session")
def db_url(postgres_container: PostgresContainer) -> str:
    """Provide the test database URL for the test session."""
    return postgres_container.get_connection_url()


@pytest.fixture(scope="session")
def faker_instance() -> Faker:
    """Provide a Faker instance for generating test data."""
    return Faker()


@pytest.fixture(scope="session")
def app(postgres_container: PostgresContainer) -> Generator[OpenAPI, None, None]:
    """Create and configure a Flask app instance for testing.

    This fixture is session-scoped because the app configuration doesn't change
    between tests. The database is already initialized with tables and extensions
    when create_app() calls init_db().

    Depends on postgres_container to ensure PostgreSQL is running before app creation.
    """
    from app import create_app

    app = create_app()

    # Provide app context for the entire test session
    with app.app_context():
        yield app


@pytest.fixture(scope="function")
def client(app: Flask) -> FlaskClient:
    """Provide a Flask test client for making HTTP requests."""
    return app.test_client()


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Provide a database session for direct DB access in tests.

    Note: This session is independent from sessions used by the test client.
    HTTP requests made via the client will use their own get_session() calls
    and commit independently.
    """
    from app.database import get_session

    with get_session() as session:
        yield session


@pytest.fixture(scope="function")
def sample_user_data(faker_instance: Faker) -> dict:
    """Generate realistic sample user data for testing."""
    return {
        "name": faker_instance.name(),
        "username": faker_instance.user_name()
        + faker_instance.random_int(min=1000, max=9999).__str__(),
        "email": faker_instance.email(),
        "password": faker_instance.password(length=12),
    }


@pytest.fixture(scope="function")
def create_user(db_session: Session, sample_user_data: dict):
    """Create a user in the database and return the User instance.

    This fixture returns a function that can be called multiple times
    to create different users with different data.
    """

    def _create_user(user_data: dict | None = None):
        """Create a user with the provided data or use sample_user_data."""
        data = user_data if user_data is not None else sample_user_data
        user_create = UserCreate(**data)
        user = AuthService.create_user(db_session, user_create)
        return user

    return _create_user


@pytest.fixture(scope="function")
def created_user(create_user):
    """Create and return a single user for tests that need one user."""
    return create_user()


@pytest.fixture(scope="function")
def auth_tokens_for_user(app: Flask):
    """Generate JWT tokens for a given user.

    Returns a function that accepts a user and returns a dict of cookie names
    to token values.
    """

    def _auth_tokens(user):
        """Generate access and refresh tokens for the given user."""
        with app.app_context():
            access_token, refresh_token = create_tokens(user.id)
            return {
                "access_token_cookie": access_token,
                "refresh_token_cookie": refresh_token,
            }

    return _auth_tokens


@pytest.fixture(scope="function")
def authenticated_client(client: FlaskClient, created_user, auth_tokens_for_user) -> FlaskClient:
    """Provide a test client with authentication cookies already set.

    This is a convenience fixture for tests that need an authenticated client.
    """
    tokens = auth_tokens_for_user(created_user)

    # Set cookies on the test client
    client.set_cookie(
        key="access_token_cookie",
        value=tokens["access_token_cookie"],
        domain="localhost",
    )
    client.set_cookie(
        key="refresh_token_cookie",
        value=tokens["refresh_token_cookie"],
        domain="localhost",
    )

    return client
