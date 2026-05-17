"""Small email helpers used by authentication routes."""


def is_gmail_address(email: str) -> bool:
    """Return True when the email is a Gmail address."""
    return bool(email) and email.strip().lower().endswith("@gmail.com")
