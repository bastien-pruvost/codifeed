from sqlmodel import SQLModel, select

from app.database.session import get_session
from app.models.users import User
from app.utils.hashing import hash_password

from .engine import engine


def init_db():
    """Initialize the database and create all tables"""
    SQLModel.metadata.create_all(engine)

    # Generate a default user if no users exist
    default_user = {
        "email": "test-1@test.com",
        "hashed_password": hash_password("password"),
        "firstname": "John",
        "lastname": "Doe",
    }
    with get_session() as session:
        if session.exec(select(User).where(User.email == default_user["email"])).first() is None:
            user = User.model_validate(default_user)
            session.add(user)
            session.commit()
