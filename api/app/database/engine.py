from sqlmodel import create_engine

from app.config import Config

sqlite_url = Config.DATABASE_URL or ""

engine = create_engine(
    sqlite_url,
    echo=False,
)
