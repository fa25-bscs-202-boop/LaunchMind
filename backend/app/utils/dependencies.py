from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


GUEST_EMAIL = "guest@launchmind.local"


def get_or_create_guest_user(db: Session) -> User:
    user = db.query(User).filter(User.email == GUEST_EMAIL).first()

    if user:
        return user

    user = User(
        name="Guest",
        email=GUEST_EMAIL,
        password_hash="guest-login-disabled",
        provider="guest",
        provider_id="local",
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    if not token:
        return get_or_create_guest_user(db)

    payload = decode_access_token(token)

    if not payload:
        return get_or_create_guest_user(db)

    email = payload.get("sub")

    if not email:
        return get_or_create_guest_user(db)

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return get_or_create_guest_user(db)

    return user
