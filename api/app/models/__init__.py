import uuid

from humps import camelize
from sqlmodel import Field, Session, SQLModel, create_engine

sqlite_file_path = "../database/database.db"
sqlite_url = f"sqlite:///{sqlite_file_path}"
engine = create_engine(
    sqlite_url,
    echo=False,
)


def init_db():
    """Initialize the database and create all tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a session for the database"""
    with Session(engine) as session:
        yield session


def to_camel(string):
    return camelize(string)


class BaseModel(SQLModel):
    class Config:
        alias_generator = to_camel
        validate_by_name = True


class SQLModelWithId(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class MessageResponse(BaseModel):
    message: str
