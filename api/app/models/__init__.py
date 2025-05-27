from humps import camelize
from sqlmodel import Session, SQLModel, create_engine

sqlite_file_path = "../database/database.db"
sqlite_url = f"sqlite:///{sqlite_file_path}"
engine = create_engine(sqlite_url, echo=True)


def init_db():
    """Initialize the database and create all tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a session for the database"""
    with Session(engine) as session:
        yield session


def to_camel(string):
    return camelize(string)


class CamelModel(SQLModel):
    class Config:
        alias_generator = to_camel
        validate_by_name = True
