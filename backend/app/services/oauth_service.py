from urllib.parse import urlencode

import requests

from app.config import settings


GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"


def ensure_provider_configured(client_id: str, client_secret: str):
    if not client_id or not client_secret:
        raise ValueError("OAuth provider is not configured.")


def build_google_auth_url() -> str:
    ensure_provider_configured(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET)

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }

    return f"{GOOGLE_AUTH_URL}?{urlencode(params)}"


def exchange_google_code_for_user(code: str) -> dict:
    ensure_provider_configured(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET)

    token_response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        },
        timeout=15,
    )
    token_response.raise_for_status()
    access_token = token_response.json().get("access_token")

    user_response = requests.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )
    user_response.raise_for_status()
    profile = user_response.json()

    return {
        "provider": "google",
        "provider_id": str(profile.get("sub", "")),
        "email": profile.get("email", ""),
        "name": profile.get("name") or profile.get("email", "").split("@")[0],
    }


def build_github_auth_url() -> str:
    ensure_provider_configured(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)

    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "read:user user:email",
        "allow_signup": "true",
    }

    return f"{GITHUB_AUTH_URL}?{urlencode(params)}"


def get_github_verified_primary_email(access_token: str, fallback_email: str | None) -> str:
    emails_response = requests.get(
        GITHUB_EMAILS_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )

    if emails_response.ok:
        emails = emails_response.json()
        for email_info in emails:
            if email_info.get("primary") and email_info.get("verified"):
                return email_info.get("email", "")

        for email_info in emails:
            if email_info.get("verified"):
                return email_info.get("email", "")

    return fallback_email or ""


def exchange_github_code_for_user(code: str) -> dict:
    ensure_provider_configured(settings.GITHUB_CLIENT_ID, settings.GITHUB_CLIENT_SECRET)

    token_response = requests.post(
        GITHUB_TOKEN_URL,
        data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.GITHUB_REDIRECT_URI,
        },
        headers={"Accept": "application/json"},
        timeout=15,
    )
    token_response.raise_for_status()
    access_token = token_response.json().get("access_token")

    user_response = requests.get(
        GITHUB_USER_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )
    user_response.raise_for_status()
    profile = user_response.json()
    email = get_github_verified_primary_email(access_token, profile.get("email"))

    return {
        "provider": "github",
        "provider_id": str(profile.get("id", "")),
        "email": email,
        "name": profile.get("name") or profile.get("login") or email.split("@")[0],
    }
