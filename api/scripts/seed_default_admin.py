import os
from datetime import date

from sqlmodel import select

from app.config import get_config
from app.database import get_session
from app.models import Profile, User
from app.utils.password import hash_password

config = get_config()


def seed_default_admin_if_needed() -> None:
    """Seed default admin user if needed"""

    should_seed_admin = os.getenv("SEED_DEFAULT_ADMIN", "").lower() in ("1", "true", "yes")
    everything_is_set = all(
        [config.FIRST_ADMIN_NAME, config.FIRST_ADMIN_USERNAME, config.FIRST_ADMIN_EMAIL]
    )

    if not should_seed_admin:
        return

    if not everything_is_set:
        print("⚠️  Default admin user seeding skipped: some configuration is missing")
        return

    print("🌱 Seeding default admin user...")
    _ensure_default_admin()
    print("✅ Default admin user seeding completed")


def _ensure_default_admin() -> None:
    """Ensure default admin user exists"""
    default_user = {
        "name": config.FIRST_ADMIN_NAME,
        "username": config.FIRST_ADMIN_USERNAME,
        "email": config.FIRST_ADMIN_EMAIL,
        "hashed_password": hash_password(config.FIRST_ADMIN_PASSWORD),
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
            user = User(**default_user, profile=Profile(**default_profile))
            session.add(user)
            session.commit()
