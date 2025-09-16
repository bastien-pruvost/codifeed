from contextlib import contextmanager
from datetime import date

from sqlmodel import Session, SQLModel, create_engine, select

from app.config import get_config
from app.models import Profile, User
from app.utils.password import generate_password, hash_password

config = get_config()

database_url = config.DATABASE_URL

engine = create_engine(database_url, echo=False)


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

    default_user = {
        "name": config.FIRST_ADMIN_NAME,
        "username": config.FIRST_ADMIN_USERNAME,
        "email": config.FIRST_ADMIN_EMAIL,
        "hashed_password": hash_password(
            config.FIRST_ADMIN_PASSWORD if config.FIRST_ADMIN_PASSWORD else generate_password(),
        ),
        "avatar": f"https://api.dicebear.com/9.x/bottts/webp?seed={config.FIRST_ADMIN_USERNAME}",
    }

    default_profile = {
        "bio": "Administrator of the Codifeed app.",
        "location": "Paris, France",
        "website": "https://codifeed.bastienlimbour.com",
        "birthdate": date(1995, 6, 21),
    }

    with get_session() as session:
        if session.exec(select(User).where(User.email == default_user["email"])).first() is None:
            user = User.model_validate(default_user)
            profile = Profile.model_validate(default_profile)

            user.profile = profile

            session.add(user)
            session.commit()
