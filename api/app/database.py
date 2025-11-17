from contextlib import contextmanager

from sqlmodel import Session, SQLModel, create_engine

from app.config import get_config

config = get_config()

engine = create_engine(config.DATABASE_URL, echo=False)


@contextmanager
def get_session():
    """Get a session for the database"""
    with Session(engine) as session:
        yield session


def init_db():
    """Initialize the database and create all tables"""

    with engine.begin() as conn:
        conn.exec_driver_sql("CREATE EXTENSION IF NOT EXISTS pg_trgm")
        conn.exec_driver_sql("CREATE EXTENSION IF NOT EXISTS unaccent")

    SQLModel.metadata.create_all(engine)
