from contextlib import contextmanager
from datetime import date

from sqlmodel import Session, SQLModel, create_engine, select

from app.config import Config
from app.models import Profile, User
from app.utils.password import generate_password, hash_password

database_url = Config.DATABASE_URL or ""

engine = create_engine(
    database_url,
    echo=False,
)


@contextmanager
def get_session():
    """Get a session for the database"""
    with Session(engine) as session:
        yield session


def init_db():
    """Initialize the database and create all tables"""
    SQLModel.metadata.create_all(engine)

    default_user = {
        "name": Config.FIRST_ADMIN_NAME,
        "username": Config.FIRST_ADMIN_USERNAME,
        "email": Config.FIRST_ADMIN_EMAIL,
        "hashed_password": hash_password(
            Config.FIRST_ADMIN_PASSWORD if Config.FIRST_ADMIN_PASSWORD else generate_password(),
        ),
    }

    default_profile = {
        "bio": "I am a test user.",
        "location": "Toulouse, France",
        "website": "https://bastienbuild.dev",
        "birthdate": date(1995, 7, 8),
    }

    with get_session() as session:
        if session.exec(select(User).where(User.email == default_user["email"])).first() is None:
            user = User.model_validate(default_user)
            profile = Profile.model_validate(default_profile)

            user.profile = profile

            session.add(user)
            session.commit()
