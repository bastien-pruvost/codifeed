import os

from sqlmodel import create_engine

sqlite_url = os.getenv("DATABASE_URL") or ""

engine = create_engine(
    sqlite_url,
    echo=False,
)
