import os
from typing import Iterable

from sqlmodel import select

from app.database import get_session
from app.models import Profile, User
from app.utils.password import hash_password
from fixtures.users import USERS_FIXTURES


def ensure_users(fixtures: Iterable[dict]) -> None:
    """Insert users + profiles from fixtures if they don't already exist."""
    created_count = 0
    skipped_count = 0

    fake_user_password = os.getenv("FAKE_USER_PASSWORD", None)

    if not fake_user_password:
        raise ValueError("FAKE_USER_PASSWORD is not set")

    with get_session() as session:
        for item in fixtures:
            user_data = dict(item.get("user", {}))
            profile_data = dict(item.get("profile", {}))

            avatar = f"https://api.dicebear.com/9.x/bottts/webp?seed={user_data['username']}"

            existing = session.exec(select(User).where(User.email == user_data["email"])).first()
            if existing is not None:
                skipped_count += 1
                continue

            user = User(
                **user_data,
                avatar=avatar,
                hashed_password=hash_password(fake_user_password),
                profile=Profile(**profile_data),
            )

            session.add(user)
            created_count += 1

        if created_count:
            session.commit()

    print(f"Seed complete. created={created_count} skipped={skipped_count}")


def main() -> None:
    ensure_users(USERS_FIXTURES)


if __name__ == "__main__":
    main()
