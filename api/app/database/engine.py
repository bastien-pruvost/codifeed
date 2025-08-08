from sqlmodel import create_engine

from app.config import Config

database_url = Config.DATABASE_URL or ""

engine = create_engine(
    database_url,
    echo=False,
)
