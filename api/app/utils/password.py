from argon2 import PasswordHasher

ph = PasswordHasher()


def hash_password(password: str) -> str:
    """Hash a password using Argon2"""
    return ph.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed password"""
    return ph.verify(hashed_password, password)


def generate_password() -> str:
    """Generate a random and secure password"""
    import secrets
    import string

    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(16))
