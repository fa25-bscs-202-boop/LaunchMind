from urllib.parse import quote

from fastapi import APIRouter, Depends, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.services.oauth_service import (
    build_github_auth_url,
    build_google_auth_url,
    exchange_github_code_for_user,
    exchange_google_code_for_user,
)
from app.utils.email import is_gmail_address
from app.utils.security import create_access_token, hash_password


router = APIRouter(prefix="/auth", tags=["oauth"])


def oauth_error_redirect(message: str = "Authentication failed"):
    safe_message = quote(message)
    return RedirectResponse(f"{settings.FRONTEND_URL}/oauth/error?message={safe_message}")


def oauth_not_configured_redirect():
    return oauth_error_redirect("OAuth login is not configured yet")


def get_or_create_oauth_user(profile: dict, db: Session) -> User:
    email = profile["email"].lower()
    user = db.query(User).filter(User.email == email).first()

    if user:
        if not user.provider:
            user.provider = profile["provider"]
        if not user.provider_id:
            user.provider_id = profile["provider_id"]
        user.is_verified = True
        user.verification_code_hash = None
        user.verification_code_expires_at = None
        db.commit()
        db.refresh(user)
        return user

    user = User(
        name=profile["name"] or email.split("@")[0],
        email=email,
        password_hash=hash_password(f"oauth:{profile['provider']}:{profile['provider_id']}"),
        provider=profile["provider"],
        provider_id=profile["provider_id"],
        is_verified=True,
    )
    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return existing_user
        raise

    db.refresh(user)
    return user


def finish_oauth_login(profile: dict, db: Session):
    if not is_gmail_address(profile.get("email", "")):
        return oauth_error_redirect()

    user = get_or_create_oauth_user(profile, db)
    access_token = create_access_token(data={"sub": user.email})

    return RedirectResponse(
        f"{settings.FRONTEND_URL}/oauth/success?token={access_token}"
    )


@router.get("/google/login")
def google_login():
    try:
        auth_url = build_google_auth_url()
    except ValueError:
        return oauth_not_configured_redirect()

    return RedirectResponse(auth_url)


@router.get("/google/callback")
def google_callback(
    code: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not code:
        return oauth_error_redirect()

    try:
        profile = exchange_google_code_for_user(code)
        return finish_oauth_login(profile, db)
    except ValueError:
        return oauth_not_configured_redirect()
    except Exception:
        return oauth_error_redirect()


@router.get("/github/login")
def github_login():
    try:
        auth_url = build_github_auth_url()
    except ValueError:
        return oauth_not_configured_redirect()

    return RedirectResponse(auth_url)


@router.get("/github/callback")
def github_callback(
    code: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not code:
        return oauth_error_redirect()

    try:
        profile = exchange_github_code_for_user(code)
        return finish_oauth_login(profile, db)
    except ValueError:
        return oauth_not_configured_redirect()
    except Exception:
        return oauth_error_redirect()
