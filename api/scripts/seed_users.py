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
            user_data = dict(item["user"])  # shallow copy
            profile_data = dict(item.get("profile", {}))

            email = user_data["email"]

            existing = session.exec(select(User).where(User.email == email)).first()
            if existing is not None:
                skipped_count += 1
                continue

            user = User.model_validate(
                {
                    **user_data,
                    "hashed_password": hash_password(fake_user_password),
                    "avatar": f"https://api.dicebear.com/9.x/bottts/webp?seed={user_data['username']}",
                },
            )

            profile = Profile.model_validate(profile_data)
            user.profile = profile

            session.add(user)
            created_count += 1

        if created_count:
            session.commit()

    print(f"Seed complete. created={created_count} skipped={skipped_count}")


def main() -> None:
    ensure_users(USERS_FIXTURES)


if __name__ == "__main__":
    main()
