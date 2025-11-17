import os
from typing import Iterable

from sqlmodel import select

from app.database import get_session
from app.models import Post, PostLike, Profile, User, UserFollow
from app.utils.password import hash_password
from fixtures.fake_data_fixtures import FOLLOWS_FIXTURES, POSTS_FIXTURES, USERS_FIXTURES


def seed_fake_data_if_needed() -> None:
    """Seed fake data if needed"""

    if os.getenv("SEED_FAKE_DATA", "").lower() in ("1", "true", "yes"):
        print("🌱 Seeding fake data...")
        _ensure_users(USERS_FIXTURES)
        _ensure_posts(POSTS_FIXTURES)
        _ensure_follows(FOLLOWS_FIXTURES)
        print("✅ Fake data seeding completed")


def _ensure_users(fixtures: Iterable[dict]) -> None:
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
            )

            user.hashed_password = hash_password(fake_user_password)
            user.profile = Profile(**profile_data)

            session.add(user)
            created_count += 1

        if created_count:
            session.commit()

    print(f"Users seed complete. created={created_count} skipped={skipped_count}")


def _ensure_posts(fixtures: Iterable[dict]) -> None:
    """Insert demo posts (and their likes) if they don't already exist."""
    posts_created = 0
    posts_skipped = 0
    likes_created = 0
    likes_skipped = 0
    likes_missing_refs = 0

    with get_session() as session:
        for item in fixtures:
            author_username = str(item.get("author_username", "")).strip()
            content = str(item.get("content", "")).strip()
            created_at = item.get("created_at")

            if not author_username or not content:
                posts_skipped += 1
                continue

            author = session.exec(select(User).where(User.username == author_username)).first()
            if not author or not author.id:
                posts_skipped += 1
                continue

            post = session.exec(
                select(Post).where(Post.author_id == author.id, Post.content == content)
            ).first()

            if post is None:
                post = Post(content=content, author_id=author.id)
                if created_at:
                    post.created_at = created_at
                session.add(post)
                posts_created += 1
                session.flush()
            else:
                posts_skipped += 1

            like_usernames = list(item.get("likes", []) or [])
            for like_username in like_usernames:
                liker = session.exec(
                    select(User).where(User.username == str(like_username).strip())
                ).first()
                if not liker or not liker.id or not post.id:
                    likes_missing_refs += 1
                    continue

                existing_like = session.exec(
                    select(PostLike).where(
                        PostLike.user_id == liker.id, PostLike.post_id == post.id
                    )
                ).first()
                if existing_like is not None:
                    likes_skipped += 1
                    continue

                session.add(PostLike(user_id=liker.id, post_id=post.id))
                likes_created += 1

        if posts_created or likes_created:
            session.commit()

    print(f"Posts seed complete. posts_created={posts_created} posts_skipped={posts_skipped} ")
    print(
        "Likes seed complete. "
        f"likes_created={likes_created} likes_skipped={likes_skipped} "
        f"likes_missing_refs={likes_missing_refs}"
    )


def _ensure_follows(fixtures: Iterable[dict]) -> None:
    """Insert follow relationships if they don't already exist."""
    created_count = 0
    skipped_count = 0
    missing_refs = 0

    with get_session() as session:
        for item in fixtures:
            follower_username = str(item.get("follower", "")).strip()
            following_username = str(item.get("following", "")).strip()

            if not follower_username or not following_username:
                skipped_count += 1
                continue

            if follower_username == following_username:
                skipped_count += 1
                continue

            follower = session.exec(select(User).where(User.username == follower_username)).first()
            following = session.exec(
                select(User).where(User.username == following_username)
            ).first()

            if not follower or not follower.id or not following or not following.id:
                missing_refs += 1
                continue

            existing_follow = session.exec(
                select(UserFollow).where(
                    UserFollow.follower_id == follower.id,
                    UserFollow.following_id == following.id,
                )
            ).first()
            if existing_follow is not None:
                skipped_count += 1
                continue

            session.add(UserFollow(follower_id=follower.id, following_id=following.id))
            created_count += 1

        if created_count:
            session.commit()

    print(
        "Follows seed complete. "
        f"created={created_count} skipped={skipped_count} missing_refs={missing_refs}"
    )


# def main() -> None:
#     ensure_users(USERS_FIXTURES)
#     ensure_posts(POSTS_FIXTURES)
#     ensure_follows(FOLLOWS_FIXTURES)


# if __name__ == "__main__":
#     main()
